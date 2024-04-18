"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  CustomTextField,
  CustomCheckbox,
  CustomSelect,
  CustomFileUpload,
} from "@/utils/formsHelper";
import AlertMsg from "/components/AlertMsg";

const FILE_SIZE = 5000000; // 5 MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const initialValues = {
  title: "",
  description: "",
  image: "",
  date: "",
  type: "",
  isAgree: false,
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed()
    .required("Image is Required")
    .test(
      "fileSize",
      "File size is too large",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported file type",
      (value) =>
        value === null || (value && SUPPORTED_FORMATS.includes(value.type))
    ),
  date: Yup.date().required("Event date is required"),
  type: Yup.string().required("Event Type is required"),
  isAgree: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions"
  ),
});

const CreateEventForm = () => {
  const [alert, setAlert] = useState({ text: "", severity: "" });

  const onSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("image", values.image);
      formData.append("date", values.date);
      formData.append("type", values.type);

      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({ text: "Event created successfully", severity: "success" });
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: "Error creating event", severity: "error" });
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

          <Field
            name="type"
            component={CustomSelect}
            label="Type"
            options={[
              { value: "conference", label: "Conference" },
              { value: "seminar", label: "Seminar" },
              { value: "workshop", label: "Workshop" },
            ]}
            inputProps={{ MenuProps: { disableScrollLock: true } }}
          />

          <Field
            name="isAgree"
            type="checkbox"
            component={CustomCheckbox}
            label="I agree"
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
              loadingIndicator="Creating..."
              variant="contained"
              className="btn btn-primary"
              sx={{ marginTop: "12px", marginBottom: "20px" }}
            >
              Create event
            </LoadingButton>
            <AlertMsg alert={alert} />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CreateEventForm;
