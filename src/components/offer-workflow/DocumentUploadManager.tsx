import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  Eye, 
  Download, 
  Trash2,
  AlertCircle,
  Clock,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadManagerProps {
  offerIntentId: string;
  buyerId: string;
  agentId?: string;
  onDocumentUploaded?: (document: any) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

interface UploadedDocument {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  document_type: string;
  upload_status: string;
  description?: string;
  storage_path: string;
  created_at: string;
  is_required: boolean;
  is_sensitive: boolean;
}

const DocumentUploadManager: React.FC<DocumentUploadManagerProps> = ({
  offerIntentId,
  buyerId,
  agentId,
  onDocumentUploaded,
  maxFileSize = 10, // 10MB default
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
}) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [offerIntentId]);

  const fetchDocuments = async () => {
    try {
      const { data: docData, error: docError } = await supabase
        .from('offer_documents')
        .select('*')
        .eq('offer_intent_id', offerIntentId)
        .order('created_at', { ascending: false });

      if (docError) {
        console.error('Error fetching documents:', docError);
        return;
      }

      setDocuments(docData || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const documentTypes = [
    { value: 'pre_approval_letter', label: 'Pre-approval Letter', required: true },
    { value: 'proof_of_funds', label: 'Proof of Funds', required: false },
    { value: 'bank_statement', label: 'Bank Statement', required: false },
    { value: 'identification', label: 'ID Document', required: true },
    { value: 'purchase_agreement', label: 'Purchase Agreement', required: false },
    { value: 'addendum', label: 'Addendum', required: false },
    { value: 'inspection_report', label: 'Inspection Report', required: false },
    { value: 'appraisal', label: 'Appraisal', required: false },
    { value: 'other', label: 'Other Document', required: false }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <Check className="w-4 h-4 text-green-500" />;
      case 'processing': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'verified': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'rejected': return <X className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxFileSize}MB`,
        variant: "destructive"
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF, JPEG, or PNG files only",
        variant: "destructive"
      });
      return false;
    }

    if (!selectedDocumentType) {
      toast({
        title: "Document type required",
        description: "Please select a document type before uploading",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${offerIntentId}/${selectedDocumentType}/${Date.now()}.${fileExt}`;
      const filePath = `offer-documents/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Create database record
      const documentData = {
        offer_intent_id: offerIntentId,
        buyer_id: buyerId,
        agent_id: agentId || null,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_path: filePath,
        document_type: selectedDocumentType,
        description: documentDescription || null,
        upload_status: 'uploaded',
        uploaded_by: buyerId,
        is_required: documentTypes.find(dt => dt.value === selectedDocumentType)?.required || false,
        is_sensitive: true
      };

      const { data: docData, error: docError } = await supabase
        .from('offer_documents')
        .insert(documentData)
        .select()
        .single();

      if (docError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('documents').remove([filePath]);
        throw docError;
      }

      setDocuments(prev => [...prev, docData]);
      setSelectedDocumentType('');
      setDocumentDescription('');
      
      if (onDocumentUploaded) {
        onDocumentUploaded(docData);
      }

      // Refresh documents list to get latest state
      await fetchDocuments();

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    uploadFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const viewDocument = async (storagePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('View error:', error);
      toast({
        title: "View failed",
        description: "Failed to view document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadDocument = async (storagePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600); // 1 hour expiry

      if (error) throw error;

      if (data?.signedUrl) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteDocument = async (documentId: string, storagePath: string) => {
    try {
      // Delete from storage
      await supabase.storage.from('documents').remove([storagePath]);
      
      // Delete from database
      const { error } = await supabase
        .from('offer_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      
      toast({
        title: "Document deleted",
        description: "Document has been removed successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            Upload New Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Type Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Document Type</label>
            <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.label}
                      {type.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
            <Textarea
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Add any notes about this document..."
              rows={2}
            />
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${!selectedDocumentType ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => selectedDocumentType && fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-lg font-medium text-gray-900 mb-2">
              {dragActive ? 'Drop file here' : 'Upload Document'}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Drag & drop a file here, or click to select
            </div>
            <div className="text-xs text-gray-400">
              Supports: PDF, JPEG, PNG (max {maxFileSize}MB)
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={allowedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={!selectedDocumentType}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Uploaded Documents ({documents.length})
            </h3>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="font-medium">{doc.file_name}</div>
                      <div className="text-sm text-gray-500">
                        {documentTypes.find(dt => dt.value === doc.document_type)?.label} • {formatFileSize(doc.file_size)}
                      </div>
                      {doc.description && (
                        <div className="text-xs text-gray-400 mt-1">{doc.description}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <Badge className={getStatusColor(doc.upload_status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(doc.upload_status)}
                        {doc.upload_status}
                      </div>
                    </Badge>
                    
                    {/* Required Badge */}
                    {doc.is_required && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Required
                      </Badge>
                    )}
                    
                    {/* Sensitive Badge */}
                    {doc.is_sensitive && (
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        <Shield className="w-3 h-3 mr-1" />
                        Sensitive
                      </Badge>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewDocument(doc.storage_path)}
                        title="View document"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadDocument(doc.storage_path, doc.file_name)}
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteDocument(doc.id, doc.storage_path)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadManager;