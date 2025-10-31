"""
Standalone Backend Server with SQLite (no MongoDB needed)
This version uses SQLite instead of MongoDB for true portability
"""

from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import PyPDF2
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import io
import sqlite3
import json


# Get the directory where the executable is located
if getattr(sys, 'frozen', False):
    # Running as compiled executable
    ROOT_DIR = Path(sys._MEIPASS)
    DATA_DIR = Path(os.path.dirname(sys.executable))
else:
    # Running as script
    ROOT_DIR = Path(__file__).parent
    DATA_DIR = ROOT_DIR

# SQLite database path
DB_PATH = DATA_DIR / 'pdf_email_manager.db'

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_templates (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_accounts (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class EmailTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subject: str
    body: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailTemplateCreate(BaseModel):
    name: str
    subject: str
    body: str

class EmailAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EmailAccountCreate(BaseModel):
    email: str
    name: str

class PDFExtraction(BaseModel):
    filename: str
    emails: List[str]
    file_path: str

class ExtractRequest(BaseModel):
    folder_path: str

class DraftEmailRequest(BaseModel):
    pdf_filename: str
    pdf_path: str
    recipient_email: str
    sender_email: Optional[str] = None
    sender_name: Optional[str] = None
    subject: str
    body: str


# Utility function to extract emails from text
def extract_emails_from_text(text: str) -> List[str]:
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    return list(set(emails))

# Utility function to extract text from PDF
def extract_text_from_pdf(pdf_path: str) -> str:
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        logging.error(f"Error extracting text from {pdf_path}: {e}")
        return ""

# Utility function to extract text from PDF file object
def extract_text_from_pdf_file(pdf_file: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        logging.error(f"Error extracting text from PDF file: {e}")
        return ""


# Email Account Routes
@api_router.get("/email-accounts", response_model=List[EmailAccount])
async def get_email_accounts():
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, name, created_at FROM email_accounts")
    rows = cursor.fetchall()
    conn.close()
    
    accounts = []
    for row in rows:
        accounts.append(EmailAccount(
            id=row[0],
            email=row[1],
            name=row[2],
            created_at=datetime.fromisoformat(row[3])
        ))
    return accounts

@api_router.post("/email-accounts", response_model=EmailAccount)
async def create_email_account(input: EmailAccountCreate):
    account = EmailAccount(**input.model_dump())
    
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO email_accounts (id, email, name, created_at) VALUES (?, ?, ?, ?)",
        (account.id, account.email, account.name, account.created_at.isoformat())
    )
    conn.commit()
    conn.close()
    
    return account

@api_router.delete("/email-accounts/{account_id}")
async def delete_email_account(account_id: str):
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("DELETE FROM email_accounts WHERE id = ?", (account_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Email account not found")
    return {"message": "Email account deleted successfully"}


# Template Routes
@api_router.get("/templates", response_model=List[EmailTemplate])
async def get_templates():
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, subject, body, created_at FROM email_templates")
    rows = cursor.fetchall()
    conn.close()
    
    templates = []
    for row in rows:
        templates.append(EmailTemplate(
            id=row[0],
            name=row[1],
            subject=row[2],
            body=row[3],
            created_at=datetime.fromisoformat(row[4])
        ))
    return templates

@api_router.post("/templates", response_model=EmailTemplate)
async def create_template(input: EmailTemplateCreate):
    template = EmailTemplate(**input.model_dump())
    
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO email_templates (id, name, subject, body, created_at) VALUES (?, ?, ?, ?, ?)",
        (template.id, template.name, template.subject, template.body, template.created_at.isoformat())
    )
    conn.commit()
    conn.close()
    
    return template

@api_router.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    cursor.execute("DELETE FROM email_templates WHERE id = ?", (template_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}


# PDF Extraction Route
@api_router.post("/pdf/extract", response_model=List[PDFExtraction])
async def extract_emails_from_pdfs(request: ExtractRequest):
    folder_path = request.folder_path
    folder_path = folder_path.replace('\\\\', '\\').strip('"').strip("'")
    
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=400, detail=f"Folder path does not exist: {folder_path}")
    
    if not os.path.isdir(folder_path):
        raise HTTPException(status_code=400, detail="Path is not a directory")
    
    results = []
    
    try:
        pdf_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.pdf')]
    except PermissionError:
        raise HTTPException(status_code=403, detail="Permission denied to access folder")
    
    if not pdf_files:
        raise HTTPException(status_code=404, detail="No PDF files found in the specified folder")
    
    for pdf_file in pdf_files:
        file_path = os.path.join(folder_path, pdf_file)
        text = extract_text_from_pdf(file_path)
        emails = extract_emails_from_text(text)
        
        results.append(PDFExtraction(
            filename=pdf_file,
            emails=emails,
            file_path=file_path
        ))
    
    return results


# PDF Upload and Extract Route
@api_router.post("/pdf/upload-extract", response_model=List[PDFExtraction])
async def upload_and_extract_emails(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    
    results = []
    temp_dir = DATA_DIR / 'temp'
    temp_dir.mkdir(exist_ok=True)
    
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            continue
        
        content = await file.read()
        text = extract_text_from_pdf_file(content)
        emails = extract_emails_from_text(text)
        
        temp_path = temp_dir / f"{uuid.uuid4().hex}_{file.filename}"
        with open(temp_path, 'wb') as f:
            f.write(content)
        
        results.append(PDFExtraction(
            filename=file.filename,
            emails=emails,
            file_path=str(temp_path)
        ))
    
    if not results:
        raise HTTPException(status_code=400, detail="No valid PDF files uploaded")
    
    return results


# Outlook Draft Generation Route
@api_router.post("/outlook/draft")
async def create_outlook_draft(request: DraftEmailRequest):
    try:
        msg = MIMEMultipart()
        msg['To'] = request.recipient_email
        msg['Subject'] = request.subject
        
        if request.sender_email:
            if request.sender_name:
                msg['From'] = f'"{request.sender_name}" <{request.sender_email}>'
            else:
                msg['From'] = request.sender_email
        
        msg.attach(MIMEText(request.body, 'html'))
        
        if os.path.exists(request.pdf_path):
            with open(request.pdf_path, 'rb') as attachment:
                part = MIMEBase('application', 'pdf')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header('Content-Disposition', f'attachment; filename={request.pdf_filename}')
                msg.attach(part)
        else:
            raise HTTPException(status_code=404, detail=f"PDF file not found: {request.pdf_path}")
        
        eml_filename = f"draft_{uuid.uuid4().hex[:8]}_{request.pdf_filename.replace('.pdf', '')}.eml"
        eml_dir = DATA_DIR / 'drafts'
        eml_dir.mkdir(exist_ok=True)
        eml_path = eml_dir / eml_filename
        
        with open(eml_path, 'w', encoding='utf-8') as eml_file:
            eml_file.write(msg.as_string())
        
        return FileResponse(
            eml_path,
            media_type='message/rfc822',
            filename=eml_filename,
            headers={
                "Content-Disposition": f"attachment; filename={eml_filename}",
                "Content-Type": "message/rfc822"
            }
        )
        
    except Exception as e:
        logging.error(f"Error creating draft: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Outlook Draft Generation from Upload Route
@api_router.post("/outlook/draft-upload")
async def create_outlook_draft_from_upload(
    pdf_file: UploadFile = File(...),
    recipient_email: str = Form(...),
    subject: str = Form(...),
    body: str = Form(...),
    sender_email: str = Form(None),
    sender_name: str = Form(None)
):
    try:
        msg = MIMEMultipart()
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        if sender_email:
            if sender_name:
                msg['From'] = f'"{sender_name}" <{sender_email}>'
            else:
                msg['From'] = sender_email
        
        msg.attach(MIMEText(body, 'html'))
        
        pdf_content = await pdf_file.read()
        part = MIMEBase('application', 'pdf')
        part.set_payload(pdf_content)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={pdf_file.filename}')
        msg.attach(part)
        
        eml_filename = f"draft_{uuid.uuid4().hex[:8]}_{pdf_file.filename.replace('.pdf', '')}.eml"
        eml_dir = DATA_DIR / 'drafts'
        eml_dir.mkdir(exist_ok=True)
        eml_path = eml_dir / eml_filename
        
        with open(eml_path, 'w', encoding='utf-8') as eml_file:
            eml_file.write(msg.as_string())
        
        return FileResponse(
            eml_path,
            media_type='message/rfc822',
            filename=eml_filename,
            headers={
                "Content-Disposition": f"attachment; filename={eml_filename}",
                "Content-Type": "message/rfc822"
            }
        )
        
    except Exception as e:
        logging.error(f"Error creating draft from upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/")
async def root():
    return {"message": "PDF Email Manager API - Standalone Version"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


if __name__ == "__main__":
    import uvicorn
    import sys
    
    port = 8001
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except:
            pass
    
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
