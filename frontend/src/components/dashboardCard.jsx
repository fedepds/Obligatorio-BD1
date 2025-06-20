import React from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const DashboardCard = ({ icon, title, description, to }) => {
  const IconComponent = icon;

  return (

    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>

        <CardActionArea
          component={Link}
          to={to}
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          <CardContent sx={{ textAlign: "center" }}>
           
            <Box
              sx={{
                fontSize: 60,
                color: "primary.main", 
                mb: 2, 
              }}
            >
              <IconComponent fontSize="inherit" />
            </Box>
            
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default DashboardCard;
