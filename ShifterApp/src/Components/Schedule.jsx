import { useState } from "react";
import { Box } from "@mui/material";
import dayjs from "dayjs";

import WorkdayHandler from "./WorkdayHandler.jsx";
import CalendarComponent from "./CalendarComponent.jsx";


function Schedule() {
    const [selectedDate, setSelectedDate] = useState(dayjs());
  
    const formattedDate = selectedDate.format("DD-MM-YYYY");
  
    return (
      
      <Box
        sx={{
          backgroundColor: "#ededed",
          backgroundSize: "cover",
          minHeight: "100vh",
          minWidth: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "2rem",
          mt: "10%"
        }}
        gap={4}
      >

  
  
        <Box
          borderRadius={5}
          sx={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#3a444a",
            color: "#ffffff",
          }}
        >
          <h1>Select a date</h1>
          <CalendarComponent
            startDate={selectedDate}
            setStartDate={setSelectedDate}
          />
        </Box>
        <Box>
          <WorkdayHandler startDate={formattedDate} />
        </Box>
      </Box>
    );
  }

  export default Schedule;