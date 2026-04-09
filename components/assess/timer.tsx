"use client";

import { useEffect, useMemo, useState } from "react";

type TimerProps = {
  initialSeconds: number;
  onElapsed?: () => void;
};

export function Timer({ initialSeconds, onElapsed }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onElapsed?.();
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft, onElapsed]);

  const display = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [secondsLeft]);

  return <span className="font-mono text-sm text-muted-foreground">{display}</span>;
}
