#!/usr/bin/env python3
"""
Backend API Testing for Outlook Draft Generation
Tests the critical fix for generating editable .eml files with proper draft headers
"""

import requests
import json
import os
import tempfile
from pathlib import Path
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
import io

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = "/app/frontend/.env"
    if os.path.exists(frontend_env_path):
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

print(f"Testing backend at: {API_BASE}")

def create_test_pdf():
    """Create a simple test PDF file with some content"""
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, "Test PDF Document")
    p.drawString(100, 730, "This is a test PDF for email draft generation.")
    p.drawString(100, 710, "Contact: test@example.com")
    p.drawString(100, 690, "Another email: contact@testcompany.com")
    p.save()
    buffer.seek(0)
    return buffer.getvalue()

def save_test_pdf_to_temp():
    """Save test PDF to temporary file and return path"""
    pdf_content = create_test_pdf()
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf', prefix='test_')
    temp_file.write(pdf_content)
    temp_file.close()
    return temp_file.name

def parse_eml_content(eml_content):
    """Parse .eml file content and extract headers and parts"""
    msg = email.message_from_string(eml_content)
    
    headers = {}
    for key, value in msg.items():
        headers[key] = value
    
    parts = []
    if msg.is_multipart():
        for part in msg.walk():
            parts.append({
                'content_type': part.get_content_type(),
                'content_disposition': part.get('Content-Disposition', ''),
                'payload': part.get_payload()
            })
    
    return headers, parts

def test_outlook_draft_endpoint():
    """Test /api/outlook/draft endpoint"""
    print("\n=== Testing /api/outlook/draft endpoint ===")
    
    # Create test PDF
    pdf_path = save_test_pdf_to_temp()
    
    try:
        # Prepare test data
        test_data = {
            "pdf_filename": "test_document.pdf",
            "pdf_path": pdf_path,
            "recipient_email": "recipient@example.com",
            "sender_email": "sender@company.com",
            "sender_name": "John Doe",
            "subject": "Test Draft Email with PDF Attachment",
            "body": "<p>Dear Recipient,</p><p>Please find the attached PDF document for your review.</p><p>Best regards,<br>John Doe</p>"
        }
        
        # Make API request
        response = requests.post(f"{API_BASE}/outlook/draft", json=test_data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            # Check if response is a file download
            content_type = response.headers.get('content-type', '')
            content_disposition = response.headers.get('content-disposition', '')
            
            print(f"Content-Type: {content_type}")
            print(f"Content-Disposition: {content_disposition}")
            
            if 'message/rfc822' in content_type or '.eml' in content_disposition:
                # Parse the .eml content
                eml_content = response.text
                headers, parts = parse_eml_content(eml_content)
                
                print("\n--- EML File Analysis ---")
                print("Headers found:")
                for key, value in headers.items():
                    print(f"  {key}: {value}")
                
                # Check for critical draft headers
                draft_headers_found = []
                if 'X-Unsent' in headers and headers['X-Unsent'] == '1':
                    draft_headers_found.append('X-Unsent: 1')
                if 'X-UnsentDraft' in headers and headers['X-UnsentDraft'] == '1':
                    draft_headers_found.append('X-UnsentDraft: 1')
                
                print(f"\nDraft headers found: {draft_headers_found}")
                
                # Check email fields
                email_fields = {}
                if 'To' in headers:
                    email_fields['To'] = headers['To']
                if 'From' in headers:
                    email_fields['From'] = headers['From']
                if 'Subject' in headers:
                    email_fields['Subject'] = headers['Subject']
                
                print(f"Email fields: {email_fields}")
                
                # Check for PDF attachment
                pdf_attachment_found = False
                body_content_found = False
                
                print(f"\nMessage parts found: {len(parts)}")
                for i, part in enumerate(parts):
                    print(f"  Part {i}: {part['content_type']}")
                    if 'application/pdf' in part['content_type']:
                        pdf_attachment_found = True
                    if 'text/html' in part['content_type'] and part['payload']:
                        body_content_found = True
                
                # Summary
                print(f"\n--- Test Results Summary ---")
                print(f"✅ API Response: SUCCESS (200)")
                print(f"✅ File Type: {'EML file returned' if 'message/rfc822' in content_type else 'FAIL - Not EML'}")
                print(f"{'✅' if len(draft_headers_found) == 2 else '❌'} Draft Headers: {len(draft_headers_found)}/2 found")
                print(f"{'✅' if email_fields.get('To') else '❌'} To Field: {email_fields.get('To', 'MISSING')}")
                print(f"{'✅' if email_fields.get('From') else '❌'} From Field: {email_fields.get('From', 'MISSING')}")
                print(f"{'✅' if email_fields.get('Subject') else '❌'} Subject Field: {email_fields.get('Subject', 'MISSING')}")
                print(f"{'✅' if pdf_attachment_found else '❌'} PDF Attachment: {'Found' if pdf_attachment_found else 'MISSING'}")
                print(f"{'✅' if body_content_found else '❌'} Body Content: {'Found' if body_content_found else 'MISSING'}")
                
                return {
                    'success': True,
                    'draft_headers': len(draft_headers_found) == 2,
                    'email_fields': bool(email_fields.get('To') and email_fields.get('Subject')),
                    'pdf_attachment': pdf_attachment_found,
                    'body_content': body_content_found,
                    'details': {
                        'headers': headers,
                        'draft_headers_found': draft_headers_found,
                        'email_fields': email_fields
                    }
                }
            else:
                print("❌ FAIL: Response is not an EML file")
                return {'success': False, 'error': 'Response is not an EML file'}
        else:
            print(f"❌ FAIL: API returned status {response.status_code}")
            print(f"Response: {response.text}")
            return {'success': False, 'error': f'API returned status {response.status_code}'}
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return {'success': False, 'error': str(e)}
    finally:
        # Clean up temp file
        if os.path.exists(pdf_path):
            os.unlink(pdf_path)

def test_outlook_draft_upload_endpoint():
    """Test /api/outlook/draft-upload endpoint"""
    print("\n=== Testing /api/outlook/draft-upload endpoint ===")
    
    try:
        # Create test PDF content
        pdf_content = create_test_pdf()
        
        # Prepare form data
        files = {
            'pdf_file': ('test_document.pdf', pdf_content, 'application/pdf')
        }
        
        data = {
            'recipient_email': 'recipient@example.com',
            'subject': 'Test Upload Draft Email with PDF',
            'body': '<p>Dear Recipient,</p><p>This email was generated using the upload endpoint.</p><p>Best regards,<br>Test System</p>',
            'sender_email': 'sender@company.com',
            'sender_name': 'Jane Smith'
        }
        
        # Make API request
        response = requests.post(f"{API_BASE}/outlook/draft-upload", files=files, data=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            # Check if response is a file download
            content_type = response.headers.get('content-type', '')
            content_disposition = response.headers.get('content-disposition', '')
            
            print(f"Content-Type: {content_type}")
            print(f"Content-Disposition: {content_disposition}")
            
            if 'message/rfc822' in content_type or '.eml' in content_disposition:
                # Parse the .eml content
                eml_content = response.text
                headers, parts = parse_eml_content(eml_content)
                
                print("\n--- EML File Analysis ---")
                print("Headers found:")
                for key, value in headers.items():
                    print(f"  {key}: {value}")
                
                # Check for critical draft headers
                draft_headers_found = []
                if 'X-Unsent' in headers and headers['X-Unsent'] == '1':
                    draft_headers_found.append('X-Unsent: 1')
                if 'X-UnsentDraft' in headers and headers['X-UnsentDraft'] == '1':
                    draft_headers_found.append('X-UnsentDraft: 1')
                
                print(f"\nDraft headers found: {draft_headers_found}")
                
                # Check email fields
                email_fields = {}
                if 'To' in headers:
                    email_fields['To'] = headers['To']
                if 'From' in headers:
                    email_fields['From'] = headers['From']
                if 'Subject' in headers:
                    email_fields['Subject'] = headers['Subject']
                
                print(f"Email fields: {email_fields}")
                
                # Check for PDF attachment
                pdf_attachment_found = False
                body_content_found = False
                
                print(f"\nMessage parts found: {len(parts)}")
                for i, part in enumerate(parts):
                    print(f"  Part {i}: {part['content_type']}")
                    if 'application/pdf' in part['content_type']:
                        pdf_attachment_found = True
                    if 'text/html' in part['content_type'] and part['payload']:
                        body_content_found = True
                
                # Summary
                print(f"\n--- Test Results Summary ---")
                print(f"✅ API Response: SUCCESS (200)")
                print(f"✅ File Type: {'EML file returned' if 'message/rfc822' in content_type else 'FAIL - Not EML'}")
                print(f"{'✅' if len(draft_headers_found) == 2 else '❌'} Draft Headers: {len(draft_headers_found)}/2 found")
                print(f"{'✅' if email_fields.get('To') else '❌'} To Field: {email_fields.get('To', 'MISSING')}")
                print(f"{'✅' if email_fields.get('From') else '❌'} From Field: {email_fields.get('From', 'MISSING')}")
                print(f"{'✅' if email_fields.get('Subject') else '❌'} Subject Field: {email_fields.get('Subject', 'MISSING')}")
                print(f"{'✅' if pdf_attachment_found else '❌'} PDF Attachment: {'Found' if pdf_attachment_found else 'MISSING'}")
                print(f"{'✅' if body_content_found else '❌'} Body Content: {'Found' if body_content_found else 'MISSING'}")
                
                return {
                    'success': True,
                    'draft_headers': len(draft_headers_found) == 2,
                    'email_fields': bool(email_fields.get('To') and email_fields.get('Subject')),
                    'pdf_attachment': pdf_attachment_found,
                    'body_content': body_content_found,
                    'details': {
                        'headers': headers,
                        'draft_headers_found': draft_headers_found,
                        'email_fields': email_fields
                    }
                }
            else:
                print("❌ FAIL: Response is not an EML file")
                return {'success': False, 'error': 'Response is not an EML file'}
        else:
            print(f"❌ FAIL: API returned status {response.status_code}")
            print(f"Response: {response.text}")
            return {'success': False, 'error': f'API returned status {response.status_code}'}
            
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return {'success': False, 'error': str(e)}

def main():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests for Outlook Draft Generation")
    print("=" * 60)
    
    # Test both endpoints
    draft_result = test_outlook_draft_endpoint()
    upload_result = test_outlook_draft_upload_endpoint()
    
    # Overall summary
    print("\n" + "=" * 60)
    print("📊 OVERALL TEST SUMMARY")
    print("=" * 60)
    
    print(f"/api/outlook/draft: {'✅ PASS' if draft_result.get('success') else '❌ FAIL'}")
    if draft_result.get('success'):
        print(f"  - Draft Headers: {'✅' if draft_result.get('draft_headers') else '❌'}")
        print(f"  - Email Fields: {'✅' if draft_result.get('email_fields') else '❌'}")
        print(f"  - PDF Attachment: {'✅' if draft_result.get('pdf_attachment') else '❌'}")
        print(f"  - Body Content: {'✅' if draft_result.get('body_content') else '❌'}")
    
    print(f"/api/outlook/draft-upload: {'✅ PASS' if upload_result.get('success') else '❌ FAIL'}")
    if upload_result.get('success'):
        print(f"  - Draft Headers: {'✅' if upload_result.get('draft_headers') else '❌'}")
        print(f"  - Email Fields: {'✅' if upload_result.get('email_fields') else '❌'}")
        print(f"  - PDF Attachment: {'✅' if upload_result.get('pdf_attachment') else '❌'}")
        print(f"  - Body Content: {'✅' if upload_result.get('body_content') else '❌'}")
    
    # Determine overall success
    overall_success = (
        draft_result.get('success', False) and 
        upload_result.get('success', False) and
        draft_result.get('draft_headers', False) and
        upload_result.get('draft_headers', False)
    )
    
    print(f"\n🎯 CRITICAL FIX STATUS: {'✅ SUCCESS' if overall_success else '❌ FAILED'}")
    
    if overall_success:
        print("✅ Both endpoints successfully generate .eml files with proper draft headers!")
        print("✅ The Outlook draft generation fix is working correctly!")
    else:
        print("❌ One or more critical issues found with the draft generation.")
        if not draft_result.get('success'):
            print(f"   - /api/outlook/draft failed: {draft_result.get('error', 'Unknown error')}")
        if not upload_result.get('success'):
            print(f"   - /api/outlook/draft-upload failed: {upload_result.get('error', 'Unknown error')}")
    
    return {
        'overall_success': overall_success,
        'draft_endpoint': draft_result,
        'upload_endpoint': upload_result
    }

if __name__ == "__main__":
    main()