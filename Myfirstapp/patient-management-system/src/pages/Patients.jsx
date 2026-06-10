import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import PatientCard from '../components/patients/PatientCard';
import PatientSearch from '../components/patients/PatientSearch';
import PatientForm from '../components/patients/PatientForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Patients = () => {
  const { patients, loading, deletePatient, searchPatients } = usePatients();
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSearch = (term) => {
    if (term.length > 1) {
      searchPatients(term);
    } else if (term.length === 0) {
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deletePatient(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage text="Loading patients..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
          <p className="text-gray-600 mt-1">Manage your patient records</p>
        </div>
        
        <Button onClick={() => {
          setEditingPatient(null);
          setShowModal(true);
        }}>
          <Plus size={18} className="mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <PatientSearch onSearch={handleSearch} />

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={(p) => {
                setEditingPatient(p);
                setShowModal(true);
              }}
              onDelete={(p) => setDeleteConfirm(p)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPatient(null);
        }}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
      >
        <PatientForm
          patient={editingPatient}
          onSuccess={() => {
            setShowModal(false);
            window.location.reload();
          }}
          onCancel={() => {
            setShowModal(false);
            setEditingPatient(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Patient"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deleteConfirm?.full_name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Patients;