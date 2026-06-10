import { supabase } from './supabase';

export const documentService = {
  // Get all documents
  async getAllDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          patients:patient_id (
            id,
            full_name,
            patient_id
          )
        `)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return { documents: data, error: null };
    } catch (error) {
      return { documents: null, error: error.message };
    }
  },

  // Get documents by patient ID
  async getDocumentsByPatientId(patientId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('patient_id', patientId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return { documents: data, error: null };
    } catch (error) {
      return { documents: null, error: error.message };
    }
  },

  // Get single document
  async getDocumentById(id) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { document: data, error: null };
    } catch (error) {
      return { document: null, error: error.message };
    }
  },

  // Upload document to storage and save to database
  async uploadDocument(file, patientId, documentType, userId) {
    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
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
      
      return { document: data, error: null };
    } catch (error) {
      return { document: null, error: error.message };
    }
  },

  // Delete document
  async deleteDocument(document) {
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
      
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Download document (get download URL)
  async getDocumentUrl(document) {
    try {
      // For public buckets, return the public URL
      return { url: document.file_url, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // Get documents by type
  async getDocumentsByType(patientId, documentType) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('patient_id', patientId)
        .eq('document_type', documentType)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return { documents: data, error: null };
    } catch (error) {
      return { documents: null, error: error.message };
    }
  }
};