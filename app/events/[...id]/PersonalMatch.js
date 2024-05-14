import { useState, useEffect } from "react";
import EditableDataGrid from "@/components/EditableDataGrid";
import { Box, Typography } from "@mui/material";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import LoadingButton from "@mui/lab/LoadingButton";

import { CustomFileUpload } from "@/utils/formsHelper";
import AlertMsg from "/components/AlertMsg";

const FILE_SIZE = 5000000; // 5 MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const initialValues = {
  image: "",
};

const validationSchema = Yup.object().shape({
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
});

export default function PersonalMatch({
  type,
  round,
  userID,
  playerName,
  eventID,
}) {
  const [participants, setParticipants] = useState([]);
  const [alert, setAlert] = useState({ text: "", severity: "" });

  useEffect(() => {
    const getPersonalMatch = async () => {
      const data = await fetch(
        `/api/events/personalMatch/${type}/${round}/${userID}`
      );
      setParticipants(await data.json());
    };

    getPersonalMatch();
  }, [round]);

  const columnsData = [
    {
      field: "id",
      headerName: "id",
    },
    {
      field: "table",
      headerName: "Masa",
    },
    {
      field: "nr",
      headerName: "Nr.",
      width: 50,
    },
    {
      field: "name",
      headerName: "Nume",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "score",
      headerName: "Scor",
      editable: true,
      width: 80,
    },
  ];

  const onSubmit = async (values) => {
    try {
      let formData = new FormData();

      formData.append("image", values.image);

      const response = await fetch(
        `/api/events/personalMatch/${type}/${round}/${userID}/${eventID}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        // Check for non-successful HTTP status codes
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setAlert({ text: "Image uploaded successfully", severity: "success" });
    } catch (error) {
      // Handle any errors that occurred during the fetch operation
      setAlert({ text: "Error uploading image", severity: "error" });
    }
  };

  return (
    <Box sx={{ margin: "auto", maxWidth: "800px" }}>
      {participants.length ? (
        <>
          <Typography variant="h3" gutterBottom>
            Masa {participants[0]?.table}
          </Typography>
          <EditableDataGrid
            columnsData={columnsData}
            rowsData={participants}
            pageSize={10}
            apiURL={"/events/personalMatch"}
            eventType={type}
            round={round}
            playerName={playerName}
            alertText={"participant"}
            disableColumnMenu={true}
            hideSearch={true}
            hideFooter={true}
            hiddenColumn={"table"}
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ margin: "1rem 0" }}>
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
                    loadingIndicator="Uploading..."
                    variant="contained"
                    className="btn btn-primary"
                    sx={{ marginTop: "12px", marginBottom: "20px" }}
                  >
                    Upload image
                  </LoadingButton>
                  <AlertMsg alert={alert} />
                </Box>
              </Form>
            )}
          </Formik>
          <p style={{ textAlign: "justify" }}>
            Rugăm primul jucător afișat la această masă să introducă mai sus, la
            finalul meciului, rezultatele tuturor de la masa sa și să încarce o
            poză cu masa de joc, de unde să reiasă punctajele. Ceilalți, vă
            rugăm să verificați în secțiunea Meciuri și Clasament corectitudinea
            informațiilor afișate. Secțiunile Meciuri și Clasament se
            actualizează automat la fiecare 30 sec.
          </p>
        </>
      ) : (
        <p>
          Salutare, în prezent este deja activ un eveniment. Îi poți urmări
          desfășurarea la celelalte secțiuni ale acestui meniu :) Înscrierile
          pentru următorul eveniment vor fi disponibile în maxim 2 zile.
        </p>
      )}
    </Box>
  );
}
