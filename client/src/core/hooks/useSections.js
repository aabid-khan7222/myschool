
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService.js';

export const useSections = (classId = null) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('=== FETCHING SECTIONS ===');
      console.log('classId:', classId);
      
      let response;
      if (classId) {
        response = await apiService.getSectionsByClass(classId);
      } else {
        response = await apiService.getSections();
      }
      
      console.log('Sections response:', response);
      console.log('Sections data (first 3):', response.data?.slice(0, 3));
      
      // Log is_active values for debugging
      if (response.data && response.data.length > 0) {
        console.log('=== is_active VALUES FROM API ===');
        response.data.forEach((section, idx) => {
          console.log(`  Section ${idx + 1} (id=${section.id}, name='${section.section_name}'):`, {
            is_active: section.is_active,
            type: typeof section.is_active,
            stringified: JSON.stringify(section.is_active),
            strict_true: section.is_active === true,
            strict_false: section.is_active === false
          });
        });
      }
      
      // Clear any cached data and set fresh data
      setSections(response.data || []);
      console.log('=== SECTIONS SET IN STATE ===');
      console.log('Total sections:', response.data?.length || 0);
    } catch (err) {
      console.error('Error fetching sections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [classId]);

  return {
    sections,
    loading,
    error,
    refetch: fetchSections,
  };
};
