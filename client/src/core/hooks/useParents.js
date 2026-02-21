import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

/**
 * @param {Object} options
 * @param {boolean} [options.forCurrentUser=false] - When true (e.g. Parent role), fetches only logged-in parent's data
 */
export const useParents = (options = {}) => {
  const { forCurrentUser = false } = options;
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchParents = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiMethod = forCurrentUser ? apiService.getMyParents.bind(apiService) : apiService.getParents.bind(apiService);
      const response = await apiMethod();
      if (response.status === 'SUCCESS') {
        const transformedData = (response.data || []).map((parent) => ({
          key: parent.id,
          id: parent.id,
          name: parent.father_name || 'N/A',
          Addedon: parent.created_at ? `Added on ${new Date(parent.created_at).toLocaleDateString('en-GB')}` : 'N/A',
          Child: `${parent.student_first_name || ''} ${parent.student_last_name || ''}`.trim() || 'N/A',
          class: `${parent.class_name || ''}, ${parent.section_name || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '') || 'N/A',
          phone: parent.father_phone || 'N/A',
          email: parent.father_email || 'N/A',
          ParentImage: "assets/img/parents/parent-01.jpg",
          ChildImage: "assets/img/students/student-01.jpg",
          student_admission_number: parent.admission_number,
          student_roll_number: parent.roll_number,
          mother_name: parent.mother_name,
          mother_email: parent.mother_email,
          mother_phone: parent.mother_phone,
          father_occupation: parent.father_occupation,
          mother_occupation: parent.mother_occupation,
          student_id: parent.student_id
        }));
        setParents(transformedData);
      } else {
        setError('Failed to fetch parents data');
      }
    } catch (err) {
      console.error('Error fetching parents:', err);
      setError(err.message || 'Failed to fetch parents data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, [forCurrentUser]);

  return {
    parents,
    loading,
    error,
    refetch: fetchParents
  };
};
