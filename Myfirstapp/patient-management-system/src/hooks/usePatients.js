import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (err) throw err;
      setPatients(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patientData) => {
    try {
      const { data, error: err } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();
      
      if (err) throw err;
      await fetchPatients();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const updatePatient = async (id, updates) => {
    try {
      const { data, error: err } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (err) throw err;
      await fetchPatients();
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const deletePatient = async (id) => {
    try {
      const { error: err } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
      
      if (err) throw err;
      await fetchPatients();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const searchPatients = async (searchTerm) => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('patients')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,patient_id.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .order('full_name');
      
      if (err) throw err;
      setPatients(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients
  };
};