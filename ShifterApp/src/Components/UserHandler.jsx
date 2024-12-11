import {
  Box,
  TextField,
  Grid2,
  Button,
  Alert,
  Avatar,
  CircularProgress,
} from "@mui/material";
import api from "./ApiConfig";
import { useEffect, useState } from "react";

const UserHandler = () => {
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/api/users/current");
      setUser(response.data);
      setEditedUser({
        username: response.data.username,
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error fetching current user", error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const uploadProfilePicture = async () => {
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append("file", profilePicture);

    try {
      setUploading(true);
      await api.post(`/api/users/${user.userId}/profile-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploading(false);

      await getCurrentUser();
    } catch (error) {
      setUploading(false);
      console.error("Error uploading profile picture", error);
      setError("Failed to upload profile picture.");
    }
  };

  const handleUserEdit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("No user selected to edit.");
      return;
    }
    if (
      editedUser.password &&
      editedUser.password !== editedUser.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        username: editedUser.username,
        password: editedUser.password || undefined,
      };

      await api.patch(`/api/users/${user.userId}`, payload);
      getCurrentUser();
    } catch (error) {
      console.error("Error updating user", error);
      setError("Failed to update user.");
    }
  };

  return (
    <Box>


      <Grid2 container spacing={2} mt={10}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Grid2 item xs={12} textAlign="center">
          <Avatar
            alt={user.username}
            src={user.profilePicture || "/default-profile.png"}
            sx={{ width: 150, height: 150, margin: "0 auto" }}
            key={user.profilePicture}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={uploadProfilePicture} disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : "Upload Picture"}
          </Button>
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            fullWidth
            label="Username"
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

        <Button onClick={handleUserEdit}>Update Profile</Button>
      </Grid2>
    </Box>
  );
};

export default UserHandler;
