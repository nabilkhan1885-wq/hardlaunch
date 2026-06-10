import { supabase } from './supabase';

export const visitService = {
  // Get all visits
  async getAllVisits() {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          patients:patient_id (
            id,
            full_name,
            patient_id
          )
        `)
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      return { visits: data, error: null };
    } catch (error) {
      return { visits: null, error: error.message };
    }
  },

  // Get visits by patient ID
  async getVisitsByPatientId(patientId) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('patient_id', patientId)
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      return { visits: data, error: null };
    } catch (error) {
      return { visits: null, error: error.message };
    }
  },

  // Get single visit
  async getVisitById(id) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { visit: data, error: null };
    } catch (error) {
      return { visit: null, error: error.message };
    }
  },

  // Create new visit
  async createVisit(visitData) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .insert([visitData])
        .select()
        .single();
      
      if (error) throw error;
      return { visit: data, error: null };
    } catch (error) {
      return { visit: null, error: error.message };
    }
  },

  // Update visit
  async updateVisit(id, updates) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { visit: data, error: null };
    } catch (error) {
      return { visit: null, error: error.message };
    }
  },

  // Delete visit
  async deleteVisit(id) {
    try {
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  // Get visits by date range
  async getVisitsByDateRange(startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          patients:patient_id (
            full_name
          )
        `)
        .gte('visit_date', startDate)
        .lte('visit_date', endDate)
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      return { visits: data, error: null };
    } catch (error) {
      return { visits: null, error: error.message };
    }
  },

  // Get visit statistics
  async getVisitStats() {
    try {
      // Total visits
      const { count: totalVisits, error: totalError } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      // Visits by type
      const { data: visitsByType, error: typeError } = await supabase
        .from('visits')
        .select('visit_type, count')
        .select('visit_type')
        .then(async (result) => {
          const { data, error } = await supabase
            .from('visits')
            .select('visit_type', { count: 'exact' })
            .group('visit_type');
          return { data, error };
        });
      
      // Most common diagnoses
      const { data: topDiagnoses, error: diagnosisError } = await supabase
        .from('visits')
        .select('diagnosis')
        .not('diagnosis', 'is', null);
      
      return { 
        totalVisits, 
        visitsByType: visitsByType || [],
        topDiagnoses: topDiagnoses || [],
        error: null 
      };
    } catch (error) {
      return { totalVisits: 0, visitsByType: [], topDiagnoses: [], error: error.message };
    }
  },

  // Get today's visits
  async getTodaysVisits() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          patients:patient_id (
            full_name,
            phone
          )
        `)
        .eq('visit_date', today)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { visits: data, error: null };
    } catch (error) {
      return { visits: null, error: error.message };
    }
  }
};