import { useState, useEffect, useRef, useCallback } from "react";
import "@/App.css";
import axios from "axios";
import { saveAs } from "file-saver";
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
  const emailPreviewRef = useRef(null);
  const isEditingPreview = useRef(false);
  
  // Download state - shows download link after generation
  const [downloadReady, setDownloadReady] = useState(null);

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
    // Check if running in Electron
    if (window.electron && window.electron.selectFolder) {
      // Use native folder picker in Electron
      window.electron.selectFolder().then(folderPath => {
        if (folderPath) {
          setFolderPath(folderPath);
          toast.success("Folder selected: " + folderPath);
        }
      });
    } else {
      // Fallback to file input for browser
      fileInputRef.current?.click();
    }
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

  // Update preview when body changes (only when not actively editing)
  useEffect(() => {
    if (!isEditingPreview.current && emailPreviewRef.current) {
      emailPreviewRef.current.innerHTML = emailBody;
      setEmailPreview(emailBody);
    } else if (!isEditingPreview.current) {
      setEmailPreview(emailBody);
    }
  }, [emailBody]);

  // Handle preview editor focus
  const handlePreviewFocus = useCallback(() => {
    isEditingPreview.current = true;
  }, []);

  // Handle preview editor blur - save content
  const handlePreviewBlur = useCallback((e) => {
    isEditingPreview.current = false;
    const content = e.currentTarget.innerHTML;
    setEmailPreview(content);
  }, []);

  // Reset preview to original template
  const handleResetPreview = useCallback(() => {
    if (emailPreviewRef.current) {
      emailPreviewRef.current.innerHTML = emailBody;
    }
    setEmailPreview(emailBody);
  }, [emailBody]);

  const handleGenerateDrafts = async () => {
    if (selectedPdfs.length === 0) {
      toast.error("Please select at least one PDF");
      return;
    }

    // Get the current content from the ref if available, otherwise use state
    const currentPreviewContent = emailPreviewRef.current?.innerHTML || emailPreview || emailBody;
    
    if (!emailSubject.trim() || !currentPreviewContent.trim()) {
      toast.error("Please enter email subject and body");
      return;
    }

    setLoading(true);
    
    // Get selected email account details
    const account = emailAccounts.find(a => a.id === selectedAccount);
    const senderEmail = account?.email || null;
    const senderName = account?.name || null;
    
    // Use the current preview content
    const finalEmailBody = currentPreviewContent;

    try {
      // Check if using uploaded files (web preview) or folder path (standalone app)
      if (uploadedFiles.length > 0) {
        // WEB PREVIEW: Use batch endpoint that returns a single ZIP file
        const formData = new FormData();
        
        // Build recipient mapping
        const recipients = [];
        
        for (const pdfFilename of selectedPdfs) {
          const pdf = pdfs.find(p => p.filename === pdfFilename);
          const file = uploadedFiles.find(f => f.name === pdfFilename);
          
          if (file && pdf && pdf.emails.length > 0) {
            formData.append('pdf_files', file);
            recipients.push({
              filename: pdfFilename,
              email: pdf.emails[0]
            });
          }
        }
        
        if (recipients.length === 0) {
          toast.error("No valid PDFs with email addresses found");
          setLoading(false);
          return;
        }
        
        formData.append('recipients', JSON.stringify(recipients));
        formData.append('subject', emailSubject);
        formData.append('body', finalEmailBody);
        if (senderEmail) formData.append('sender_email', senderEmail);
        if (senderName) formData.append('sender_name', senderName);
        
        toast.info(`Processing ${recipients.length} statement(s)...`, { duration: 3000 });
        
        // Call the batch endpoint
        const response = await axios.post(`${API}/outlook/batch-create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data && response.data.success) {
          const { summary, download_url, filename } = response.data;
          
          // Set download ready state - show a clickable download button
          setDownloadReady({
            url: `${BACKEND_URL}${download_url}`,
            filename: filename,
            summary: summary
          });
          
          // Show success message
          if (summary.failed > 0) {
            toast.success(`Generated ${summary.successful} draft(s), ${summary.failed} failed`, {
              duration: 10000,
              description: `Click the DOWNLOAD button below to get your ZIP file.`
            });
          } else {
            toast.success(`Successfully generated ${summary.successful} draft email(s)!`, {
              duration: 10000,
              description: `Click the DOWNLOAD button below to get your ZIP file.`
            });
          }
        } else {
          toast.error("Server did not return a successful response");
        }
        
      } else {
        // STANDALONE APP: Process each file individually with blob download
        let successCount = 0;
        const failedStatements = [];
        const successfulStatements = [];
        
        for (const pdfFilename of selectedPdfs) {
          const pdf = pdfs.find(p => p.filename === pdfFilename);
          if (!pdf || pdf.emails.length === 0) {
            failedStatements.push({ filename: pdfFilename, reason: "No email found" });
            continue;
          }
          
          try {
            const response = await axios.post(`${API}/outlook/draft`, {
              pdf_filename: pdf.filename,
              pdf_path: pdf.file_path,
              recipient_email: pdf.emails[0],
              sender_email: senderEmail,
              sender_name: senderName,
              subject: emailSubject,
              body: finalEmailBody
            }, { responseType: 'blob' });
            
            if (response && response.data) {
              const filename = `draft_${pdfFilename.replace('.pdf', '')}.eml`;
              saveAs(new Blob([response.data]), filename);
              successCount++;
              successfulStatements.push({
                filename: pdfFilename,
                recipient: pdf.emails[0],
                outputFile: filename
              });
            }
          } catch (error) {
            failedStatements.push({
              filename: pdfFilename,
              reason: error.message || "Unknown error"
            });
          }
        }
        
        // Generate report for standalone
        if (successCount > 0 || failedStatements.length > 0) {
          await generateReport(successfulStatements, failedStatements);
        }
        
        if (successCount > 0) {
          toast.success(`Generated ${successCount} draft email(s)!`);
        } else {
          toast.error("Failed to generate any drafts");
        }
      }
      
    } catch (error) {
      console.error('Error generating drafts:', error);
      toast.error(error.response?.data?.detail || error.message || "Error generating drafts");
    }
    
    setLoading(false);
  };

  // Trigger download using hidden iframe (doesn't open new tabs)
  const triggerDownload = (url, filename) => {
    // Create a hidden iframe to trigger the download
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // Clean up iframe after download starts
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 5000);
    
    console.log(`Download triggered for: ${filename}`);
  };

  // Helper function kept for standalone app compatibility
  const downloadFile = async (blob, filename) => {
    try {
      saveAs(blob, filename);
      console.log(`Download triggered for: ${filename}`);
      return true;
    } catch (error) {
      console.error('file-saver download failed:', error);
      return false;
    }
  };

  // Generate a report of successful and failed statement generations
  const generateReport = async (successful, failed) => {
    const timestamp = new Date().toLocaleString();
    let reportContent = `SPEEDY STATEMENTS - GENERATION REPORT\n`;
    reportContent += `Generated: ${timestamp}\n`;
    reportContent += `${'='.repeat(50)}\n\n`;
    
    // Summary
    reportContent += `SUMMARY\n`;
    reportContent += `${'-'.repeat(30)}\n`;
    reportContent += `Total Processed: ${successful.length + failed.length}\n`;
    reportContent += `Successful: ${successful.length}\n`;
    reportContent += `Failed: ${failed.length}\n\n`;
    
    // Successful generations
    if (successful.length > 0) {
      reportContent += `SUCCESSFULLY GENERATED\n`;
      reportContent += `${'-'.repeat(30)}\n`;
      successful.forEach((item, index) => {
        reportContent += `${index + 1}. ${item.filename}\n`;
        reportContent += `   Recipient: ${item.recipient}\n`;
        reportContent += `   Output: ${item.outputFile}\n\n`;
      });
    }
    
    // Failed generations
    if (failed.length > 0) {
      reportContent += `FAILED TO GENERATE\n`;
      reportContent += `${'-'.repeat(30)}\n`;
      failed.forEach((item, index) => {
        reportContent += `${index + 1}. ${item.filename}\n`;
        reportContent += `   Reason: ${item.reason}\n\n`;
      });
    }
    
    reportContent += `${'='.repeat(50)}\n`;
    reportContent += `End of Report\n`;
    
    const reportFilename = `statement_report_${new Date().toISOString().slice(0, 10)}.txt`;
    
    try {
      // Use the backend endpoint to create and serve the report
      const formData = new FormData();
      formData.append('report_content', reportContent);
      formData.append('filename', reportFilename);
      
      const response = await axios.post(`${API}/report/create`, formData);
      
      if (response.data && response.data.success) {
        // Open the download URL directly
        window.open(`${BACKEND_URL}${response.data.download_url}`, '_blank');
      }
    } catch (error) {
      console.error('Failed to create report via API, trying direct download:', error);
      // Fallback to blob download
      const reportBlob = new Blob([reportContent], { type: 'text/plain' });
      saveAs(reportBlob, reportFilename);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="speed-title text-6xl font-bold text-slate-800 mb-3" style={{ 
            fontFamily: "'Electric Boots', 'Impact', sans-serif",
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontWeight: '900'
          }}>
            SPEEDY STATEMENTS
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
              {pdfs.length > 0 && selectedPdfs.length > 0 && (emailPreview || emailBody) && (
                <div className="mt-6 space-y-3" data-testid="email-preview-section">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-slate-800">Email Preview (Template)</h3>
                    <Button
                      data-testid="reset-preview-btn"
                      variant="outline"
                      size="sm"
                      onClick={handleResetPreview}
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
                          ref={emailPreviewRef}
                          data-testid="email-preview-editor"
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={handlePreviewFocus}
                          onBlur={handlePreviewBlur}
                          className="min-h-[200px] p-4 border-2 border-slate-200 rounded-lg bg-white focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 overflow-auto"
                          style={{ 
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '14px',
                            lineHeight: '1.6'
                          }}
                        />
                        <p className="text-xs text-slate-500">
                          💡 Tip: Click inside the preview to edit text. Changes are saved when you click outside.
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
                      
                      <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-2">
                        <p className="text-xs text-amber-800 font-medium mb-2">⚠️ Not seeing downloads?</p>
                        <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
                          <li>Check browser download bar at bottom of window</li>
                          <li>Look in your Downloads folder manually</li>
                          <li>Check if browser is blocking downloads - click the icon in address bar</li>
                          <li>Try opening browser DevTools (F12) → Console tab to see errors</li>
                          <li>Make sure pop-ups are not blocked for this site</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center gap-6">
          <Button
            data-testid="generate-drafts-btn"
            onClick={handleGenerateDrafts}
            disabled={loading || selectedPdfs.length === 0}
            size="lg"
            className="px-12 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            {loading ? "Processing..." : `Generate Outlook Drafts (${selectedPdfs.length})`}
          </Button>
          
          {/* Download Ready Section - Shows after generation */}
          {downloadReady && (
            <Card className="w-full max-w-2xl border-4 border-green-500 bg-green-50 shadow-2xl animate-pulse">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    ✅ Your Files Are Ready!
                  </h3>
                  <p className="text-green-700 mb-1">
                    Generated {downloadReady.summary.successful} draft(s)
                    {downloadReady.summary.failed > 0 && `, ${downloadReady.summary.failed} failed`}
                  </p>
                  <p className="text-sm text-green-600 mb-4">
                    {downloadReady.filename}
                  </p>
                </div>
                
                <a
                  href={downloadReady.url}
                  download={downloadReady.filename}
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 text-xl font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    toast.success("Download started! Check your Downloads folder.", { duration: 5000 });
                  }}
                >
                  <Download className="w-6 h-6" />
                  CLICK HERE TO DOWNLOAD ZIP FILE
                </a>
                
                <p className="mt-4 text-sm text-green-600">
                  After downloading, extract the ZIP and double-click .eml files to open in Outlook
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 text-green-700 border-green-500 hover:bg-green-100"
                  onClick={() => setDownloadReady(null)}
                >
                  Clear & Generate More
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;