import { useState } from 'react';
import { Box } from '@mui/material';

import WorkdayHandler from './Components/WorkdayHandler';
import CalendarComponent from './Components/CalendarComponent';

function WorkdayApp() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Convert selectedDate to a formatted string when passing to WorkdayHandler
    const formattedDate = selectedDate instanceof Date ? selectedDate.toLocaleDateString("en-GB").replace(/\//g, "-") : "";

    return (
        <Box>
            <h1>Select a date</h1>
            <CalendarComponent startDate={selectedDate} setStartDate={setSelectedDate}/>
            <WorkdayHandler startDate={formattedDate}/>
        </Box>
    );
}

export default WorkdayApp;
