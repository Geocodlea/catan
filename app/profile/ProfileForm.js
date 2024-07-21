"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Box, Stack, Skeleton, Avatar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { CustomTextField, CustomSwitch } from "@/utils/formsHelper";
import AlertMsg from "/components/AlertMsg";
import { useSession } from "next-auth/react";
import AvatarSelection from "./AvatarSelection";

const initialValues = {
  name: "",
  tel: "",
  image: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string("Name must be a text"),
  tel: Yup.string("Must be a valid telephone number"),
  image: Yup.string(),
  subscribed: Yup.boolean(),
});

const ProfileForm = () => {
  const [alert, setAlert] = useState({ text: "", severity: "" });
  const { data: session, status, update } = useSession();
  const [initialValues, setInitialValues] = useState({
    name: "",
    tel: "",
    image: "",
    subscribed: false,
  });

  useEffect(() => {
    setInitialValues({
      name: "",
      tel: "",
      image: "",
      subscribed: !session?.user.unsubscribed || false,
    });
  }, [session]);

  const onSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append("name", values.name);
      formData.append("tel", values.tel);
      formData.append("image", values.image);
      formData.append("unsubscribed", !values.subscribed);

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

  if (status === "loading") {
    return (
      <Stack spacing={3} sx={{ mt: 2 }}>
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" width={147} height={36} />
        <Skeleton variant="rounded" width={250} height={30} />
        <Skeleton
          variant="rounded"
          width={160}
          height={36}
          sx={{ alignSelf: "center" }}
        />
      </Stack>
    );
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, setFieldValue }) => (
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

          <Box display="flex" alignItems="center" mt={2} mb={2}>
            <AvatarSelection
              onSelect={(avatar) => setFieldValue("image", avatar)}
            />
            {values.image && (
              <Avatar src={values.image} alt="Selected Avatar" sx={{ ml: 4 }} />
            )}
          </Box>

          <Field
            name="subscribed"
            component={CustomSwitch}
            type="checkbox"
            label={
              values.subscribed
                ? "I want to receive emails"
                : "I don't want to receive emails"
            }
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
