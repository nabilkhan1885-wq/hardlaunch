import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useDocuments = (patientId = null) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          patients:patient_id (
            full_name,
            patient_id
          )
        `)
        .order('uploaded_at', { ascending: false });
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error: err } = await query;
      
      if (err) throw err;
      setDocuments(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file, documentType, userId) => {
    setUploading(true);
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('patient-documents')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(fileName);
      
      // Save to database
      const { data, error: dbError } = await supabase
        .from('documents')
        .insert([{
          patient_id: patientId,
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          document_type: documentType,
          uploaded_by: userId
        }])
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      await fetchDocuments();
      return data;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (document) => {
    try {
      // Extract file path from URL
      const urlParts = document.file_url.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('patient-documents') + 1).join('/');
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('patient-documents')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);
      
      if (dbError) throw dbError;
      
      await fetchDocuments();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [patientId]);

  return {
    documents,
    loading,
    error,
    uploading,
    fetchDocuments,
    uploadDocument,
    deleteDocument
  };
};