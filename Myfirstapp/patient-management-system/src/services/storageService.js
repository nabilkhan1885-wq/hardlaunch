import { supabase } from './supabase';

export const storageService = {
  // Upload file to patient documents bucket
  async uploadFile(file, patientId, folder = 'documents') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${patientId}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(fileName);
      
      return { 
        url: publicUrl, 
        path: fileName, 
        error: null 
      };
    } catch (error) {
      return { url: null, path: null, error: error.message };
    }
  },

  // Delete file from storage
  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from('patient-documents')
        .remove([filePath]);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get file URL
  async getFileUrl(filePath) {
    try {
      const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(filePath);
      
      return { url: publicUrl, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  },

  // List files in a folder
  async listFiles(patientId, folder = 'documents') {
    try {
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .list(`${patientId}/${folder}/`);
      
      if (error) throw error;
      return { files: data, error: null };
    } catch (error) {
      return { files: null, error: error.message };
    }
  },

  // Download file
  async downloadFile(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .download(filePath);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Check if file exists
  async fileExists(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .list(filePath.split('/').slice(0, -1).join('/'), {
          limit: 1,
          offset: 0,
          search: filePath.split('/').pop()
        });
      
      if (error) throw error;
      return { exists: data && data.length > 0, error: null };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  },

  // Get storage stats
  async getStorageStats() {
    try {
      // Get all files in bucket
      const { data, error } = await supabase.storage
        .from('patient-documents')
        .list('', {
          limit: 1000,
          offset: 0
        });
      
      if (error) throw error;
      
      let totalSize = 0;
      let fileCount = 0;
      
      // Recursively calculate size (simplified)
      const calculateSize = async (items, path = '') => {
        for (const item of items) {
          if (item.id) {
            // It's a file
            totalSize += item.metadata?.size || 0;
            fileCount++;
          } else if (item.name) {
            // It's a folder - list contents
            const { data: subItems } = await supabase.storage
              .from('patient-documents')
              .list(`${path}${item.name}`);
            if (subItems) {
              await calculateSize(subItems, `${path}${item.name}/`);
            }
          }
        }
      };
      
      await calculateSize(data);
      
      return {
        totalSize: (totalSize / (1024 * 1024)).toFixed(2), // in MB
        fileCount,
        error: null
      };
    } catch (error) {
      return { totalSize: 0, fileCount: 0, error: error.message };
    }
  }
};