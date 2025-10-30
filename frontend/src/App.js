import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Mail, Plus, Trash2, Download, FolderOpen, Upload, User } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [folderPath, setFolderPath] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // Email account management
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  
  // Email preview
  const [emailPreview, setEmailPreview] = useState("");

  // Load templates and email accounts on mount
  useEffect(() => {
    loadTemplates();
    loadEmailAccounts();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const loadEmailAccounts = async () => {
    try {
      const response = await axios.get(`${API}/email-accounts`);
      setEmailAccounts(response.data);
    } catch (error) {
      console.error("Error loading email accounts:", error);
    }
  };

  const handleExtractEmails = async () => {
    if (!folderPath.trim()) {
      toast.error("Please enter a folder path");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/pdf/extract`, {
        folder_path: folderPath
      });
      setPdfs(response.data);
      setSelectedPdfs([]);
      setUploadedFiles([]);
      toast.success(`Extracted emails from ${response.data.length} PDF(s)`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error extracting emails from PDFs");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter(file => file.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      toast.error("No PDF files selected");
      return;
    }

    setLoading(true);
    setUploadedFiles(pdfFiles);
    
    try {
      const formData = new FormData();
      pdfFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post(`${API}/pdf/upload-extract`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPdfs(response.data);
      setSelectedPdfs([]);
      setFolderPath("");
      toast.success(`Extracted emails from ${response.data.length} PDF(s)`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error processing uploaded PDFs");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmailAccount = async () => {
    if (!newAccountEmail.trim() || !newAccountName.trim()) {
      toast.error("Please fill in all account fields");
      return;
    }

    try {
      await axios.post(`${API}/email-accounts`, {
        email: newAccountEmail,
        name: newAccountName
      });
      toast.success("Email account saved successfully");
      setNewAccountEmail("");
      setNewAccountName("");
      setShowAccountForm(false);
      loadEmailAccounts();
    } catch (error) {
      toast.error("Error saving email account");
      console.error("Error:", error);
    }
  };

  const handleDeleteEmailAccount = async (accountId) => {
    try {
      await axios.delete(`${API}/email-accounts/${accountId}`);
      toast.success("Email account deleted");
      loadEmailAccounts();
      if (selectedAccount === accountId) {
        setSelectedAccount("");
      }
    } catch (error) {
      toast.error("Error deleting email account");
    }
  };

  const handlePdfSelection = (pdfFilename) => {
    setSelectedPdfs(prev => {
      if (prev.includes(pdfFilename)) {
        return prev.filter(f => f !== pdfFilename);
      } else {
        return [...prev, pdfFilename];
      }
    });
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please fill in all template fields");
      return;
    }

    try {
      await axios.post(`${API}/templates`, {
        name: templateName,
        subject: emailSubject,
        body: emailBody
      });
      toast.success("Template saved successfully");
      setTemplateName("");
      setShowTemplateForm(false);
      loadTemplates();
    } catch (error) {
      toast.error("Error saving template");
      console.error("Error:", error);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await axios.delete(`${API}/templates/${templateId}`);
      toast.success("Template deleted");
      loadTemplates();
      if (selectedTemplate === templateId) {
        setSelectedTemplate("");
      }
    } catch (error) {
      toast.error("Error deleting template");
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailSubject(template.subject);
      setEmailBody(template.body);
      setEmailPreview(template.body);
    }
  };

  // Update preview when body changes
  useEffect(() => {
    setEmailPreview(emailBody);
  }, [emailBody]);

  const handleGenerateDrafts = async () => {
    if (selectedPdfs.length === 0) {
      toast.error("Please select at least one PDF");
      return;
    }

    if (!emailSubject.trim() || !emailPreview.trim()) {
      toast.error("Please enter email subject and body");
      return;
    }

    setLoading(true);
    let successCount = 0;
    
    // Get selected email account details
    const account = emailAccounts.find(a => a.id === selectedAccount);
    const senderEmail = account?.email || null;
    const senderName = account?.name || null;
    
    // Use the preview content (which may have been edited)
    const finalEmailBody = emailPreview || emailBody;

    for (const pdfFilename of selectedPdfs) {
      const pdf = pdfs.find(p => p.filename === pdfFilename);
      if (!pdf || pdf.emails.length === 0) {
        toast.warning(`No email found in ${pdfFilename}`);
        continue;
      }

      const recipientEmail = pdf.emails[0];

      try {
        let response;
        
        // Check if using uploaded files or folder path
        if (uploadedFiles.length > 0) {
          const file = uploadedFiles.find(f => f.name === pdfFilename);
          if (file) {
            const formData = new FormData();
            formData.append('pdf_file', file);
            formData.append('recipient_email', recipientEmail);
            formData.append('subject', emailSubject);
            formData.append('body', finalEmailBody);
            if (senderEmail) formData.append('sender_email', senderEmail);
            if (senderName) formData.append('sender_name', senderName);

            response = await axios.post(`${API}/outlook/draft-upload`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              responseType: 'blob'
            });
          }
        } else {
          // Use folder path method
          response = await axios.post(`${API}/outlook/draft`, {
            pdf_filename: pdf.filename,
            pdf_path: pdf.file_path,
            recipient_email: recipientEmail,
            sender_email: senderEmail,
            sender_name: senderName,
            subject: emailSubject,
            body: finalEmailBody
          }, {
            responseType: 'blob'
          });
        }

        if (response && response.data) {
          // Get filename from response headers or create one
          const contentDisposition = response.headers['content-disposition'];
          let filename = `draft_${pdfFilename.replace('.pdf', '')}.eml`;
          
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
            }
          }
          
          // Create blob with correct MIME type
          const blob = new Blob([response.data], { 
            type: 'message/rfc822'
          });
          
          // Create download link with better browser compatibility
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          
          // Force download by appending to body and clicking
          document.body.appendChild(link);
          link.click();
          
          // Cleanup after a short delay
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 250);
          
          successCount++;
          console.log(`Successfully downloaded: ${filename}`);
        }
      } catch (error) {
        console.error(`Error generating draft for ${pdfFilename}:`, error);
        toast.error(`Failed to generate draft for ${pdfFilename}`);
      }
      
      // Add delay between downloads to ensure browser processes each one
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`Generated ${successCount} draft email(s)!`, {
        duration: 8000,
        description: `Check your Downloads folder for .eml files. If you don't see them, check your browser's download settings or try allowing downloads for this site.`
      });
    } else {
      toast.error("Failed to generate any draft emails. Please check console for errors.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            PDF Email Manager
          </h1>
          <p className="text-lg text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Extract emails from PDFs and generate Outlook drafts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - PDF Extraction */}
          <Card className="shadow-lg border-0 backdrop-blur-sm bg-white/90" data-testid="pdf-extraction-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <FileText className="w-6 h-6 text-indigo-600" />
                Extract Emails from PDFs
              </CardTitle>
              <CardDescription>Specify a folder path containing PDF files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="folder-path">Option 1: Enter Folder Path</Label>
                <div className="flex gap-2">
                  <Input
                    id="folder-path"
                    data-testid="folder-path-input"
                    placeholder="e.g., /Users/john/Documents/PDFs"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <Button
                    data-testid="extract-emails-btn"
                    onClick={handleExtractEmails}
                    disabled={loading || !folderPath.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    {loading ? "Extracting..." : "Extract"}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">Or</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Option 2: Browse and Select PDFs</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFilesSelected}
                  style={{ display: 'none' }}
                  data-testid="file-input"
                />
                <Button
                  data-testid="browse-folder-btn"
                  onClick={handleFolderSelect}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse & Select PDF Files
                </Button>
                {uploadedFiles.length > 0 && (
                  <p className="text-sm text-slate-600">
                    {uploadedFiles.length} file(s) selected
                  </p>
                )}
              </div>

              {/* PDF List */}
              {pdfs.length > 0 && (
                <div className="mt-6 space-y-3" data-testid="pdf-list">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-slate-800">Extracted PDFs ({pdfs.length})</h3>
                    <div className="flex gap-2">
                      <Button
                        data-testid="select-all-btn"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPdfs(pdfs.map(p => p.filename))}
                        className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                      >
                        Select All
                      </Button>
                      <Button
                        data-testid="deselect-all-btn"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPdfs([])}
                        className="text-slate-600 border-slate-300 hover:bg-slate-50"
                      >
                        Deselect All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {pdfs.map((pdf) => (
                      <div
                        key={pdf.filename}
                        data-testid={`pdf-item-${pdf.filename}`}
                        className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <Checkbox
                          data-testid={`pdf-checkbox-${pdf.filename}`}
                          checked={selectedPdfs.includes(pdf.filename)}
                          onCheckedChange={() => handlePdfSelection(pdf.filename)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-800 truncate">{pdf.filename}</p>
                          <p className="text-sm text-slate-600" data-testid={`pdf-emails-${pdf.filename}`}>
                            {pdf.emails.length > 0 ? (
                              <span className="text-green-600">Emails: {pdf.emails.join(", ")}</span>
                            ) : (
                              <span className="text-red-600">No emails found</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Email Preview Section */}
              {pdfs.length > 0 && selectedPdfs.length > 0 && emailPreview && (
                <div className="mt-6 space-y-3" data-testid="email-preview-section">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-slate-800">Email Preview (Template)</h3>
                    <Button
                      data-testid="reset-preview-btn"
                      variant="outline"
                      size="sm"
                      onClick={() => setEmailPreview(emailBody)}
                      className="text-slate-600 border-slate-300 hover:bg-slate-50"
                    >
                      Reset to Original
                    </Button>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Each of the {selectedPdfs.length} selected PDF(s) will generate a separate email with its own recipient and attachment.
                      This preview shows the template that will be used for each email.
                    </p>
                  </div>
                  
                  <Card className="border-2 border-indigo-200 bg-white">
                    <CardContent className="p-4">
                      <div className="space-y-3 mb-4 pb-3 border-b border-slate-200">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold text-slate-600 min-w-[80px]">From:</span>
                          <span className="text-sm text-slate-800">
                            {emailAccounts.find(a => a.id === selectedAccount)?.email || 'Your Email'}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold text-slate-600 min-w-[80px]">To:</span>
                          <span className="text-sm text-slate-800">
                            {pdfs.find(p => selectedPdfs.includes(p.filename))?.emails[0] || 'recipient@email.com'}
                            {selectedPdfs.length > 1 && <span className="text-slate-500 ml-2">(Example - each PDF gets its own recipient)</span>}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold text-slate-600 min-w-[80px]">Subject:</span>
                          <span className="text-sm text-slate-800">{emailSubject || '(No subject)'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-semibold text-slate-600 min-w-[80px]">Attachment:</span>
                          <span className="text-sm text-indigo-600">
                            1 PDF per email ({selectedPdfs.length} emails total)
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email-preview" className="text-sm text-slate-600">
                          Email Body Template (Editable - Click to modify)
                        </Label>
                        <div
                          id="email-preview"
                          data-testid="email-preview-editor"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setEmailPreview(e.currentTarget.innerHTML)}
                          onInput={(e) => setEmailPreview(e.currentTarget.innerHTML)}
                          className="min-h-[200px] p-4 border-2 border-slate-200 rounded-lg bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 overflow-auto"
                          style={{ 
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}
                          dangerouslySetInnerHTML={{ __html: emailPreview }}
                        />
                        <p className="text-xs text-slate-500">
                          💡 Tip: Click inside the preview to edit text, select and drag to rearrange content
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Email Template */}
          <Card className="shadow-lg border-0 backdrop-blur-sm bg-white/90" data-testid="email-template-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Mail className="w-6 h-6 text-indigo-600" />
                Email Template
              </CardTitle>
              <CardDescription>Create or select a template for your email drafts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email Account Selector */}
              <div className="space-y-2 pb-4 border-b border-slate-200">
                <Label>Your Email Account (Sender)</Label>
                <div className="flex gap-2">
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger data-testid="account-select" className="border-slate-300">
                      <SelectValue placeholder="Select your email account" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    data-testid="new-account-btn"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAccountForm(!showAccountForm)}
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Account Form */}
              {showAccountForm && (
                <Card className="bg-slate-50 border-slate-200" data-testid="account-form">
                  <CardContent className="pt-6 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="account-email">Your Email Address</Label>
                      <Input
                        id="account-email"
                        data-testid="account-email-input"
                        type="email"
                        placeholder="john@company.com"
                        value={newAccountEmail}
                        onChange={(e) => setNewAccountEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Display Name</Label>
                      <Input
                        id="account-name"
                        data-testid="account-name-input"
                        placeholder="John Doe"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                      />
                    </div>
                    <Button
                      data-testid="save-account-btn"
                      onClick={handleSaveEmailAccount}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Save Email Account
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Email Account Management */}
              {emailAccounts.length > 0 && (
                <div className="space-y-2">
                  <Label>Saved Email Accounts</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {emailAccounts.map((account) => (
                      <div
                        key={account.id}
                        data-testid={`saved-account-${account.email}`}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">{account.name}</span>
                          <span className="text-xs text-slate-500">{account.email}</span>
                        </div>
                        <Button
                          data-testid={`delete-account-${account.email}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmailAccount(account.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Selector */}
              <div className="space-y-2">
                <Label>Select Template</Label>
                <div className="flex gap-2">
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger data-testid="template-select" className="border-slate-300">
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    data-testid="new-template-btn"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowTemplateForm(!showTemplateForm)}
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Template Form */}
              {showTemplateForm && (
                <Card className="bg-slate-50 border-slate-200" data-testid="template-form">
                  <CardContent className="pt-6 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input
                        id="template-name"
                        data-testid="template-name-input"
                        placeholder="e.g., Follow-up Email"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                      />
                    </div>
                    <Button
                      data-testid="save-template-btn"
                      onClick={handleSaveTemplate}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Save Template
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Template Management */}
              {templates.length > 0 && (
                <div className="space-y-2">
                  <Label>Saved Templates</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        data-testid={`saved-template-${template.name}`}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
                      >
                        <span className="text-sm font-medium text-slate-700">{template.name}</span>
                        <Button
                          data-testid={`delete-template-${template.name}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Editor */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input
                    id="email-subject"
                    data-testid="email-subject-input"
                    placeholder="Enter email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-body">Email Body</Label>
                  <Textarea
                    id="email-body"
                    data-testid="email-body-textarea"
                    placeholder="Enter email body (HTML supported)"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="min-h-[200px] border-slate-300 font-mono text-sm"
                  />
                </div>
                
                {/* Save Location Info */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-indigo-600" />
                    Save Location for Draft Files
                  </Label>
                  <Card className="bg-slate-50 border-slate-200">
                    <CardContent className="pt-4 space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm text-slate-700">
                          <strong>Default Location:</strong> Your browser's Downloads folder
                        </p>
                        <p className="text-sm text-slate-600">
                          Typically: <code className="bg-white px-2 py-1 rounded text-xs">C:\Users\YourName\Downloads</code>
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-xs text-blue-800 font-medium mb-2">💡 To Change Download Location:</p>
                        <ol className="text-xs text-blue-700 space-y-1 ml-4 list-decimal">
                          <li>Open Chrome Settings → Downloads</li>
                          <li>Change "Location" to your preferred folder</li>
                          <li>Or enable "Ask where to save each file before downloading"</li>
                        </ol>
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        <strong>Note:</strong> .eml files will be saved with names like "draft_filename.eml". 
                        Double-click them to open in Outlook as draft emails.
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            data-testid="generate-drafts-btn"
            onClick={handleGenerateDrafts}
            disabled={loading || selectedPdfs.length === 0}
            size="lg"
            className="px-12 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Generate Outlook Drafts ({selectedPdfs.length})
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;