import { Box,Typography } from "@mui/material";


function HomePage() {


    return (

        <Box>
            <Typography variant="h1" fontWeight={500} color="#1d232b">
                Welcome to Shifter!

            </Typography>
            <Typography variant="h3" fontWeight={300} color="#394454">
                Here you can manage your business schedule. Click on ShiftPlanner to get started. 

            </Typography>

        </Box>


    );
}

export default HomePage;