import { React, useEffect, useState } from "react";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Button } from "@mui/material";
import {
  checkBookmarkExists,
  addBookmark,
  removeBookmark,
} from "../api/user.api";

const BookmarkButton = (props) => {
  const routeId = props.routeId;
  const buttonStyle = props.buttonStyle;
  const [token, setToken] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkSuccessOpen, setBookmarkSuccessOpen] = useState(false);
  const [bookmarkSuccessText, setBookmarkSuccessText] = useState("");

  const getToken = () => {
    if (sessionStorage.getItem("token")) {
      setToken(sessionStorage.getItem("token"));
    }
  };

  const checkIfBookmarkExists = async () => {
    const response = await checkBookmarkExists({
      token: token,
      routeId: routeId,
    });
    const data = await response.json();

    if (data.success && data.bookmark) {
      setBookmarked(true);
    } else if (data.error) {
      console.error("Error", data.error);
    }
  };

  const bookmarkRoute = async () => {
    const response = await addBookmark({
      token: token,
      routeId: routeId,
    });

    const data = await response.json();

    if (data.success) {
      setBookmarked(true);
      setBookmarkSuccessOpen(true);
      setBookmarkSuccessText("Bookmark added");
    } else {
      alert("Error", data.error);
    }
  };

  const removeUserBookmark = async () => {
    const response = await removeBookmark({
      token: token,
      routeId: routeId,
    });

    const data = await response.json();

    if (data.success) {
      setBookmarked(false);
      setBookmarkSuccessOpen(true);
      setBookmarkSuccessText("Bookmark removed");
    } else {
      alert("Error", data.error);
    }
  };

  const handleBookmarkSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setBookmarkSuccessOpen(false);
    setBookmarkSuccessText("");
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token && routeId) {
      checkIfBookmarkExists();
    }
  }, [token, routeId]);

  if (buttonStyle === "iconButton") {
    return (
      <>
        {bookmarked ? (
          <>
            <IconButton
              color="primary"
              aria-label="remove bookmark"
              size="large"
              disabled={!token || !routeId}
              onClick={() => {
                if (token) {
                  removeUserBookmark();
                }
              }}
            >
              <BookmarkRemoveIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body2">Bookmarked</Typography>
          </>
        ) : (
          <>
            <IconButton
              color="primary"
              aria-label="bookmark"
              size="large"
              disabled={!token || bookmarked || !routeId}
              onClick={() => {
                if (token && !bookmarked) {
                  bookmarkRoute();
                } else {
                  alert("Please login to bookmark routeId");
                }
              }}
            >
              <BookmarkAddIcon fontSize="inherit" />
            </IconButton>
            <Typography variant="body2">Bookmark</Typography>
          </>
        )}
        <Snackbar
          open={bookmarkSuccessOpen}
          autoHideDuration={4000}
          onClose={handleBookmarkSuccessClose}
          sx={{ mb: 8 }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleBookmarkSuccessClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {bookmarkSuccessText} successfully!
          </MuiAlert>
        </Snackbar>
      </>
    );
  } else if (buttonStyle === "standardButton") {
    return (
      <>
        {bookmarked ? (
          <>
            <Button
              variant="contained"
              aria-label="remove bookmark"
              disabled={!token || !routeId}
              onClick={() => {
                if (token) {
                  removeUserBookmark();
                }
              }}
            >
              Route Bookmarked
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              aria-label="bookmark"
              disabled={!token || bookmarked || !routeId}
              onClick={() => {
                if (token && !bookmarked) {
                  bookmarkRoute();
                } else {
                  alert("Please login to bookmark routeId");
                }
              }}
            >
              Bookmark Route
            </Button>
          </>
        )}
      </>
    );
  }
};

export default BookmarkButton;
