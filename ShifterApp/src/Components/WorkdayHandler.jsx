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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

const WorkdayHandler = ({ startDate, workday, onShiftAssign }) => {
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
      <Typography variant="h4" fontWeight={600} gutterBottom mb={5}>
        Työvuorot päivämäärälle {startDate || "Select a date"}
      </Typography>
      {Object.keys(workday).length === 0 ? (
        <Typography variant="body1" color="#f2f5a2">
          No workday data available. Please check the selected date.
        </Typography>
      ) : (
        <Grid2 container spacing={3}>
          {Object.keys(workday).map((workstation) => (
            <Grid2 item xs={12} sm={6} md={4} key={workstation}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#3a444a",
                  borderRadius: 2,
                  boxShadow: 1,
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
                                : "No Employee Assigned"
                            }
                            secondary="Assigned Employee"
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
                                  ? `Covered by: ${brk.breakCoverEmployee.firstName} ${brk.breakCoverEmployee.lastName}`
                                  : "No Cover"
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
                  <Typography>
                    No shifts available for this workstation.
                  </Typography>
                )}
              </Box>
            </Grid2>
          ))}
        </Grid2>
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
