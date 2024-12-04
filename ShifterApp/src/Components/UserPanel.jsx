import {
  Box,
  Tab
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from "react";
import UserHandler from "./UserHandler";
import AddUsers from "./AddUsers";

function UserPanel() {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList value={value} onChange={handleChange}>
            <Tab value="1" label="User Profile" />
            <Tab value="2" label="Add User" />
          </TabList>
        </Box>

        <Box>
          <TabPanel value="1">
            <UserHandler />
          </TabPanel>
          <TabPanel value="2">
            <AddUsers />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
export default UserPanel;
