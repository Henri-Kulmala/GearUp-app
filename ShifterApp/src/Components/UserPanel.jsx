import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "./ApiConfig";
import {
  Box,
  Tab,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

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
    lastName: ""
  });

  useEffect(() => {
    // Wait until we're initialized (session known) and authenticated
    if (initialized && auth) {
      const fetchCurrentUser = async () => {
        try {
          const response = await api.get("/api/users/current");
          console.log(" Current user:", response.data);
          setCurrentUser({
            username: response.data.username || "",
            role: response.data.role || "",
            firstName: response.data.employee?.firstName || "",
            lastName: response.data.employee?.lastName || ""
            
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
    <Box spacing={2}>
      {currentUser ? (
      <Box>
        <List>
          <Typography variant="h3" fontWeight={600} sx={{color:"#141414"}}>
            Profile
          </Typography>

          <ListItem>
            <ListItemText variant="h3" 
              primary={`Username: ${currentUser.username}`}
              secondary={`Role: ${currentUser.role}`}
            sx={{color:"#141414"}}/>
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`${currentUser.firstName} ${currentUser.lastName}`}
              sx={{color:"#141414"}} />
          </ListItem>
        </List>
      </Box>
      ) : (
        <Typography variant="h3" fontWeight={600}>
          Please wait while we fetch your profile...
        </Typography>
      )}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList value={value} onChange={handleChange}>
            <Tab value="1" label="User Profile" />
            <Tab value="2" label="User Form" />
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
  );
}

export default UserPanel;
