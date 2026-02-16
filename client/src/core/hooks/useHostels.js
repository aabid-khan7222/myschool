import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export const useHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getHostels();
      
      if (response.status === 'SUCCESS') {
        // Log raw data to debug
        console.log('=== HOSTELS RAW DATA ===');
        console.log('Response data:', response.data);
        if (response.data && response.data.length > 0) {
          console.log('First hostel raw data:', response.data[0]);
          console.log('First hostel keys:', Object.keys(response.data[0]));
        }
        
        // Transform the API data to match the expected format
        const transformedData = response.data.map((hostel, index) => {
          // Handle multiple possible column name variations for intake
          // Check in order: intake, intake_capacity, capacity, hostel_intake, max_intake
          const intakeValue = hostel.intake !== undefined && hostel.intake !== null && hostel.intake !== '' ? hostel.intake :
                             hostel.intake_capacity !== undefined && hostel.intake_capacity !== null && hostel.intake_capacity !== '' ? hostel.intake_capacity :
                             hostel.capacity !== undefined && hostel.capacity !== null && hostel.capacity !== '' ? hostel.capacity :
                             hostel.hostel_intake !== undefined && hostel.hostel_intake !== null && hostel.hostel_intake !== '' ? hostel.hostel_intake :
                             hostel.max_intake !== undefined && hostel.max_intake !== null && hostel.max_intake !== '' ? hostel.max_intake :
                             null;
          
          // Handle multiple possible column name variations for description
          // Check in order: description, hostel_description, desc
          const descriptionValue = hostel.description !== undefined && hostel.description !== null && hostel.description !== '' ? hostel.description :
                                  hostel.hostel_description !== undefined && hostel.hostel_description !== null && hostel.hostel_description !== '' ? hostel.hostel_description :
                                  hostel.desc !== undefined && hostel.desc !== null && hostel.desc !== '' ? hostel.desc :
                                  null;
          
          const transformed = {
            key: (index + 1).toString(),
            id: `H${hostel.id}` || `H${index + 1}`,
            hostelName: hostel.hostel_name || hostel.name || 'N/A',
            hostelType: hostel.hostel_type || hostel.type || 'N/A',
            address: hostel.address || 'N/A',
            inTake: intakeValue !== null ? String(intakeValue) : 'N/A',
            description: descriptionValue !== null ? String(descriptionValue) : 'N/A',
            originalData: hostel, // Store original data for edit modal
          };
          
          // Log transformation for first item
          if (index === 0) {
            console.log('=== TRANSFORMATION DEBUG ===');
            console.log('Raw hostel:', hostel);
            console.log('Intake value found:', intakeValue);
            console.log('Description value found:', descriptionValue);
            console.log('Transformed:', transformed);
          }
          
          return transformed;
        });
        
        setHostels(transformedData);
      } else {
        setError('Failed to fetch hostels data');
      }
    } catch (err) {
      console.error('Error fetching hostels:', err);
      setError(err.message || 'Failed to fetch hostels data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  return {
    hostels,
    loading,
    error,
    refetch: fetchHostels
  };
};
