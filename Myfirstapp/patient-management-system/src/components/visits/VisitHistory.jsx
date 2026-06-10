import React from 'react';
import { Calendar, Activity, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

const VisitHistory = ({ visits, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this visit?')) return;
    
    try {
      const { error } = await supabase
        .from('visits')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error deleting visit:', error);
    }
  };

  if (visits.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Activity size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No visits recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <div key={visit.id} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-800">
                {new Date(visit.visit_date).toLocaleDateString()}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {visit.visit_type}
              </span>
            </div>
            <button
              onClick={() => handleDelete(visit.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visit.symptoms && (
              <div>
                <p className="text-sm text-gray-500">Symptoms</p>
                <p className="text-gray-800">{visit.symptoms}</p>
              </div>
            )}
            {visit.diagnosis && (
              <div>
                <p className="text-sm text-gray-500">Diagnosis</p>
                <p className="text-gray-800">{visit.diagnosis}</p>
              </div>
            )}
            {visit.prescription && (
              <div>
                <p className="text-sm text-gray-500">Prescription</p>
                <p className="text-gray-800">{visit.prescription}</p>
              </div>
            )}
            {visit.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-gray-800">{visit.notes}</p>
              </div>
            )}
            {(visit.blood_pressure || visit.temperature || visit.weight) && (
              <div>
                <p className="text-sm text-gray-500">Vitals</p>
                <p className="text-gray-800">
                  {visit.blood_pressure && `BP: ${visit.blood_pressure} `}
                  {visit.temperature && `Temp: ${visit.temperature}°C `}
                  {visit.weight && `Weight: ${visit.weight}kg`}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VisitHistory;