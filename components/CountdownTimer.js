import { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRAT");
        return;
      }

      // Convert distance to total minutes and seconds
      const totalSeconds = Math.floor(distance / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // Update the time left display
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <h4 style={{ padding: "1rem" }}>Timp rămas: {timeLeft}</h4>;
};

export default CountdownTimer;
