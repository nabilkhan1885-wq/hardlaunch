import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useVisits = (patientId = null) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('visits')
        .select(`
          *,
          patients:patient_id (
            full_name,
            patient_id
          )
        `)
        .order('visit_date', { ascending: false });
      
      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      
      const { data, error: err } = await query;
      
      if (err) throw err;
      setVisits(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createVisit = async (visitData) => {
    try {
      const { data, error: err } = await supabase
        .from('visits')
        .insert([visitData])
        .select()
        .single();
      
      if (err) throw err;
      await fetchVisits();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updateVisit = async (id, updates) => {
    try {
      const { data, error: err } = await supabase
        .from('visits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (err) throw err;
      await fetchVisits();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deleteVisit = async (id) => {
    try {
      const { error: err } = await supabase
        .from('visits')
        .delete()
        .eq('id', id);
      
      if (err) throw err;
      await fetchVisits();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [patientId]);

  return {
    visits,
    loading,
    error,
    fetchVisits,
    createVisit,
    updateVisit,
    deleteVisit
  };
};