"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { CustomTextField } from "@/utils/formsHelper";
import AlertMsg from "/components/AlertMsg";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  message: Yup.string().required("Message is required"),
});

const ContactForm = () => {
  const [alert, setAlert] = useState({ text: "", severity: "" });

  const onSubmit = async (values) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({ text: "Message sent successfully", severity: "success" });
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: "Error sending message", severity: "error" });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            name="name"
            component={CustomTextField}
            label="Name"
            type="text"
          />

          <Field
            name="email"
            component={CustomTextField}
            label="Email"
            type="email"
          />

          <Field
            name="phone"
            component={CustomTextField}
            label="Phone"
            type="tel"
          />

          <Field
            name="message"
            component={CustomTextField}
            label="Message"
            type="text"
            multiline
          />

          <Box
            style={{
              textAlign: "center",
            }}
          >
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingIndicator="Sending..."
              variant="contained"
              className="btn btn-primary"
              sx={{ marginTop: "12px", marginBottom: "20px" }}
            >
              Send Message
            </LoadingButton>
            <AlertMsg alert={alert} />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ContactForm;
