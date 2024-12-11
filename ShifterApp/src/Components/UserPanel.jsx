import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "./ApiConfig";
import {
  Box,
  Tab,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import UserHandler from "./UserHandler";
import UserForm from "./UserForm";

function UserPanel() {
  const [value, setValue] = useState("1");
  const { auth, initialized } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [currentUser, setCurrentUser] = useState({
    username: "",
    role: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (initialized && auth) {
      const fetchCurrentUser = async () => {
        try {
          const response = await api.get("/api/users/current");
          console.log(" Current user:", response.data);
          setCurrentUser({
            username: response.data.username || "",
            role: response.data.role || "",
            firstName: response.data.employee?.firstName || "",
            lastName: response.data.employee?.lastName || "",
          });
        } catch (err) {
          console.error("Error fetching current user:", err);
        }
      };
      fetchCurrentUser();
    }
  }, [initialized, auth]);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <div>Please log in</div>;
  }

  return (
    <Box
      spacing={2}
      sx={{
        display: "flex",
        gap: 5,
        width: "100%",
        padding: 20,
        backgroundColor: "#f5f5f5",
      }}
    >
      {currentUser ? (
        <Box textAlign="center" justifyContent="center">
          <List>
            <Typography variant="h3" fontWeight={600} sx={{textAlign:"left", color: "#141414" }}>
              Profiili
            </Typography>

            <ListItem>
              <ListItemText
                variant="h1"
                primary={`Käyttäjänimi: ${currentUser.username}`}
                secondary={`Rooli: ${currentUser.role}`}
                sx={{ color: "#141414"}}
              />
            </ListItem>
            <ListItem>
              <ListItemText

                primary={`${currentUser.firstName} ${currentUser.lastName}`}
                sx={{ color: "#141414" }}
              />
            </ListItem>
          </List>
        </Box>
      ) : (
        <Typography variant="h2" fontWeight={600}>
          Käyttäjätietoja ladataan...
        </Typography>
      )}
      <Box display="flex" flexDirection="column">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList value={value} onChange={handleChange}>
              <Tab value="1" label="Käyttäjätiedot" />
              <Tab value="2" label="Käyttäjähallinta" />
            </TabList>
          </Box>

          <Box>
            <TabPanel value="1">
              <UserHandler />
            </TabPanel>
            <TabPanel value="2">
              <UserForm />
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
    </Box>
  );
}

export default UserPanel;
