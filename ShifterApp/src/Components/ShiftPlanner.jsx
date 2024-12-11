import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DrawerComponent from "./DrawerComponent";
import WorkdayHandler from "./WorkdayHandler";
import CalendarComponent from "./CalendarComponent";
import api from "./ApiConfig";
import EmployeeHandler from "./EmployeeHandler";
import { Box, Button, Typography, IconButton } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

const ShiftPlanner = () => {
  const [checked, setChecked] = useState();
  const fetchedEmployees = EmployeeHandler();
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [workday, setWorkday] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [error, setError] = useState(null);

  const fetchWorkday = async () => {
    if (!startDate) return;
    try {
      const formattedDate = startDate.format("DD-MM-YYYY");
      const response = await api.get(`workday/${formattedDate}`);

      const fetchedWorkday = response.data;
      const groupedWorkday = fetchedWorkday.shifts.reduce((acc, shift) => {
        if (!acc[shift.workstation]) acc[shift.workstation] = [];
        acc[shift.workstation].push(shift);
        return acc;
      }, {});

      setWorkday(groupedWorkday);
      setError(null);
    } catch (err) {
      setError(
        "Ongelma työpäivän löytämisessä. Ole hyvä ja tarkista valitsemasi päivämäärä."
      );
      console.error("Error fetching workday:", err);
      setWorkday({});
    }
  };

  useEffect(() => {
    fetchWorkday();
  }, [startDate]);

  useEffect(() => {
    setAvailableEmployees(fetchedEmployees);
  }, [fetchedEmployees]);

  const saveNewWorkday = async () => {
    if (!startDate) {
      setError("Ole hyvä ja valitse päivämäärä ennen työpäivän tallentamista.");
      return;
    }

    try {
      const formattedDate = startDate.format("DD-MM-YYYY");

      const shiftIds = Object.values(workday)
        .flat()
        .map((shift) => shift.shiftId);

      await api.put(`/api/workdays/${formattedDate}/shift`, shiftIds);

      setError(null);
      alert("Workday saved successfully!");
    } catch (err) {
      setError("Failed to save workday. Please try again.");
      console.error("Error saving workday:", err);
    }
  };

  const handleOpenDrawer = (shift) => {
    console.log("Opening Drawer with Shift:", shift);
    setSelectedShift(shift);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleSwitch = () => {
    setChecked();
  };

  console.log("Selected Shift:", selectedShift);

  const handleEmployeeSelect = async (employee) => {
    console.log("Employee object passed to handleEmployeeSelect:", employee);
    console.log("Selected Shift:", selectedShift);
    console.log("Selected employee's ID", employee.employeeId);

    try {
      await api.patch(
        `/api/shifts/${selectedShift.shiftId}/${employee.employeeId}`,
        { employee: employee.employeeId }
      );

      fetchWorkday();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Error updating the shift's employee:", error);
      setError("Failed to update the employee for the shift.");
    }
  };

  return (
    <Box
      mt={10}
      borderRadius={5}
      sx={{
        display: "flex",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#3a444a",
        color: "#ffffff",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Box mt={20} padding={3}>

      
      <Typography variant="h5" gutterBottom>
        Select a date for the workday
      </Typography>
      <CalendarComponent startDate={startDate} setStartDate={setStartDate} />
      </Box>
      <Box mt={5} sx={{maxWidth: "100%" }}>
        {error && <Typography color="error">{error}</Typography>}
        
        <WorkdayHandler
          startDate={startDate ? startDate.format("DD-MM-YYYY") : null}
          workday={workday}
          onShiftAssign={handleOpenDrawer}
        />
      </Box>
      <DrawerComponent
        open={drawerOpen}
        shift={selectedShift}
        onClose={handleCloseDrawer}
        employees={availableEmployees}
        onEmployeeSelect={handleEmployeeSelect}
      />
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={saveNewWorkday}>
          Save Workday
        </Button>
      </Box>
    </Box>
  );
};

ShiftPlanner.propTypes = {
  startDate: PropTypes.object,
};

export default ShiftPlanner;
