import styles from "../page.module.css";

import { Box, Stack } from "@mui/material";

const Privacy = () => {
  return (
    <>
      <h1 className={styles.title}>Privacy Policy</h1>

      <Stack spacing={4}>
        <Box>
          <h2>1. Introduction</h2>
          <p className={styles.description}>
            Welcome to [Your Website Name]. This Privacy Policy is designed to
            inform you about the types of information we collect, how we use and
            protect that information, and your choices regarding the collection
            and use of your data.
          </p>
        </Box>
        <Box>
          <h2>2. Information We Collect</h2>
          <Stack spacing={2}>
            <h3>a) Personal Information:</h3>
            <p className={styles.description}>
              We may collect personal information such as your name, email
              address, and other contact details when you voluntarily provide
              them through forms on our Website.
            </p>

            <h3>b) Automatically Collected Information:</h3>
            <p className={styles.description}>
              We may automatically collect certain information about your visit,
              including your IP address, browser type, and device information.
            </p>
          </Stack>
        </Box>
        <Box>
          <h2>3. Use of Information</h2>
          <p className={styles.description}>
            We use the collected information for the following purposes:
            <ul>
              <li>To provide and maintain our services.</li>
              <li>To improve, personalize, and expand our services.</li>
              <li>
                To communicate with you, respond to your inquiries, and send you
                updates.
              </li>
            </ul>
          </p>
        </Box>
        <Box>
          <h2>4. Data Sharing</h2>
          <p className={styles.description}>
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
          </p>
        </Box>
        <Box>
          <h2>5. Cookies and Similar Technologies</h2>
          <p className={styles.description}>
            We use cookies and similar technologies to enhance your experience
            on our Website. You can manage your cookie preferences through your
            browser settings.
          </p>
        </Box>
        <Box>
          <h2>6. Security</h2>
          <p className={styles.description}>
            We take reasonable measures to protect your personal information
            from unauthorized access or disclosure.
          </p>
        </Box>
        <Box>
          <h2>7. Your Rights</h2>
          <p className={styles.description}>
            You have the right to:
            <ul>
              <li>Access, correct, or delete your personal information.</li>
              <li>Object to the processing of your personal data.</li>
              <li>Withdraw your consent.</li>
            </ul>
          </p>
        </Box>
        <Box>
          <h2>8. Changes to this Privacy Policy</h2>
          <p className={styles.description}>
            We reserve the right to update our Privacy Policy. Any changes will
            be effective upon posting the revised policy on our Website.
          </p>
        </Box>
        <Box>
          <h2>9. Contact Us</h2>
          <p className={styles.description}>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at [Your Contact Information].
          </p>
        </Box>
        <p style={{ fontSize: "1.3rem", fontWeight: "bold", alignSelf: "end" }}>
          Effective Date: 10.11.2023
        </p>
      </Stack>
    </>
  );
};

export default Privacy;
