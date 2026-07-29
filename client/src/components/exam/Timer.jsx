import { useEffect, useState } from "react";

function Timer({
  minutes = 0,
  onTimeUp,
  onTimeChange,
}) {

  const [secondsLeft, setSecondsLeft] = useState(
    Math.max(0, minutes * 60)
  );

  // Reset timer when duration changes
  useEffect(() => {

    setSecondsLeft(Math.max(0, minutes * 60));

  }, [minutes]);

  // Countdown
  useEffect(() => {

    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {

      setSecondsLeft((prev) => {

        const next = prev - 1;

        if (onTimeChange) {
          onTimeChange(next > 0 ? next : 0);
        }

        if (next <= 0) {

          clearInterval(interval);

          if (onTimeUp) {
            onTimeUp();
          }

          return 0;

        }

        return next;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [secondsLeft, onTimeUp, onTimeChange]);

  // Time Format
  const hours = String(
    Math.floor(secondsLeft / 3600)
  ).padStart(2, "0");

  const mins = String(
    Math.floor((secondsLeft % 3600) / 60)
  ).padStart(2, "0");

  const secs = String(
    secondsLeft % 60
  ).padStart(2, "0");

  // Timer Color
  let timerColor = "#198754";

  if (secondsLeft <= 300) {
    timerColor = "#ff9800";
  }

  if (secondsLeft <= 60) {
    timerColor = "#dc3545";
  }

  return (

    <div
      className="timerBox"
      style={{
        color: timerColor,
        fontWeight: "700",
        fontSize: "30px",
        letterSpacing: "2px",
      }}
    >
      {hours}:{mins}:{secs}
    </div>

  );

}

export default Timer;