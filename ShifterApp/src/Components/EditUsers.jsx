import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@mui/material";
import api from "./ApiConfig";
import { useEffect, useState } from "react";

const EditUsers = () => {
  const [userList, setUserList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  
  const [originalUser, setOriginalUser] = useState(null); // Store original user data for comparison
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

  // Validate password if provided
  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,30}$/.test(password);

  const handleUserSelection = (userId) => {
    const selectedUser = userList.find((u) => u.userId === Number(userId));
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

    // Construct patch object based on changes
    const patchData = {};

    // Compare fields to originalUser to determine what changed
    if (!originalUser) {
      setError("Original user data not loaded. Please select a user again.");
      return;
    }

    // Check username change
    if (editedUser.username && editedUser.username !== originalUser.username) {
      patchData.username = editedUser.username;
    }

    // Check password only if provided
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
    if (editedUser.employee && editedUser.employee !== (originalUser.employee ? originalUser.employee.employeeId.toString() : "")) {
      // If employee changed, maybe regenerate username or just patch employee
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
      console.log(patchData);
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
      console.log(patchData);
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
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="selectUserLabel">User</InputLabel>
          <Select
            labelId="selectUserLabel"
            value={editedUser.userId || ""}
            onChange={(e) => handleUserSelection(e.target.value)}
            label="User"
          >
            <MenuItem value="">Select User</MenuItem>
            {userList.map((user) => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="selectEmployeeLabel">Employee</InputLabel>
          <Select
            labelId="selectEmployeeLabel"
            value={editedUser.employee || ""}
            onChange={(e) =>
              setEditedUser({
                ...editedUser,
                employee: e.target.value,
              })
            }
            label="Employee"
          >
            <MenuItem value="">Select Employee</MenuItem>
            {employeeList.map((employee) => (
              <MenuItem key={employee.employeeId} value={employee.employeeId}>
                {employee.firstName} {employee.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="selectRoleLabel">Role</InputLabel>
          <Select
            labelId="selectRoleLabel"
            value={editedUser.role || ""}
            onChange={(e) =>
              setEditedUser({
                ...editedUser,
                role: e.target.value,
              })
            }
            label="Role"
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Update User
        </Button>
      </form>
    </Box>
  );
};

export default EditUsers;
