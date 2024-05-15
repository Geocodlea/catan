import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";

const StartButtons = ({ type, loading, round, isFinalRound, start, timer }) => {
  const [timerMinutes, setTimerMinutes] = useState(0);

  if (type === "catan" || type === "cavaleri") {
    if (round === 0) {
      return (
        <Box>
          <Typography gutterBottom>Generare meciuri 4 juc.</Typography>
          <LoadingButton
            loading={loading}
            loadingIndicator="Generating..."
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
            loadingIndicator="Generating..."
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
            loadingIndicator="Generating..."
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
            loadingIndicator="Generating..."
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

const ResetButton = ({ isFinalRound, reset }) => (
  <Box>
    {isFinalRound ? (
      <Typography gutterBottom>
        Șterge și introduce eveniment în evenimente anterioare, introduce
        jucători în leaderboard
      </Typography>
    ) : (
      <Typography gutterBottom>
        Șterge jucătorii înscriși și permite înscrieri
      </Typography>
    )}
    <Button variant="contained" className="btn btn-error" onClick={reset}>
      Reset
    </Button>
  </Box>
);

export { StartButtons, ResetButton };
