import { useState, useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import dayjs from "dayjs";
import ScheduleHandler from "./ScheduleHandler.jsx";
import CalendarComponent from "./CalendarComponent.jsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const formattedDate = selectedDate.format("DD-MM-YYYY");
  const scheduleRef = useRef();

  const handleDownloadPDF = async () => {
    const element = scheduleRef.current;

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 5, 
      useCORS: true, 
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`työpäivä_${formattedDate}.pdf`);
  };

  return (
    <Box
      display="flex"
      borderRadius={5}
      mt={15}
      mb={20}
      sx={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#3a444a",
        color: "#ffffff",
      }}
    >
      
      <Box mt={10}>
        <Typography variant="h3" fontWeight={600} p={2}>
          Valitse päivämäärä
        </Typography>
        <CalendarComponent
          startDate={selectedDate}
          setStartDate={setSelectedDate}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleDownloadPDF}
        >
          Lataa työpäivä PDF
        </Button>
      </Box>

      
      <Box ref={scheduleRef} sx={{ flex: 1 }}>
        <ScheduleHandler startDate={formattedDate} />
      </Box>
    </Box>
  );
}

export default Schedule;
