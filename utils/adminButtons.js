import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

const StartButtons = ({ type, loading, round, start, timer }) => {
  const [timerMinutes, setTimerMinutes] = useState(0);

  if (type === "catan" || type === "cavaleri") {
    if (round === 0) {
      return (
        <Box>
          <Typography gutterBottom>Generare meciuri 4 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generare..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(4)}
          >
            Start
          </LoadingButton>
        </Box>
      );
    }

    return (
      <Box>
        <Typography gutterBottom>Introdu minute durată meci</Typography>
        <TextField
          variant="outlined"
          required
          fullWidth
          type="number"
          onChange={(event) => setTimerMinutes(event.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          className="btn btn-primary"
          onClick={() => timer(timerMinutes)}
        >
          Start Timer
        </Button>
      </Box>
    );
  }

  if (round === 0) {
    return (
      <Stack spacing={2}>
        <Box>
          <Typography gutterBottom>Generare meciuri 6 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generare..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(6)}
          >
            Start
          </LoadingButton>
        </Box>
        <Box>
          <Typography gutterBottom>Generare meciuri 5 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generare..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(5)}
          >
            Start
          </LoadingButton>
        </Box>
        <Box>
          <Typography gutterBottom>Generare meciuri 4 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generare..."
            variant="contained"
            className="btn btn-primary"
            onClick={() => start(4)}
          >
            Start
          </LoadingButton>
        </Box>
      </Stack>
    );
  }
};

const ResetButton = ({ loading, round, isFinalRound, reset }) => (
  <Box>
    {isFinalRound && (
      <>
        <Typography gutterBottom>
          Șterge și introduce eveniment în evenimente anterioare
        </Typography>

        <LoadingButton
          loading={loading}
          loadingIndicator="Reset..."
          variant="contained"
          className="btn btn-error"
          onClick={reset}
        >
          Reset
        </LoadingButton>
      </>
    )}
  </Box>
);

export { StartButtons, ResetButton };
