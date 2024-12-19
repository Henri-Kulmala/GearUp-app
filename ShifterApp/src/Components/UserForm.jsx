import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "./ApiConfig";

const UserForm = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [originalUser, setOriginalUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    userId: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "USER",
    employee: "",
  });
  const [error, setError] = useState("");

  const openConfirmDialog = () => setConfirmDialogOpen(true);
  const closeConfirmDialog = () => setConfirmDialogOpen(false);


  const fetchEmployees = async () => {
    try {
      const response = await api.get("/api/employees");
      setEmployeeList(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUserList(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
  }, []);

  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,30}$/.test(password);


  const handleUserSelect = (selectedUser) => {
    if (selectedUser) {
      setOriginalUser(selectedUser);
      setEditedUser({
        userId: selectedUser.userId,
        username: selectedUser.username || "",
        password: "",
        confirmPassword: "",
        role: selectedUser.role || "USER",
        employee: selectedUser.employee
          ? selectedUser.employee.employeeId.toString()
          : "",
      });
    } else {

      setOriginalUser(null);
      setEditedUser({
        userId: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        employee: "",
      });
    }
  };


  const handleEmployeeSelect = (selectedEmployee) => {
    if (selectedEmployee) {
      setEditedUser((prev) => ({
        ...prev,
        employee: selectedEmployee.employeeId.toString(),
      }));
    } else {
      setEditedUser((prev) => ({ ...prev, employee: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isEditMode = !!editedUser.userId;

    if (!isEditMode) {
      if (!editedUser.employee) {
        setError("Please select an employee to generate a username.");
        return;
      }
      const selectedEmployee = employeeList.find(
        (emp) => emp.employeeId === Number(editedUser.employee)
      );
      if (!selectedEmployee) {
        setError("Invalid employee selected.");
        return;
      }
      if (!editedUser.username) {
        let newUsername =
          selectedEmployee.firstName.slice(0, 3) +
          selectedEmployee.lastName.slice(0, 3);

        if (userList.some((u) => u.username === newUsername)) {
          newUsername += "1";
        }

        editedUser.username = newUsername;
      }
    }

    if (!isEditMode && !editedUser.password) {
      setError("Password is required for new users.");
      return;
    }

    if (editedUser.password && !isValidPassword(editedUser.password)) {
      setError(
        "Password must be 5-30 chars, include one uppercase and one digit."
      );
      return;
    }

    if (
      editedUser.password &&
      editedUser.password !== editedUser.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    let payload = {
      username: editedUser.username || "",
      role: editedUser.role || "USER",
    };
    if (editedUser.password) {
      payload.password = editedUser.password;
    }
    if (editedUser.employee) {
      payload.employee = { employeeId: Number(editedUser.employee) };
    }

    try {
      if (isEditMode) {
        const patchData = {};

        if (editedUser.username !== originalUser.username)
          patchData.username = editedUser.username;
        if (editedUser.password) patchData.password = editedUser.password;
        if (editedUser.role !== originalUser.role)
          patchData.role = editedUser.role;

        const originalEmpId = originalUser.employee
          ? originalUser.employee.employeeId.toString()
          : "";
        if (editedUser.employee && editedUser.employee !== originalEmpId) {
          patchData.employee = { employeeId: Number(editedUser.employee) };
        }

        if (Object.keys(patchData).length === 0) {
          alert("No changes detected.");
          return;
        }

        await api.patch(`/api/users/${editedUser.userId}`, patchData);
        alert("User updated successfully!");
      } else {
        const response = await api.post("/api/users", payload);
        alert(
          "User created successfully with username: " + response.data.username
        );
      }

      setOriginalUser(null);
      setEditedUser({
        userId: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        employee: "",
      });
      await fetchUsers();
    } catch (err) {
      console.error("Error saving user", err);
      setError("Failed to save user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    setError("");
    try {
      await api.delete(`/api/users/${userId}`);
      alert(`User #${userId} deleted successfully`);
    } catch (err) {
      console.error("Error deleting user", err);
      setError("Failed to delete user.");
    }
  };

  const confirmDelete = () => {
    handleDeleteUser(editedUser.userId);
    closeConfirmDialog();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h2" fontWeight={600} gutterBottom sx={{color: "#191b1f"}}>
        {editedUser.userId ? "Muokkaa käyttäjä" : "Lisää käyttäjä"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>

        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Autocomplete
              options={userList}
              getOptionLabel={(option) => option.username}
              value={
                userList.find((u) => u.userId === Number(editedUser.userId)) ||
                null
              }
              onChange={(event, newValue) => handleUserSelect(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search or Select User (Leave empty to add new)"
                  variant="outlined"
                />
              )}
            />
          </Box>


          {editedUser.userId && (
            <IconButton
              aria-label="delete user"
              color="error"
              onClick={openConfirmDialog}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>


        <Autocomplete
          sx={{ marginBottom: 2 }}
          options={employeeList}
          getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
          value={
            employeeList.find(
              (emp) => emp.employeeId === Number(editedUser.employee)
            ) || null
          }
          onChange={(event, newValue) => handleEmployeeSelect(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search or Select Employee"
              variant="outlined"
            />
          )}
        />

        <TextField
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Username"
          type="text"
          value={editedUser.username}
          onChange={(e) =>
            setEditedUser({ ...editedUser, username: e.target.value })
          }
          disabled={!!editedUser.userId && !editedUser.employee}
        />

        <TextField
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Password"
          type="password"
          value={editedUser.password}
          onChange={(e) =>
            setEditedUser({ ...editedUser, password: e.target.value })
          }
          helperText={
            editedUser.userId
              ? "Only required if changing password"
              : "min. 5 chars, includes uppercase & digit"
          }
        />

        <TextField
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Confirm Password"
          type="password"
          value={editedUser.confirmPassword}
          onChange={(e) =>
            setEditedUser({ ...editedUser, confirmPassword: e.target.value })
          }
        />

        <TextField
          select
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Role"
          value={editedUser.role || "USER"}
          onChange={(e) =>
            setEditedUser({ ...editedUser, role: e.target.value })
          }
        >
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" color="primary">
          {editedUser.userId ? "Update User" : "Create User"}
        </Button>
      </form>

      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        aria-labelledby="confirm-delete-dialog-title"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserForm;
