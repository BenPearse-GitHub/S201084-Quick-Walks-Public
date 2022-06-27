import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import "./styles/App.css";
import RouteSearch from "./pages/RouteSearch";
import RouteDetails from "./pages/RouteDetails";
import RouteNavigation from "./pages/RouteNavigation";
import RouteUpload from "./pages/RouteUpload";
import BookmarkedRoutes from "./pages/BookmarkedRoutes";
import RouteComplete from "./pages/RouteComplete";
import NavBar from "./components/NavBar";
import TopBar from "./components/TopBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";
import customTheme from "./styles/theme";
import RoutePreview from "./pages/RoutePreview";
import AllRouteReviews from "./pages/AllRouteReviews";
import RouteSearchConfig from "./pages/RouteSearchConfig";

const App = () => {
  return (
    <ThemeProvider theme={customTheme}>
      <BrowserRouter basename="/QuickWalks">
        <Box sx={{ display: "flex", flexFlow: "column", height: "100%" }}>
          <TopBar></TopBar>
          <Box id="page-content" sx={{ flex: "auto", overflowY: "auto" }}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="signIn" element={<SignIn />} />
              <Route path="signUp" element={<SignUp />} />
              <Route path="routes" element={<Outlet />}>
                <Route index element={<RouteSearch />} />
                <Route path="configure" element={<RouteSearchConfig />} />
                <Route path=":id" element={<Outlet />}>
                  <Route index element={<RouteDetails />} />
                  <Route path="preview" element={<RoutePreview />} />
                  <Route path="reviews" element={<AllRouteReviews />} />
                  <Route path="navigation" element={<RouteNavigation />} />
                  <Route path="complete" element={<RouteComplete />} />
                </Route>
              </Route>
              <Route path="upload" element={<RouteUpload />} />
              <Route path="bookmarks" element={<BookmarkedRoutes />} />
            </Routes>
          </Box>
          <Toolbar />
          <NavBar></NavBar>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
