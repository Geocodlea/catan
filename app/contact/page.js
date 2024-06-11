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
              Find us at
            </Typography>
            <Typography variant="body1">
              Creative Board Gaming <br />
              Str Mendeleev, nr 29, Sector 1 <br />
              București,{" "}
              <a href="http://www.cbgshop.ro/info/locatie/" target="_blank">
                @1UP Gamers Pub
              </a>
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} direction="row">
          <CallIcon color="info" fontSize="large" />
          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Contact
            </Typography>
            <Typography variant="body1">
              Tel: <a href="tel:0736465213">0736465213</a>
              <br />
              Email: <a href="mailto:contact@cbgshop.ro">contact@cbgshop.ro</a>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
