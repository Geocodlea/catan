"use client";

import { useState } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { CustomTextField, CustomFileUpload } from "@/utils/formsHelper";
import AlertMsg from "/components/AlertMsg";

const FILE_SIZE = 5000000; // 5 MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const initialValues = {
  title: "",
  description: "",
  image: "",
  date: "",
};

const validationSchema = Yup.object().shape({
  title: Yup.string("Title must be a text"),
  description: Yup.string("Description must be a text"),
  image: Yup.mixed()
    .test("fileFormat", "Unsupported file type", (value) => {
      if (!value) return true;
      return SUPPORTED_FORMATS.includes(value.type);
    })
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true;
      return value.size <= FILE_SIZE;
    }),
  date: Yup.date("Event date must be a date"),
});

const UpdateEvent = ({ params }) => {
  const [alert, setAlert] = useState({ text: "", severity: "" });

  const onSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", values.image);
      formData.append("date", values.date);
      formData.append("type", "catan");

      const response = await fetch(`/api/events/${params.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({ text: "Event updated successfully", severity: "success" });
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: "Error updating event", severity: "error" });
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
            name="title"
            component={CustomTextField}
            label="Title"
            type="text"
          />

          <Field
            name="description"
            component={CustomTextField}
            label="Description"
            type="text"
            multiline
          />

          <Field
            name="image"
            component={CustomFileUpload}
            label="Image"
            type="file"
            accept="image/*"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Field
            name="date"
            component={CustomTextField}
            label="Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              loadingIndicator="Updating..."
              variant="contained"
              className="btn btn-primary"
              sx={{ marginTop: "12px", marginBottom: "20px" }}
            >
              Update event
            </LoadingButton>
            <AlertMsg alert={alert} />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateEvent;
