import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useAnalytics = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    totalDocuments: 0,
    recentPatients: [],
    recentVisits: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Get total patients
      const { count: totalPatients } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Get total visits
      const { count: totalVisits } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });

      // Get total documents
      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true });

      // Get recent patients
      const { data: recentPatients } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent visits
      const { data: recentVisits } = await supabase
        .from('visits')
        .select(`
          *,
          patients:patient_id (
            full_name
          )
        `)
        .order('visit_date', { ascending: false })
        .limit(5);

      setStats({
        totalPatients: totalPatients || 0,
        totalVisits: totalVisits || 0,
        totalDocuments: totalDocuments || 0,
        recentPatients: recentPatients || [],
        recentVisits: recentVisits || []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchAnalytics
  };
};