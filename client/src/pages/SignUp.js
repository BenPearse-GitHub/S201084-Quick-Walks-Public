import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { signUp } from "../api/account.api";
import { Paper } from "@mui/material";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  async function signUpUser(newUserInfo) {
    const response = await signUp(newUserInfo);

    const data = await response.json();
    return data;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const newDetails = {
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };

    if (newDetails.username && newDetails.email && newDetails.password) {
      const passwordCheckResult = checkPassword(newDetails.password);
      if (passwordCheckResult.success) {
        const response = await signUpUser(newDetails);
        if (response.success) {
          alert("Sign-Up Successful");
          navigate("/signIn");
        } else {
          setError(response.message);
        }
      } else {
        setError(passwordCheckResult.message);
      }
    } else {
      setError("Please fill in all fields");
    }
  };

  // check password complexity
  const checkPassword = (password) => {
    const lowerCaseRegex = /^(?=.*[a-z])/;
    const upperCaseRegex = /^(?=.*[A-Z])/;
    const numberRegex = /^(?=.*[0-9])/;
    const lengthRegex = /^(?=.{9,})/;

    if (!lowerCaseRegex.test(password)) {
      return {
        success: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!upperCaseRegex.test(password)) {
      return {
        success: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!numberRegex.test(password)) {
      return {
        success: false,
        message: "Password must contain at least one number",
      };
    }
    if (!lengthRegex.test(password)) {
      return {
        success: false,
        message: "Password must be at least 9 characters long",
      };
    }
    return {
      success: true,
      message: "Password is valid",
    };
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenErrorSnackbar(false);
    setError(null);
  };

  useEffect(() => {
    if (error) {
      setOpenErrorSnackbar(true);
    }
  }, [error]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                inputProps={{ maxLength: 320 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                inputProps={{
                  minLength: 9,
                  pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{9,})/",
                }}
              />
            </Grid>
          </Grid>
          <Paper
            variant="outlined"
            sx={{ mt: 1, p: 1, backgroundColor: "#E6F4F0" }}
          >
            <Typography variant="body1">Password Requirements</Typography>
            <Typography variant="body2" component="div">
              <ul
                style={{
                  marginTop: "2px",
                  marginBottom: "0",
                  paddingLeft: "20px",
                }}
              >
                <li>At least 9 characters</li>
                <li>At least one lowercase letter</li>
                <li>At least one uppercase letter</li>
                <li>At least one number</li>
              </ul>
            </Typography>
          </Paper>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link
                onClick={() => {
                  navigate("/signIn");
                }}
                variant="body2"
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
        sx={{ mb: 8 }}
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
