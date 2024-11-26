import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DrawerComponent from "./DrawerComponent";
import WorkdayHandler from "./WorkdayHandler";
import CalendarComponent from "./CalendarComponent";
import axios from "axios";
import EmployeeHandler from "./EmployeeHandler";
import { Box, Button, Typography, IconButton } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

const ShiftPlanner = () => {
  // Define the CSRF token function
  const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null; // If token not found
  };

  const [checked, setChecked] = useState();
  const fetchedEmployees = EmployeeHandler(); // Fetch employees
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [workday, setWorkday] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [startDate, setStartDate] = useState(null); // Selected date for the workday
  const [error, setError] = useState(null);
  const csrfToken = getCsrfToken(); // CSRF token retrieved here

  // Fetch existing workday
  const fetchWorkday = async () => {
    if (!startDate) return; // Don't fetch if no date is selected
    try {
      const formattedDate = startDate.format("DD-MM-YYYY");
      const response = await axios.get(
        `http://localhost:8080/workday/${formattedDate}`,
        {
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": csrfToken },
          auth: { username: "admin", password: "admin" },
        }
      );

      const fetchedWorkday = response.data;
      const groupedWorkday = fetchedWorkday.shifts.reduce((acc, shift) => {
        if (!acc[shift.workstation]) acc[shift.workstation] = [];
        acc[shift.workstation].push(shift);
        return acc;
      }, {});

      setWorkday(groupedWorkday);
      setError(null); // Clear error if successful
    } catch (err) {
      setError("Failed to fetch workday. Please check the selected date.");
      console.error("Error fetching workday:", err);
      setWorkday({});
    }
  };

  // Use useEffect to call fetchWorkday when startDate or csrfToken changes
  useEffect(() => {
    fetchWorkday();
  }, [startDate, csrfToken]);

  useEffect(() => {
    setAvailableEmployees(fetchedEmployees);
  }, [fetchedEmployees]);

  // Function to handle saving the new workday
  const saveNewWorkday = async () => {
    if (!startDate) {
      setError("Please select a date before saving.");
      return;
    }

    try {
      const formattedDate = startDate.format("DD-MM-YYYY");

      // Create the payload from the current workday state
      const shiftIds = Object.values(workday)
        .flat()
        .map((shift) => shift.shiftId);

      // Send the PUT request to save the shifts for the selected date
      await axios.put(
        `http://localhost:8080/api/workdays/${formattedDate}/shift`,
        shiftIds, // Send an array of shift IDs as the payload
        {
          withCredentials: true,
          headers: { "X-XSRF-TOKEN": csrfToken },
          auth: { username: "admin", password: "admin" },
        }
      );

      setError(null);
      alert("Workday saved successfully!");
    } catch (err) {
      setError("Failed to save workday. Please try again.");
      console.error("Error saving workday:", err);
    }
  };

  const handleOpenDrawer = (shift) => {
    console.log("Opening Drawer with Shift:", shift); // Inspect the shift object
    setSelectedShift(shift); // Store the entire shift object
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
      // Send the updated employee to the server for the selected shift
      await axios.patch(
        `http://localhost:8080/api/shifts/${selectedShift.shiftId}/${employee.employeeId}`,
        { employee: employee.employeeId }, // Correct payload structure
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          auth: { username: "admin", password: "admin" },
        }
      );

      // Refresh the workday data after assigning the employee
      fetchWorkday();
      setDrawerOpen(false); // Close the drawer after selecting the employee
    } catch (error) {
      console.error("Error updating the shift's employee:", error);
      setError("Failed to update the employee for the shift.");
    }
  };

  return (
    <Box mt={10}>
      <Box
        borderRadius={5}
        sx={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#3a444a",
          color: "#ffffff",
          maxWidth: "70%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Select a date for the workday
        </Typography>
        <CalendarComponent startDate={startDate} setStartDate={setStartDate} />
      </Box>
      <Box mt={5}>
        {error && <Typography color="error">{error}</Typography>}
        <Box
          borderRadius={5}
          sx={{
            textAlign: "right",
            backgroundColor: "#3a444a",
            padding: "10px",
            maxWidth: "30%",
            marginLeft: "auto",
            marginRight: "0",
          }}
        >
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleSwitch} />}
            
          />
          <IconButton >
            <CloseFullscreenIcon sx={{color:"#eceff1"}}/>
          </IconButton>
        </Box>

        <WorkdayHandler
          startDate={startDate ? startDate.format("DD-MM-YYYY") : null}
          workday={workday}
          onShiftAssign={handleOpenDrawer} // Use this for the "+"
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
