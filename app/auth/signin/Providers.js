"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import styles from "/app/page.module.css";
import { Button, Typography, Stack, Divider } from "@mui/material";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { CustomTextField } from "@/utils/formsHelper";

import GoogleIcon from "@mui/icons-material/Google";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";

const initialValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const onSubmit = (email) => {
  signIn("email", email);
};

const Providers = ({ providers }) => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error)
    return (
      <>
        <Typography variant="h1" className={styles.title} color={"error"}>
          ERROR
        </Typography>
        <Typography align="center" sx={{ fontSize: "2rem" }}>
          {error}
        </Typography>
      </>
    );

  return (
    <Stack spacing={2}>
      {Object.values(providers).map((provider) => (
        <div key={provider.id} style={{ maxWidth: "250px" }}>
          {provider.id === "email" ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Divider>OR</Divider>
                  <Field
                    name="email"
                    component={CustomTextField}
                    label="Email"
                    type="email"
                  />

                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    loadingIndicator="Loading..."
                    variant="contained"
                    className="btn btn-primary"
                    sx={{
                      width: "100%",
                      justifyContent: "space-around",
                    }}
                  >
                    <EmailIcon fontSize="small" />
                    Sign in with {provider.name}
                  </LoadingButton>
                </Form>
              )}
            </Formik>
          ) : (
            <Button
              variant="contained"
              className="btn btn-primary"
              sx={{ width: "100%", justifyContent: "space-around" }}
              onClick={() => signIn(provider.id)}
            >
              {provider.id === "google" && <GoogleIcon fontSize="small" />}
              {/* {provider.id === "github" && <GitHubIcon fontSize="small" />}
              {provider.id === "discord" && <SmartToyIcon fontSize="small" />}
              {provider.id === "twitter" && <TwitterIcon fontSize="small" />} */}
              Sign in with {provider.name}
            </Button>
          )}
        </div>
      ))}
    </Stack>
  );
};

export default Providers;
