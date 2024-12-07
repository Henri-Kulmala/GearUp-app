import { useEffect, useState } from "react";
import { Box, TextField, Button, Alert, Typography, MenuItem } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import api from "./ApiConfig";

const EditUsers = () => {
  const [userList, setUserList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [originalUser, setOriginalUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    userId: "",
    username: "",
    password: "",
    role: "",
    confirmPassword: "",
    employee: ""
  });
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await api.get(`/api/employees`);
      setEmployeeList(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,30}$/.test(password);

  const handleUserSelection = (selectedUser) => {
    // `selectedUser` will be the entire user object selected from Autocomplete
    if (selectedUser) {
      setOriginalUser(selectedUser);
      setEditedUser({
        userId: selectedUser.userId,
        username: selectedUser.username || "",
        password: "",
        confirmPassword: "",
        role: selectedUser.role || "USER",
        employee: selectedUser.employee ? selectedUser.employee.employeeId.toString() : ""
      });
    } else {
      // Reset if no user selected
      setOriginalUser(null);
      setEditedUser({
        userId: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        employee: ""
      });
    }
  };

  const handleUserEdit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editedUser.userId) {
      setError("No user selected for editing.");
      return;
    }

    if (!originalUser) {
      setError("Original user data not loaded. Please select a user again.");
      return;
    }

    const patchData = {};

    // Check username change
    if (editedUser.username && editedUser.username !== originalUser.username) {
      patchData.username = editedUser.username;
    }

    // Password changes only if provided
    if (editedUser.password) {
      if (!isValidPassword(editedUser.password)) {
        setError("Password must be 5-30 chars, include one number and one uppercase letter.");
        return;
      }
      if (editedUser.password !== editedUser.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      patchData.password = editedUser.password;
    }

    // Check role change
    if (editedUser.role && editedUser.role !== originalUser.role) {
      patchData.role = editedUser.role;
    }

    // Check employee change
    const originalEmpId = originalUser.employee ? originalUser.employee.employeeId.toString() : "";
    if (editedUser.employee && editedUser.employee !== originalEmpId) {
      const selectedEmployee = employeeList.find((emp) => emp.employeeId === Number(editedUser.employee));
      if (!selectedEmployee) {
        setError("Selected employee not found.");
        return;
      }
      patchData.employee = { employeeId: Number(editedUser.employee) };
    }

    // If no changes, no need to patch
    if (Object.keys(patchData).length === 0) {
      alert("No changes detected.");
      return;
    }

    try {
      await api.patch(`/api/users/${editedUser.userId}`, patchData);
      alert("User updated successfully!");

      // Reset form and refetch users
      setEditedUser({
        userId: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "USER",
        employee: ""
      });
      setOriginalUser(null);
      await fetchUsers();
    } catch (error) {
      console.error("Error editing user", error);
      setError("Failed to edit user.");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h2" gutterBottom>
        Edit User
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleUserEdit}>

        {/* Autocomplete for User Selection with search functionality */}
        <Autocomplete
          sx={{ marginBottom: 2 }}
          options={userList}
          getOptionLabel={(option) => option.username}
          value={userList.find(u => u.userId === Number(editedUser.userId)) || null}
          onChange={(event, newValue) => {
            handleUserSelection(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search or Select User"
              variant="outlined"
            />
          )}
        />

        {/* Employee Selection */}
        <TextField
          select
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Employee"
          value={editedUser.employee || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              employee: e.target.value,
            })
          }
        >
          <MenuItem value="">Select Employee</MenuItem>
          {employeeList.map((employee) => (
            <MenuItem key={employee.employeeId} value={employee.employeeId}>
              {employee.firstName} {employee.lastName}
            </MenuItem>
          ))}
        </TextField>

        {/* Username, Password, Role Fields */}
        <TextField
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Username"
          type="text"
          value={editedUser.username}
          onChange={(e) =>
            setEditedUser({ ...editedUser, username: e.target.value })
          }
        />

        <TextField
          fullWidth
          sx={{ marginBottom: 2 }}
          label="Password (Optional)"
          type="password"
          value={editedUser.password}
          onChange={(e) =>
            setEditedUser({ ...editedUser, password: e.target.value })
          }
          helperText="Only required if changing password"
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
          value={editedUser.role || ""}
          onChange={(e) =>
            setEditedUser({
              ...editedUser,
              role: e.target.value,
            })
          }
        >
          <MenuItem value="USER">User</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>

        <Button type="submit" variant="contained" color="primary">
          Update User
        </Button>
      </form>
    </Box>
  );
};

export default EditUsers;
