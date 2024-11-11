import { useEffect, useState } from "react";
import {
  Box,
  Grid2,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
//import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import PersonIcon from "@mui/icons-material/Person";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CoffeeIcon from "@mui/icons-material/Coffee";

function WorkdayHandler({ startDate }) {
  const [workday, setWorkday] = useState({});
  const [error, setError] = useState(null);

  const getCsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const fetchShiftsFromWorkday = async () => {
      if (!startDate) return;
      try {
        const csrfToken = getCsrfToken();

        const response = await axios.get(
          `http://localhost:8080/workday/${startDate}`,
          {
            withCredentials: true,
            headers: { "X-XSRF-TOKEN": csrfToken },
            auth: { username: "admin", password: "admin" },
          }
        );

        const fetchedWorkday = response.data;
        const shifts = fetchedWorkday.shifts || [];

        const groupedShifts = shifts.reduce((acc, shift) => {
          if (!acc[shift.workstation]) acc[shift.workstation] = [];

          const transformedShift = {
            ...shift,
            breaks: (shift.breaks || []).map((brk) => ({
              ...brk,
              breakCoverEmployee: (brk.breakCoverEmployee || []).map(
                (employee) => employee.name || "Unknown"
              ),
            })),
          };

          acc[shift.workstation].push(transformedShift);
          return acc;
        }, {});

        setWorkday(groupedShifts);
      } catch (err) {
        setError("Failed to fetch shifts");
        console.error(err);
      }
    };

    fetchShiftsFromWorkday();
  }, [startDate]);

  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Shifts for {startDate || "Select a date"}</h1>
      {error && <p>{error}</p>}
      <Box>
        <Grid2
          container
          direction="row"
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {Object.keys(workday).map((workstation) => (
            <Grid2
              container
              direction="column"
              spacing={2}
              key={workstation}
              bgcolor="#59676b"
              borderRadius={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mt: 4, mb: 2 }} variant="h2">
                {workstation}
              </Typography>

              <Box borderRadius={2}>
                {workday[workstation].map((shift) => (
                  <List key={shift.shiftId}>
                    <Typography
                      variant="h4"
                      fontWeight="light"
                      textAlign="center"
                      sx={{ mb: 2 }}
                    >
                      {shift.shiftName}
                    </Typography>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          shift.employee.firstName +
                          " " +
                          shift.employee.lastName
                        }
                        secondary="Employee"
                      ></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={shift.startTime}
                        secondary="Start Time"
                      ></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DoNotDisturbOnIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={shift.endTime}
                        secondary="End Time"
                      ></ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CoffeeIcon />
                      </ListItemIcon>
                      <ListItemText>Breaks:</ListItemText>{" "}
                    </ListItem>

                    {shift.breaks && shift.breaks.length > 0 ? (
                      <List>
                        {shift.breaks.map((brk, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              sx={{ pr: 2 }}
                              primary={brk.breakStart}
                              secondary="Start"
                            ></ListItemText>

                            <ListItemText
                              primary={brk.breakEnd}
                              secondary="End"
                            ></ListItemText>
                            <List>
                              <ListItem>
                                <ListItemText>Cover Employee:</ListItemText>
                              </ListItem>
                              {brk.breakCoverEmployee.map(
                                (employeeName, empIndex) => (
                                  <ListItem key={empIndex}>
                                    {employeeName}
                                  </ListItem>
                                )
                              )}
                            </List>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <p>No breaks available</p>
                    )}
                  </List>
                ))}
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
}

WorkdayHandler.propTypes = {
  startDate: PropTypes.string.isRequired,
};

export default WorkdayHandler;
