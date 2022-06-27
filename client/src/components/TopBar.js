import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";
import QuickWalksLogo from "../images/logo.png";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
        <Toolbar>
          {location.pathname !== "/" ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
          ) : (
            <Box sx={{ width: 50, minWidth: 50, maxWidth: 50 }}></Box>
          )}

          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Stack
              direction="row"
              spacing={0}
              alignItems="center"
              justifyContent="center"
            >
              <img src={QuickWalksLogo} alt="logo" style={{ height: "45px" }} />
            </Stack>
          </Box>

          {sessionStorage.getItem("token") ? (
            <Button
              color="inherit"
              onClick={() => {
                sessionStorage.removeItem("token");
                navigate("/");
              }}
            >
              Sign Out
            </Button>
          ) : location.pathname !== "/signIn" &&
            location.pathname !== "/signUp" ? (
            <Button color="inherit" onClick={() => navigate("/signIn")}>
              Sign In
            </Button>
          ) : (
            <Box sx={{ width: 70, minWidth: 70, maxWidth: 70 }}></Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
};

export default TopBar;
