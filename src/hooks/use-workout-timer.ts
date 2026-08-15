import { useEffect, useRef, useState } from "react";

export function useWorkoutTimer() {
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const accumulatedRef = useRef(0);
  const lastResumeAt = useRef(Date.now());
  const isPausedRef = useRef(false);
  const restEndsAt = useRef<number | null>(null);

  useEffect(() => {
    if (!isPaused) lastResumeAt.current = Date.now();

    const timer = setInterval(() => {
      if (!isPaused)
        setElapsed(
          accumulatedRef.current + (Date.now() - lastResumeAt.current) / 1000,
        );
      if (restEndsAt.current !== null)
        setRest(Math.max(0, (restEndsAt.current - Date.now()) / 1000));
    }, 500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const pause = () => {
    if (isPausedRef.current) return;
    accumulatedRef.current += (Date.now() - lastResumeAt.current) / 1000;
    isPausedRef.current = true;
    setIsPaused(true);
  };

  const resume = () => {
    if (!isPausedRef.current) return;
    lastResumeAt.current = Date.now();
    isPausedRef.current = false;
    setIsPaused(false);
  };

  const togglePause = () => {
    if (isPausedRef.current) resume();
    else pause();
  };

  const startRest = (seconds: number) => {
    restEndsAt.current = Date.now() + seconds * 1000;
    setRest(seconds);
  };

  const skipRest = () => {
    restEndsAt.current = null;
    setRest(0);
  };

  return {
    elapsed,
    isPaused,
    pause,
    rest,
    resume,
    startedAt,
    skipRest,
    startRest,
    togglePause,
  };
}
