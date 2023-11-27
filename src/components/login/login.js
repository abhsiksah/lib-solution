import {
  Box,
  Button,
  Unstable_Grid2 as Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { authUser } from "../../domain/AppSlice";
import wallpaper from "./backround.jpg";
import book from "./book.jpg";

async function fetchData(dataToSend) {
  const url = "http://localhost:3000/login";

  try {
    let repsonse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    return await repsonse.json();
  } catch (error) {
    alert("we are facing some problem.... please retry after some time :)");
  }
}

async function fetchUserDetails(dataToSend) {
  const url = "http://localhost:3000/user-data";

  try {
    let repsonse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    return await repsonse.json();
  } catch (error) {
    alert("we are facing some problem in getting user details");
  }
}

async function SignupTrigger(dataToSend) {
  const url = "http://localhost:3000/signup";

  try {
    let repsonse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    return await repsonse.json();
  } catch (error) {
    alert("we are facing some problem.... please retry after some time :)");
  }
}

const Login = () => {
  const [method, setMethod] = React.useState("login");

  const handleMethodChange = React.useCallback((event, value) => {
    setMethod(value);
  }, []);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      // email: Yup.string()
      //   .email("Must be a valid email")
      //   .max(255)
      //   .required("Email is required"),
      // password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values) => {
      const dataToSend = {
        username: values.email,
        password: values.password,
      };

      const validateUser = await fetchData(dataToSend);

      if (validateUser.message === "Authentication failed") {
        alert("user does not exist");
      } else {
        const userDetails = await fetchUserDetails({
          username: dataToSend.username,
        });

        dispatch(authUser({ dataToSend, userDetails }));
      }
    },
  });

  const signupformik = useFormik({
    initialValues: {
      email: "",
      password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      // email: Yup.string()
      //   .email("Must be a valid email")
      //   .max(255)
      //   .required("Email is required"),
      // password: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: async (values) => {
      const dataToSend = {
        username: values.email,
        password: values.password,
      };

      const validateUser = await SignupTrigger(dataToSend);

      if (validateUser.message !== "User created successfully") {
        alert("user already exist");
      } else {
        setMethod("login");
        alert("User Added !!");
      }
    },
  });

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
        }}
      >
        <Grid container sx={{ flex: "1 1 auto" }}>
          <Grid
            xs={12}
            lg={6}
            sx={{
              backgroundColor: "background.paper",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <img
              src={book}
              alt=""
              style={{
                height: "100px",
                width: "120px",
                position: "absolute",
                left: "42%",
                top: "30px",
              }}
            />
            <Box
              sx={{
                backgroundColor: "background.paper",
                alignItems: "center",
                display: "flex",
                height: "100vh",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "500px",
                  px: 10,
                  py: "100px",
                }}
              >
                <Tabs
                  style={{
                    marginBottom: "30px",
                    position: "relative",
                    left: "30%",
                  }}
                  onChange={handleMethodChange}
                  fullWidth
                  value={method}
                >
                  <Tab
                    sx={{ fontSize: "20px", fontFamily: "fantasy" }}
                    label="Login"
                    value="login"
                  />
                  <Tab
                    sx={{ fontSize: "20px", fontFamily: "fantasy" }}
                    label="Sign Up"
                    value="signup"
                  />
                </Tabs>

                {method === "login" ? (
                  <div>
                    <Stack spacing={1} sx={{ mb: 10 }}>
                      <Typography
                        variant="h4"
                        style={{ fontFamily: "fantasy" }}
                      >
                        Login
                      </Typography>
                    </Stack>

                    <form noValidate onSubmit={formik.handleSubmit}>
                      <Stack spacing={3}>
                        <TextField
                          error={
                            !!(formik.touched.email && formik.errors.email)
                          }
                          fullWidth
                          helperText={
                            formik.touched.email && formik.errors.email
                          }
                          label="Email Address"
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="email"
                          value={formik.values.email}
                        />
                        <TextField
                          error={
                            !!(
                              formik.touched.password && formik.errors.password
                            )
                          }
                          fullWidth
                          helperText={
                            formik.touched.password && formik.errors.password
                          }
                          label="Password"
                          name="password"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="password"
                          value={formik.values.password}
                        />
                      </Stack>

                      {formik.errors.submit && (
                        <Typography
                          color="error"
                          sx={{ mt: 3 }}
                          variant="body2"
                        >
                          {formik.errors.submit}
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        size="large"
                        sx={{
                          mt: 3,
                          border: "2px solid black",
                          color: "black",
                        }}
                        type="submit"
                        variant="outlined"
                      >
                        Login In
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <Stack spacing={1} sx={{ mb: 10 }}>
                      <Typography
                        variant="h4"
                        style={{ fontFamily: "fantasy" }}
                      >
                        Sign Up
                      </Typography>
                    </Stack>

                    <form noValidate onSubmit={signupformik.handleSubmit}>
                      <Stack spacing={3}>
                        <TextField
                          error={
                            !!(
                              signupformik.touched.email &&
                              signupformik.errors.email
                            )
                          }
                          fullWidth
                          helperText={
                            signupformik.touched.email &&
                            signupformik.errors.email
                          }
                          label="Email Address"
                          name="email"
                          onBlur={signupformik.handleBlur}
                          onChange={signupformik.handleChange}
                          type="email"
                          value={signupformik.values.email}
                        />
                        <TextField
                          error={
                            !!(
                              signupformik.touched.password &&
                              signupformik.errors.password
                            )
                          }
                          fullWidth
                          helperText={
                            signupformik.touched.password &&
                            signupformik.errors.password
                          }
                          label="Password"
                          name="password"
                          onBlur={signupformik.handleBlur}
                          onChange={signupformik.handleChange}
                          type="password"
                          value={signupformik.values.password}
                        />
                      </Stack>

                      {signupformik.errors.submit && (
                        <Typography
                          color="error"
                          sx={{ mt: 3 }}
                          variant="body2"
                        >
                          {signupformik.errors.submit}
                        </Typography>
                      )}
                      <Button
                        fullWidth
                        size="large"
                        sx={{
                          mt: 3,
                          border: "2px solid black",
                          color: "black",
                        }}
                        type="submit"
                        variant="outlined"
                      >
                        Sign-Up
                      </Button>
                    </form>
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid
            xs={12}
            lg={6}
            sx={{
              alignItems: "center",
              backgroundImage: `url(${wallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              display: "flex",
              justifyContent: "center",
              "& img": {
                maxWidth: "100%",
              },
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="inherit"
                sx={{
                  fontFamily: "cursive",
                }}
                variant="h1"
              >
                <Box
                  component="a"
                  sx={{ color: "white", fontSize: "45px" }}
                  target="_blank"
                >
                  Welcome to{" "}
                </Box>

                <Box
                  component="a"
                  sx={{ color: "white", fontSize: "45px" }}
                  target="_blank"
                >
                  Texas University Library
                </Box>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Login;
