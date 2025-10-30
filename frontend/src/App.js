import { useState, useEffect } from "react";
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
import { FileText, Mail, Plus, Trash2, Download } from "lucide-react";

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

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await axios.get(`${API}/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error("Error loading templates:", error);
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
      toast.success(`Extracted emails from ${response.data.length} PDF(s)`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error extracting emails from PDFs");
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
    }
  };

  const handleGenerateDrafts = async () => {
    if (selectedPdfs.length === 0) {
      toast.error("Please select at least one PDF");
      return;
    }

    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please enter email subject and body");
      return;
    }

    setLoading(true);
    let successCount = 0;

    for (const pdfFilename of selectedPdfs) {
      const pdf = pdfs.find(p => p.filename === pdfFilename);
      if (!pdf || pdf.emails.length === 0) {
        toast.warning(`No email found in ${pdfFilename}`);
        continue;
      }

      const recipientEmail = pdf.emails[0];

      try {
        const response = await axios.post(`${API}/outlook/draft`, {
          pdf_filename: pdf.filename,
          pdf_path: pdf.file_path,
          recipient_email: recipientEmail,
          subject: emailSubject,
          body: emailBody
        }, {
          responseType: 'blob'
        });

        // Download the .eml file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `draft_${pdf.filename.replace('.pdf', '')}.eml`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        successCount++;
      } catch (error) {
        console.error(`Error generating draft for ${pdfFilename}:`, error);
      }
    }

    setLoading(false);
    toast.success(`Generated ${successCount} draft email(s). Check your downloads folder.`);
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
                <Label htmlFor="folder-path">Folder Path</Label>
                <Input
                  id="folder-path"
                  data-testid="folder-path-input"
                  placeholder="e.g., /Users/john/Documents/PDFs"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <Button
                data-testid="extract-emails-btn"
                onClick={handleExtractEmails}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                {loading ? "Extracting..." : "Extract Emails"}
              </Button>

              {/* PDF List */}
              {pdfs.length > 0 && (
                <div className="mt-6 space-y-3" data-testid="pdf-list">
                  <h3 className="font-semibold text-lg text-slate-800">Extracted PDFs ({pdfs.length})</h3>
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