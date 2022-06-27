import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
// import RoomIcon from "@mui/icons-material/Room";
import UploadIcon from "@mui/icons-material/Upload";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState("");

  useEffect(() => {
    // Check to see if pathname resolves to one of the menu paths
    if (location.pathname === "/") {
      setValue("/");
    } else if (location.pathname.includes("/routes")) {
      setValue("/routes");
    } else if (location.pathname.includes("/bookmarks")) {
      setValue("/bookmarks");
    } else if (location.pathname.includes("/upload")) {
      setValue("/upload");
    } else {
      setValue(location.pathname);
    }
  }, [location.pathname]);

  return (
    <Container>
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(newValue);
          }}
        >
          <BottomNavigationAction value="/" label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction
            value="/routes"
            label="Routes"
            icon={<SearchIcon />}
          />
          <BottomNavigationAction
            value="/bookmarks"
            label="Bookmarks"
            icon={<BookmarksIcon />}
          />
          <BottomNavigationAction
            value="/upload"
            label="Upload"
            icon={<UploadIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Container>
  );
};

export default Navigation;
