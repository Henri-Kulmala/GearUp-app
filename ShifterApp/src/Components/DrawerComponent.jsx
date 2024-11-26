import PropTypes from "prop-types";
import {
  Box,
  Drawer,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const DrawerComponent = ({ open, onClose, employees, onEmployeeSelect }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 300, padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select Employee
        </Typography>
        <List>
          {employees.map((employee) => (
            <ListItem
              button
              key={employee.employeeId}
              onClick={() => {
                onEmployeeSelect(employee);
                onClose();
              }}
            >
              <ListItemIcon>
                <AddIcon
                  onClick={() => {
                    onEmployeeSelect(employee);
                    onClose();
                  }}
                  sx={{ cursor: 'pointer' }}
                />
              </ListItemIcon>
              <ListItemText
                primary={employee.employeeFullName}
                secondary={employee.employeeQualification ? "Qualified" : ""}
              />
            </ListItem>
          ))}
        </List>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};

DrawerComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      employeeId: PropTypes.number.isRequired,
      employeeFullName: PropTypes.string.isRequired,
      employeeQualification: PropTypes.bool,
    })
  ).isRequired,
  onEmployeeSelect: PropTypes.func.isRequired,
};

export default DrawerComponent;
