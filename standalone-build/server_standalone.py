"""
Speedy Statements - Standalone Server
This is the standalone version of the backend server for desktop deployment
"""
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
import os
import sys
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
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
import json
import asyncio


# JSON Storage Module (embedded)
class JSONStorage:
    """Async JSON storage for local data persistence"""
    
    def __init__(self, data_dir: Optional[str] = None):
        if data_dir is None:
            if os.name == 'nt':  # Windows
                appdata = os.environ.get('APPDATA', os.path.expanduser('~'))
                self.data_dir = Path(appdata) / 'SpeedyStatements' / 'data'
            else:
                self.data_dir = Path.home() / '.speedystatements' / 'data'
        else:
            self.data_dir = Path(data_dir)
        
        self.data_dir.mkdir(parents=True, exist_ok=True)
        
        self.collections = {
            'email_templates': self.data_dir / 'templates.json',
            'email_accounts': self.data_dir / 'accounts.json'
        }
        
        for collection_file in self.collections.values():
            if not collection_file.exists():
                self._write_file(collection_file, [])
    
    def _read_file(self, file_path: Path) -> List[dict]:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    
    def _write_file(self, file_path: Path, data: List[dict]) -> None:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    async def find(self, collection: str, query: dict = None) -> List[dict]:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._find_sync, collection, query)
    
    def _find_sync(self, collection: str, query: dict = None) -> List[dict]:
        file_path = self.collections.get(collection)
        if not file_path:
            return []
        
        data = self._read_file(file_path)
        
        if query is None or query == {}:
            return data
        
        results = []
        for item in data:
            match = True
            for key, value in query.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                results.append(item)
        
        return results
    
    async def insert_one(self, collection: str, document: dict) -> dict:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._insert_one_sync, collection, document)
    
    def _insert_one_sync(self, collection: str, document: dict) -> dict:
        file_path = self.collections.get(collection)
        if not file_path:
            raise ValueError(f"Unknown collection: {collection}")
        
        data = self._read_file(file_path)
        data.append(document)
        self._write_file(file_path, data)
        return document
    
    async def delete_one(self, collection: str, query: dict) -> int:
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self._delete_one_sync, collection, query)
    
    def _delete_one_sync(self, collection: str, query: dict) -> int:
        file_path = self.collections.get(collection)
        if not file_path:
            return 0
        
        data = self._read_file(file_path)
        original_length = len(data)
        
        for i, item in enumerate(data):
            match = True
            for key, value in query.items():
                if item.get(key) != value:
                    match = False
                    break
            if match:
                data.pop(i)
                break
        
        if len(data) < original_length:
            self._write_file(file_path, data)
            return 1
        return 0


class CollectionWrapper:
    def __init__(self, storage: JSONStorage, collection_name: str):
        self.storage = storage
        self.collection_name = collection_name
    
    def find(self, query: dict = None, projection: dict = None):
        return FindWrapper(self.storage, self.collection_name, query)
    
    async def insert_one(self, document: dict):
        return await self.storage.insert_one(self.collection_name, document)
    
    async def delete_one(self, query: dict):
        deleted_count = await self.storage.delete_one(self.collection_name, query)
        return type('DeleteResult', (), {'deleted_count': deleted_count})()


class FindWrapper:
    def __init__(self, storage: JSONStorage, collection_name: str, query: dict = None):
        self.storage = storage
        self.collection_name = collection_name
        self.query = query or {}
    
    async def to_list(self, length: Optional[int] = None):
        results = await self.storage.find(self.collection_name, self.query)
        if length is not None and length > 0:
            return results[:length]
        return results


class DatabaseWrapper:
    def __init__(self, storage: JSONStorage):
        self.storage = storage
    
    def __getattr__(self, collection_name: str):
        return CollectionWrapper(self.storage, collection_name)
    
    def __getitem__(self, collection_name: str):
        return CollectionWrapper(self.storage, collection_name)


# Initialize JSON Storage
storage = JSONStorage()
db = DatabaseWrapper(storage)

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class EmailTemplate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
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
    model_config = ConfigDict(extra="ignore")
    
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
    accounts = await db.email_accounts.find({}).to_list(1000)
    
    for account in accounts:
        if isinstance(account['created_at'], str):
            account['created_at'] = datetime.fromisoformat(account['created_at'])
    
    return accounts


@api_router.post("/email-accounts", response_model=EmailAccount)
async def create_email_account(input: EmailAccountCreate):
    account_dict = input.model_dump()
    account_obj = EmailAccount(**account_dict)
    
    doc = account_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    _ = await db.email_accounts.insert_one(doc)
    return account_obj


@api_router.delete("/email-accounts/{account_id}")
async def delete_email_account(account_id: str):
    result = await db.email_accounts.delete_one({"id": account_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Email account not found")
    return {"message": "Email account deleted successfully"}


# Template Routes
@api_router.get("/templates", response_model=List[EmailTemplate])
async def get_templates():
    templates = await db.email_templates.find({}).to_list(1000)
    
    for template in templates:
        if isinstance(template['created_at'], str):
            template['created_at'] = datetime.fromisoformat(template['created_at'])
    
    return templates


@api_router.post("/templates", response_model=EmailTemplate)
async def create_template(input: EmailTemplateCreate):
    template_dict = input.model_dump()
    template_obj = EmailTemplate(**template_dict)
    
    doc = template_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    _ = await db.email_templates.insert_one(doc)
    return template_obj


@api_router.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    result = await db.email_templates.delete_one({"id": template_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}


# PDF Extraction Route
@api_router.post("/pdf/extract", response_model=List[PDFExtraction])
async def extract_emails_from_pdfs(request: ExtractRequest):
    folder_path = request.folder_path
    
    # Normalize path for Windows
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
    
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            continue
        
        content = await file.read()
        text = extract_text_from_pdf_file(content)
        emails = extract_emails_from_text(text)
        
        # Save temporarily for later use
        temp_path = f"/tmp/{uuid.uuid4().hex}_{file.filename}"
        with open(temp_path, 'wb') as f:
            f.write(content)
        
        results.append(PDFExtraction(
            filename=file.filename,
            emails=emails,
            file_path=temp_path
        ))
    
    if not results:
        raise HTTPException(status_code=400, detail="No valid PDF files uploaded")
    
    return results


# Outlook Draft Generation Route
@api_router.post("/outlook/draft")
async def create_outlook_draft(request: DraftEmailRequest):
    try:
        # Create the email message
        msg = MIMEMultipart()
        msg['To'] = request.recipient_email
        msg['Subject'] = request.subject
        
        # Add From field if sender email provided
        if request.sender_email:
            if request.sender_name:
                msg['From'] = f'"{request.sender_name}" <{request.sender_email}>'
            else:
                msg['From'] = request.sender_email
        
        # Add draft-specific headers for Outlook
        msg['X-Unsent'] = '1'
        msg['X-UnsentDraft'] = '1'
        
        # Add body as HTML
        msg.attach(MIMEText(request.body, 'html'))
        
        # Attach PDF file
        if os.path.exists(request.pdf_path):
            with open(request.pdf_path, 'rb') as attachment:
                part = MIMEBase('application', 'pdf')
                part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename={request.pdf_filename}'
                )
                msg.attach(part)
        else:
            raise HTTPException(status_code=404, detail=f"PDF file not found: {request.pdf_path}")
        
        # Save as .eml file
        eml_filename = f"draft_{uuid.uuid4().hex[:8]}_{request.pdf_filename.replace('.pdf', '')}.eml"
        eml_path = os.path.join('/tmp', eml_filename)
        
        with open(eml_path, 'w', encoding='utf-8') as eml_file:
            eml_file.write(msg.as_string())
        
        # Return file for download
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
        # Create the email message
        msg = MIMEMultipart()
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        # Add From field if sender email provided
        if sender_email:
            if sender_name:
                msg['From'] = f'"{sender_name}" <{sender_email}>'
            else:
                msg['From'] = sender_email
        
        # Add draft-specific headers for Outlook
        msg['X-Unsent'] = '1'
        msg['X-UnsentDraft'] = '1'
        
        # Add body as HTML
        msg.attach(MIMEText(body, 'html'))
        
        # Read and attach PDF file
        pdf_content = await pdf_file.read()
        part = MIMEBase('application', 'pdf')
        part.set_payload(pdf_content)
        encoders.encode_base64(part)
        part.add_header(
            'Content-Disposition',
            f'attachment; filename={pdf_file.filename}'
        )
        msg.attach(part)
        
        # Save as .eml file
        eml_filename = f"draft_{uuid.uuid4().hex[:8]}_{pdf_file.filename.replace('.pdf', '')}.eml"
        eml_path = os.path.join('/tmp', eml_filename)
        
        with open(eml_path, 'w', encoding='utf-8') as eml_file:
            eml_file.write(msg.as_string())
        
        # Return file for download
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
    return {"message": "Speedy Statements API"}


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


@app.on_event("shutdown")
async def shutdown_handler():
    # No cleanup needed for JSON storage
    pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
