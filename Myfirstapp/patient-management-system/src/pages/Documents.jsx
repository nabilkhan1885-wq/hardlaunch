import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { FileText, Download, Trash2, Search, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import DocumentUpload from '../components/documents/DocumentUpload';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          patients:patient_id (
            full_name,
            patient_id
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const urlParts = doc.file_url.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('patient-documents') + 1).join('/');
      
      await supabase.storage.from('patient-documents').remove([filePath]);
      
      const { error } = await supabase.from('documents').delete().eq('id', doc.id);
      if (error) throw error;
      
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.patients?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
          <p className="text-gray-600 mt-1">Manage patient documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload size={18} className="mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search by file name or patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText size={24} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{doc.file_name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.patients?.full_name} • {(doc.file_size / 1024).toFixed(2)} KB • 
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
      >
        <DocumentUpload
          patientId={selectedPatientId}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchDocuments();
          }}
          onCancel={() => setShowUploadModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Documents;