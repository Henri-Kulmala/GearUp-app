import {
  Box,
  TextField,
  Grid2,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import api from "./ApiConfig";
import { useEffect, useState } from "react";

const UserHandler = () => {

  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");


  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      console.log("Userlist fetched: ", response.data);
      setUserList(response.data);
      console.log("Userlist set to: ", userList);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/api/users/current");
      console.log("Current user fetched: ", response.data);
      setUser(response.data);
      console.log("User set to: ", user.username);
      setEditedUser({
        username: response.data.username,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error fetching current user", error);
    }
  };

  const isValidPassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,30}$/.test(password);

  const handleUserEdit = async (e) => {
    e.preventDefault();
    getCurrentUser();
    if (!user) {
      setError("No user selected to edit.");
      return;
    }
    if (editedUser.password && !isValidPassword(editedUser.password)) {
      setError(
        "Password must be 5-30 characters, include one number, and one uppercase letter."
      );
      return;
    }

    if (editedUser.password !== editedUser.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const updatedUser = {
        username: editedUser?.username || user.username,
        password: editedUser?.password || user.password,
      };

      await api.patch(`/api/users/${user.userId}`, updatedUser);
    } catch (error) {
      console.error("Error updating user", error);
      setError("Failed to update user.");
      return;
    }
  };


  return (
    <Box>
      <Typography variant="h2" gutterBottom></Typography>

      <Grid2 container spacing={2}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Username"
            type=""
            value={editedUser.username}
            onChange={(e) =>
              setEditedUser({ ...editedUser, username: e.target.value })
            }
          />
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={editedUser.password}
            onChange={(e) =>
              setEditedUser({ ...editedUser, password: e.target.value })
            }
            helperText="min. 5 Characters"
          />
        </Grid2>
        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Retype password"
            type="password"
            value={editedUser.confirmPassword}
            onChange={(e) =>
              setEditedUser({ ...editedUser, confirmPassword: e.target.value })
            }
          />
        </Grid2>
        <Button onClick={handleUserEdit}>Update profile</Button>
      </Grid2>
    </Box>
  );
};
export default UserHandler;
