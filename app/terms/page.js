import { Stack, Typography } from "@mui/material";

const Terms = () => {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Terms of Service
      </Typography>

      <Stack spacing={4}>
        <div>
          <Typography variant="h3" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" gutterBottom>
            By accessing or using this website, you agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms,
            you may not access the website.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            2. Use of the Website
          </Typography>
          <Typography variant="body1" gutterBottom>
            You agree to use the website in accordance with all applicable laws
            and regulations. Any unauthorized use or violation of these terms
            may result in the termination of your access to the website.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            3. Intellectual Property
          </Typography>
          <Typography variant="body1" gutterBottom>
            All content on this website, including but not limited to text,
            graphics, logos, and images, is the property of AGames and is
            protected by intellectual property laws. You may not reproduce,
            modify, or distribute any content from this website without our
            prior written consent.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            4. User Accounts
          </Typography>
          <Typography variant="body1" gutterBottom>
            If the website requires account creation, you are responsible for
            maintaining the confidentiality of your account information and for
            all activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            5. Privacy Policy
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your use of this website is also governed by our Privacy Policy. By
            using the website, you consent to the terms of the Privacy Policy.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" gutterBottom>
            We are not liable for any direct, indirect, incidental,
            consequential, or punitive damages arising out of your use of the
            website. The website is provided "as is" and without warranties of
            any kind.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            7. Governing Law
          </Typography>
          <Typography variant="body1" gutterBottom>
            These terms are governed by the laws of Romania. Any legal action or
            proceeding relating to your access to, or use of, the website shall
            be instituted in a competent court in Romania.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            8. Changes to Terms
          </Typography>
          <Typography variant="body1" gutterBottom>
            We reserve the right to modify or replace these terms at any time.
            Your continued use of the website after any changes constitutes
            acceptance of the new terms.
          </Typography>
        </div>
        <div>
          <Typography variant="h3" gutterBottom>
            9. Contact Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            If you have any questions about these terms, please contact us using
            the contact form.
          </Typography>
        </div>
      </Stack>
    </>
  );
};

export default Terms;
