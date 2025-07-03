
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Trash2, Download, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OfferDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  document_category: string;
  uploaded_at: string;
  uploaded_by: string;
}

interface DocumentUploadProps {
  offerIntentId: string;
  documents: OfferDocument[];
  onDocumentUploaded: () => void;
  onDocumentDeleted: () => void;
}

const DOCUMENT_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'pre_approval', label: 'Pre-approval Letter' },
  { value: 'financial', label: 'Financial Documents' },
  { value: 'identification', label: 'Identification' },
  { value: 'contract', label: 'Contract Documents' },
  { value: 'inspection', label: 'Inspection Reports' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'other', label: 'Other' }
];

const DocumentUpload = ({ offerIntentId, documents, onDocumentUploaded, onDocumentDeleted }: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [offerIntentId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${offerIntentId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('offer-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database using direct insert
      const { error: dbError } = await supabase
        .from('offer_documents' as any)
        .insert({
          offer_intent_id: offerIntentId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          document_category: 'general',
          uploaded_by: (await supabase.auth.getUser()).data.user?.id || ''
        });

      if (dbError) throw dbError;

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });

      onDocumentUploaded();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: OfferDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('offer-documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Failed to download document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (doc: OfferDocument) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('offer-documents')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('offer_documents' as any)
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;

      toast({
        title: "Document deleted",
        description: "Document has been removed successfully.",
      });

      onDocumentDeleted();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryLabel = (category: string) => {
    return DOCUMENT_CATEGORIES.find(cat => cat.value === category)?.label || 'General';
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <File className="w-5 h-5" />
          Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to select
          </p>
          <input
            type="file"
            id={`file-upload-${offerIntentId}`}
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(`file-upload-${offerIntentId}`)?.click()}
            disabled={uploading}
          >
            <Plus className="w-4 h-4 mr-2" />
            {uploading ? 'Uploading...' : 'Select Files'}
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Supported: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
          </p>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-sm">{doc.file_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(doc.document_category)}
                      </Badge>
                      <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(doc)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
