import { supabase } from './supabase';

export const patientService = {
  // Get all patients
  async getAllPatients() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { patients: data, error: null };
    } catch (error) {
      return { patients: null, error: error.message };
    }
  },

  // Get patient by ID
  async getPatientById(id) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { patient: data, error: null };
    } catch (error) {
      return { patient: null, error: error.message };
    }
  },

  // Get patient by patient ID (PAT-xxxx)
  async getPatientByPatientId(patientId) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', patientId)
        .single();
      
      if (error) throw error;
      return { patient: data, error: null };
    } catch (error) {
      return { patient: null, error: error.message };
    }
  },

  // Create new patient
  async createPatient(patientData) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();
      
      if (error) throw error;
      return { patient: data, error: null };
    } catch (error) {
      return { patient: null, error: error.message };
    }
  },

  // Update patient
  async updatePatient(id, updates) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { patient: data, error: null };
    } catch (error) {
      return { patient: null, error: error.message };
    }
  },

  // Delete patient
  async deletePatient(id) {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Search patients
  async searchPatients(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,patient_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('full_name');
      
      if (error) throw error;
      return { patients: data, error: null };
    } catch (error) {
      return { patients: null, error: error.message };
    }
  },

  // Get patients with visits count
  async getPatientsWithStats() {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          visits:visits(count)
        `);
      
      if (error) throw error;
      return { patients: data, error: null };
    } catch (error) {
      return { patients: null, error: error.message };
    }
  },

  // Get recent patients (last 30 days)
  async getRecentPatients(limit = 10) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { patients: data, error: null };
    } catch (error) {
      return { patients: null, error: error.message };
    }
  }
};