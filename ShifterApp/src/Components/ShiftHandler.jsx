import { useEffect, useState } from 'react';
import {Box} from '@mui/material';
import axios from 'axios';

function ShiftHandler() {
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState(null);

  // Function to retrieve the CSRF token from cookies
  const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  useEffect(() => {
    const fetchShifts = async () => {
      try {
   
        const csrfToken = getCsrfToken();

    
        const response = await axios.get('http://localhost:8080/api/shifts', {
          withCredentials: true, 
          headers: {
            'X-XSRF-TOKEN': csrfToken, 
          },
          auth: {
            username: 'admin',  
            password: 'admin', 
          },
        });

        setShifts(response.data); 
      } catch (err) {
        setError('Failed to fetch shifts'); 
        console.error(err);
      }
    };

    fetchShifts(); 
  }, []);

  return (
    <Box>
      <h1>Shifts</h1>
      {error && <p>{error}</p>}
      <ul>
        {shifts.map((shift) => (
          <li key={shift.id}>{shift.shiftName}{shift.startTime}{shift.endTime}{shift.workstation}</li>
         
        ))}
      </ul>
    </Box>
  );
}

export default ShiftHandler;
