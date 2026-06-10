import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, Eye, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientCard = ({ patient, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{patient.full_name}</h3>
              <p className="text-sm text-gray-500">{patient.patient_id}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handleView}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onEdit(patient)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
              title="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => onDelete(patient)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mt-4">
          {patient.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={14} className="mr-2 text-gray-400" />
              <span>{patient.phone}</span>
            </div>
          )}
          {patient.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-2 text-gray-400" />
              <span className="truncate">{patient.email}</span>
            </div>
          )}
          {patient.date_of_birth && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-2 text-gray-400" />
              <span>DOB: {new Date(patient.date_of_birth).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Blood Group Badge */}
        {patient.blood_group && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Blood: {patient.blood_group}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PatientCard;