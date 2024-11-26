import { Box, Typography, Button, TextField } from "@mui/material";







function UserPanel() {
    return (
        <Box>
            <Typography variant="h3" pb={5}>
              Hello, *username* 
            </Typography>
            <Box component="form" display="flex" flexDirection="column">
                <TextField
                    label="First Name"
                    type="text"
                    name="FirstName"
                    disabled
                />
                <TextField
                    label="Last Name"
                    type="text"
                    name="LastName"
                    disabled
                />
                <TextField
                    label="Password"
                    type="password"
                    name="Password"
                    disabled
                />
                <Button variant="contained" color="primary" type="submit">
                    Update Profile
                </Button>
            </Box>

        </Box>

    )
}
export default UserPanel;