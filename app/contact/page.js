import { Typography, Stack } from "@mui/material";
import PinDropSharpIcon from "@mui/icons-material/PinDropSharp";
import CallIcon from "@mui/icons-material/Call";

import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={{ xs: 4, md: 8, lg: 16 }}
    >
      <Stack spacing={2}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Send us a message
        </Typography>
        <ContactForm />
      </Stack>

      <Stack spacing={4} sx={{ justifyContent: "center", alignSelf: "center" }}>
        <Stack spacing={2} direction="row">
          <PinDropSharpIcon color="info" fontSize="large" />
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Find us at the office
            </Typography>
            <Typography variant="body1">
              Bld Basarabia, no. 37 <br />
              022103 Bucharest <br /> Romania
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} direction="row">
          <CallIcon color="info" fontSize="large" />
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Give us a ring
            </Typography>
            <Typography variant="body1">
              Elon Musk
              <br /> +40 723 456 789
              <br /> Mon - Fri, 7:00-15:00
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
