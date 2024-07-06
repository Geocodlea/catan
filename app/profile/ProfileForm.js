"use client";

import { useState } from "react";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { CustomTextField, CustomFileUpload } from "@/utils/formsHelper";
import AlertMsg from "/components/AlertMsg";

import { useSession } from "next-auth/react";

const FILE_SIZE = 5000000; // 5 MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const initialValues = {
  name: "",
  tel: "",
  image: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string("Name must be a text"),
  tel: Yup.string("Must be a valid telephone number"),
  image: Yup.mixed()
    .test("fileFormat", "Unsupported file type", (value) => {
      if (!value) return true;
      return SUPPORTED_FORMATS.includes(value.type);
    })
    .test("fileSize", "File size is too large", (value) => {
      if (!value) return true;
      return value.size <= FILE_SIZE;
    }),
});

const ProfileForm = () => {
  const [alert, setAlert] = useState({ text: "", severity: "" });

  const { data: session, update } = useSession();

  const onSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append("name", values.name);
      formData.append("tel", values.tel);
      formData.append("image", values.image);

      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({ text: "Account updated successfully", severity: "success" });
      update();
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: "Error updating account", severity: "error" });
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
            placeholder={session?.user.name}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Field
            name="tel"
            component={CustomTextField}
            label="Telephone"
            type="text"
            placeholder={session?.user.tel}
            InputLabelProps={{
              shrink: true,
            }}
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

          <Box
            style={{
              display: "flex",
              justifyContent: "center",
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
              Update Account
            </LoadingButton>
            <AlertMsg alert={alert} />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
