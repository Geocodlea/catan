import { Box, Stack, Typography } from "@mui/material";

const Privacy = () => {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Privacy Policy
      </Typography>

      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" gutterBottom>
            1. Introduction
          </Typography>
          <Typography variant="body1" gutterBottom>
            Welcome to AGames. This Privacy Policy is designed to inform you
            about the types of information we collect, how we use and protect
            that information, and your choices regarding the collection and use
            of your data.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            2. Information We Collect
          </Typography>
          <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>
              a) Personal Information:
            </Typography>
            <Typography variant="body1" gutterBottom>
              We may collect personal information such as your name, email
              address, and other contact details when you voluntarily provide
              them through forms on our Website.
            </Typography>

            <Typography variant="h4" gutterBottom>
              b) Automatically Collected Information:
            </Typography>
            <Typography variant="body1" gutterBottom>
              We may automatically collect certain information about your visit,
              including your IP address, browser type, and device information.
            </Typography>
          </Stack>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            3. Use of Information
          </Typography>
          <Typography variant="body1" as="div" gutterBottom>
            We use the collected information for the following purposes:
            <ul>
              <li>To provide and maintain our services.</li>
              <li>To improve, personalize, and expand our services.</li>
              <li>
                To communicate with you, respond to your inquiries, and send you
                updates.
              </li>
            </ul>
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            4. Data Sharing
          </Typography>
          <Typography variant="body1" as="div" gutterBottom>
            We may share your information with third parties under the following
            circumstances:
            <ul>
              <li>With your consent.</li>
              <li>To comply with legal obligations.</li>
              <li>To protect our rights, privacy, safety, or property.</li>
              <li>
                In connection with a business transaction, such as a merger,
                acquisition, or sale of assets.
              </li>
            </ul>
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            5. Cookies and Similar Technologies
          </Typography>
          <Typography variant="body1" gutterBottom>
            We use cookies and similar technologies to enhance your experience
            on our Website. You can manage your cookie preferences through your
            browser settings.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            6. Security
          </Typography>
          <Typography variant="body1" gutterBottom>
            We take reasonable measures to protect your personal information
            from unauthorized access or disclosure.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            7. Your Rights
          </Typography>
          <Typography variant="body1" as="div" gutterBottom>
            You have the right to:
            <ul>
              <li>Access, correct, or delete your personal information.</li>
              <li>Object to the processing of your personal data.</li>
              <li>Withdraw your consent.</li>
            </ul>
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            8. Changes to this Privacy Policy
          </Typography>
          <Typography variant="body1" gutterBottom>
            We reserve the right to update our Privacy Policy. Any changes will
            be effective upon posting the revised policy on our Website.
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" gutterBottom>
            9. Contact Us
          </Typography>
          <Typography variant="body1" gutterBottom>
            If you have any questions or concerns about this Privacy Policy,
            please contact us using the contact form.
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom align="right">
          Effective Date: 10.11.2024
        </Typography>
      </Stack>
    </>
  );
};

export default Privacy;
