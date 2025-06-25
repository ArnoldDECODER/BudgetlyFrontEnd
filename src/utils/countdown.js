import { useState, useEffect } from 'react';

/**
 * Custom hook for countdown logic
 * @param {number} startSeconds - Number of seconds to start the countdown from
 */
export const useCountdown = (startSeconds = 300) => {
  const [secondsLeft, setSecondsLeft] = useState(startSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsLeft]);

  const resetCountdown = () => {
    setSecondsLeft(startSeconds);
    setIsActive(true);
  };

  const stopCountdown = () => {
    setIsActive(false);
  };

  const formatTime = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return {
    secondsLeft,
    isActive,
    formatTime,
    resetCountdown,
    stopCountdown,
    isExpired: secondsLeft <= 0,
  };
};