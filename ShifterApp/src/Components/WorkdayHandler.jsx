import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid2,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";

const WorkdayHandler = ({ startDate, workday, onShiftAssign }) => {
  const [currentWorkstationIndex, setCurrentWorkstationIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const workstations = Object.keys(workday);
  const currentWorkstation =
    workstations.length > 0 ? workstations[currentWorkstationIndex] : null;

  const handleNextWorkstation = () => {
    if (currentWorkstationIndex < workstations.length - 1) {
      setCurrentWorkstationIndex(currentWorkstationIndex + 1);
    }
  };

  const handlePreviousWorkstation = () => {
    if (currentWorkstationIndex > 0) {
      setCurrentWorkstationIndex(currentWorkstationIndex - 1);
    }
  };

  const handleToggle = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <Box
      borderRadius={5}
      padding={3}
      sx={{
        textAlign: "center",
        backgroundColor: "#21292e",
        color: "#ffffff",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        gap={3}
      >
        <Typography variant="h4" fontWeight={600}>
          {startDate ? `Työpäivä: ${startDate}` : "Työpäivä..."}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch />}
            label="Laajenna"
            onChange={handleToggle}
          />
        </FormGroup>
      </Box>

      {isMinimized ? (
        <Grid2 container spacing={2}>
          {workstations.map((workstation) => (
            <Grid2 item xs={12} mt={5} sm={6} pb={10} md={4} key={workstation}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#3a444a",
                  borderRadius: 2,
                  boxShadow: 1,
                  height: "100%",
                }}
              >
                <Typography variant="h6">{workstation}</Typography>
                {Array.isArray(workday[workstation]) ? (
                  workday[workstation].map((shift) => (
                    <Box
                      key={shift.shiftId}
                      sx={{
                        margin: "8px 0",
                        padding: 2,
                        border: "1px solid gray",
                        borderRadius: 2,
                        backgroundColor: "#485761",
                      }}
                    >
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <AccessTimeFilledIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={shift.shiftName}
                            secondary={`${shift.startTime} - ${shift.endTime}`}
                          />
                          <IconButton color="dark">
                            <EditIcon />
                          </IconButton>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              shift.employee
                                ? `${shift.employee.firstName} ${shift.employee.lastName}`
                                : "Ei työntekijää valittuna"
                            }
                            secondary="Työntekijä"
                          />
                          <IconButton
                            onClick={() => onShiftAssign(shift)}
                            color="primary"
                          >
                            <AddIcon />
                          </IconButton>
                        </ListItem>
                      </List>

                      <List>
                        {shift.breaks.map((brk, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={`${brk.breakType}: ${brk.breakStart} - ${brk.breakEnd}`}
                              secondary={
                                brk.breakCoverEmployee
                                  ? `Tuuraaja: ${brk.breakCoverEmployee.firstName} ${brk.breakCoverEmployee.lastName}`
                                  : "Ei tuuraajaa"
                              }
                            />
                            <IconButton color="dark">
                              <EditIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))
                ) : (
                  <Typography>Ei vuoroja saatavilla päivämäärälle</Typography>
                )}
              </Box>
            </Grid2>
          ))}
        </Grid2>
      ) : currentWorkstation ? (
        <Box
          sx={{
            padding: 5,
            backgroundColor: "#3a444a",
            borderRadius: 2,
            boxShadow: 1,
            mb: 3,
            mt: 5,
            gap: 5,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            p={1}
            gap={5}
          >
            <IconButton
              color="primary"
              onClick={handlePreviousWorkstation}
              disabled={currentWorkstationIndex === 0}
            >
              <ArrowBackIosIcon />
            </IconButton>
            <Typography variant="h6">{currentWorkstation}</Typography>
            <IconButton
              color="primary"
              onClick={handleNextWorkstation}
              disabled={currentWorkstationIndex === workstations.length - 1}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          {Array.isArray(workday[currentWorkstation]) ? (
            workday[currentWorkstation].map((shift) => (
              <Box
                key={shift.shiftId}
                sx={{
                  margin: "8px 0",
                  padding: 2,
                  border: "1px solid gray",
                  borderRadius: 2,
                  backgroundColor: "#485761",
                }}
              >
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeFilledIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={shift.shiftName}
                      secondary={`${shift.startTime} - ${shift.endTime}`}
                    />
                    <IconButton color="dark">
                      <EditIcon />
                    </IconButton>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        shift.employee
                          ? `${shift.employee.firstName} ${shift.employee.lastName}`
                          : "Ei työntekijää valittuna"
                      }
                      secondary="Työntekijä"
                    />
                    <IconButton
                      onClick={() => onShiftAssign(shift)}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  </ListItem>
                </List>

                <List>
                  {shift.breaks.map((brk, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${brk.breakType}: ${brk.breakStart} - ${brk.breakEnd}`}
                        secondary={
                          brk.breakCoverEmployee
                            ? `Tuuraaja: ${brk.breakCoverEmployee.firstName} ${brk.breakCoverEmployee.lastName}`
                            : "Ei tuuraajaa"
                        }
                      />
                      <IconButton color="dark">
                        <EditIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))
          ) : (
            <Typography>No shifts available for this workstation.</Typography>
          )}
        </Box>
      ) : (
        <Typography variant="body1" color="#f2f5a2">
          No shifts available. Please select another date.
        </Typography>
      )}
    </Box>
  );
};

WorkdayHandler.propTypes = {
  startDate: PropTypes.string,
  workday: PropTypes.object.isRequired,
  onShiftAssign: PropTypes.func.isRequired,
};

export default WorkdayHandler;
