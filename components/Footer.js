import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

const Footer = () => {
  return (
    <Box
      sx={{
        background: "var(--main-gradient)",
      }}
    >
      <Typography textAlign="center" color="white" p={2}>
        &copy; Created by George Anton
        <br />
        <NextLink href="/privacy">Privacy Policy</NextLink> |{" "}
        <NextLink href="/terms">Terms of Service</NextLink>
      </Typography>
    </Box>
  );
};

export default Footer;
