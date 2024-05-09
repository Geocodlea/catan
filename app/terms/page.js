import styles from "/app/page.module.css";

import { Box, Stack } from "@mui/material";

const Terms = () => {
  return (
    <>
      <h1 className={styles.title}>Terms of Service</h1>

      <Stack spacing={4}>
        <Box>
          <h2>1. Acceptance of Terms</h2>
          <p className={styles.description}>
            By accessing or using this website, you agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms,
            you may not access the website.
          </p>
        </Box>
        <Box>
          <h2>2. Use of the Website</h2>
          <p className={styles.description}>
            You agree to use the website in accordance with all applicable laws
            and regulations. Any unauthorized use or violation of these terms
            may result in the termination of your access to the website.
          </p>
        </Box>
        <Box>
          <h2>3. Intellectual Property</h2>
          <p className={styles.description}>
            All content on this website, including but not limited to text,
            graphics, logos, and images, is the property of [Your Company] and
            is protected by intellectual property laws. You may not reproduce,
            modify, or distribute any content from this website without our
            prior written consent.
          </p>
        </Box>
        <Box>
          <h2>4. User Accounts</h2>
          <p className={styles.description}>
            If the website requires account creation, you are responsible for
            maintaining the confidentiality of your account information and for
            all activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </p>
        </Box>
        <Box>
          <h2>5. Privacy Policy</h2>
          <p className={styles.description}>
            Your use of this website is also governed by our Privacy Policy,
            which can be found [link to privacy policy]. By using the website,
            you consent to the terms of the Privacy Policy.
          </p>
        </Box>
        <Box>
          <h2>6. Limitation of Liability</h2>
          <p className={styles.description}>
            We are not liable for any direct, indirect, incidental,
            consequential, or punitive damages arising out of your use of the
            website. The website is provided "as is" and without warranties of
            any kind.
          </p>
        </Box>
        <Box>
          <h2>7. Governing Law</h2>
          <p className={styles.description}>
            These terms are governed by the laws of Romania. Any legal action or
            proceeding relating to your access to, or use of, the website shall
            be instituted in a competent court in Romania.
          </p>
        </Box>
        <Box>
          <h2>8. Changes to Terms</h2>
          <p className={styles.description}>
            We reserve the right to modify or replace these terms at any time.
            Your continued use of the website after any changes constitutes
            acceptance of the new terms.
          </p>
        </Box>
        <Box>
          <h2>9. Contact Information</h2>
          <p className={styles.description}>
            If you have any questions about these terms, please contact us at
            [Your Contact Information].
          </p>
        </Box>
      </Stack>
    </>
  );
};

export default Terms;
