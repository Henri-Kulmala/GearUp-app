import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Modal,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const BreakEditorComponent = ({ open, onClose, breakData, employees = [], onSave }) => {
  const [editedBreak, setEditedBreak] = React.useState({});

  // Use `useEffect` to update `editedBreak` when `breakData` changes
  useEffect(() => {
    if (breakData) {
      setEditedBreak(breakData);
    }
  }, [breakData]);

  const handleChange = (field, value) => {
    setEditedBreak((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedBreak);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-break-modal-title"
      aria-describedby="edit-break-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography variant="h6" id="edit-break-modal-title">
          Edit Break
        </Typography>
        <TextField
          label="Break Start"
          type="time"
          value={editedBreak.breakStart || ""}
          onChange={(e) => handleChange("breakStart", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Break End"
          type="time"
          value={editedBreak.breakEnd || ""}
          onChange={(e) => handleChange("breakEnd", e.target.value)}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="employee-label">Cover Employee</InputLabel>
          <Select
            labelId="employee-label"
            value={editedBreak.breakCoverEmployee || ""}
            onChange={(e) => handleChange("breakCoverEmployee", e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <MenuItem key={employee.employeeId} value={employee}>
                  {`${employee.firstName} ${employee.lastName}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No employees available</MenuItem>
            )}
          </Select>
        </FormControl>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <IconButton onClick={handleSave} color="primary">
            <SaveIcon />
          </IconButton>
          <IconButton onClick={onClose} color="secondary">
            <CancelIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

BreakEditorComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  breakData: PropTypes.object.isRequired,
  employees: PropTypes.array,
  onSave: PropTypes.func.isRequired,
};

export default BreakEditorComponent;
