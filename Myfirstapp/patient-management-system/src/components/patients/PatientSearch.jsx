import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientSearch = ({ onSearch, onFilter, initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    bloodGroup: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      gender: '',
      bloodGroup: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(emptyFilters);
    if (onFilter) {
      onFilter(emptyFilters);
    }
    setShowFilters(false);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, patient ID, phone, or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg transition flex items-center space-x-2
            ${hasActiveFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
        >
          <Filter size={18} />
          <span>Filter</span>
          {hasActiveFilters && (
            <span className="ml-1 w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    value={filters.bloodGroup}
                    onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientSearch;