// use someJSON.filter() to filter the JSON data
import { React, useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import FilterableRouteCardList from "../components/FilterableRouteCardList";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllBookmarks } from "../api/user.api";
import { getRouteById } from "../api/route.api";
import jwtDecode from "jwt-decode";

const BookmarkedRoutes = () => {
  const [bookmarks, setBookmarks] = useState(null);
  const [bookmarkedRoutes, setBookmarkedRoutes] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  // function to fetch user's bookmarks from database
  const fetchBookmarks = async () => {
    const response = await getAllBookmarks(token);

    const data = await response.json();
    // if request successful
    if (data.success) {
      // set bookmark results
      setBookmarks(data.bookmarks);
    } else {
      alert("Error", data.error);
    }
  };

  // fetch route associated with each bookmark in bookmarks array
  const fetchBookmarkedRoutes = async () => {
    // empty route array
    const bookmarkedRoutes = [];
    // loop through bookmarks array
    for (let i = 0; i < bookmarks.length; i++) {
      // get route id from bookmark
      const routeId = bookmarks[i].routeId;
      // fetch route from database
      const response = await getRouteById(routeId);

      const data = await response.json();
      // if request successful
      if (data.success) {
        // add route to bookmarked routes array
        bookmarkedRoutes.push(data.route);
      } else {
        alert("Error", data.error);
      }
    }
    // set bookmarked routes array
    setBookmarkedRoutes(bookmarkedRoutes);
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setToken(sessionStorage.getItem("token"));
    } else {
      alert("Please sign in to view bookmarked routes");
      navigate("/signIn");
    }
  }, []);

  // useEffect to start route fetch
  useEffect(() => {
    if (token) {
      fetchBookmarks();
    }
  }, [token]);

  useEffect(() => {
    if (bookmarks) {
      fetchBookmarkedRoutes();
    }
  }, [bookmarks]);

  return (
    <Box sx={{ display: "flex", flexFlow: "column", height: "100%" }}>
      <Container
        maxWidth="md"
        sx={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <Typography textAlign="center" variant="h5">
          Your bookmarks
        </Typography>
      </Container>
      <Container
        maxWidth="md"
        sx={{
          flex: "auto",
          overflowY: "auto",
        }}
      >
        <FilterableRouteCardList routes={bookmarkedRoutes} />
      </Container>
    </Box>
  );
};

export default BookmarkedRoutes;
