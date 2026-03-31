
import React, { useState, useEffect } from 'react';
import { FAMILY_REUNION_DETAILS } from '@/lib/sumlinData';

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const targetDate = new Date(FAMILY_REUNION_DETAILS.countdownDate);
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="countdown-container" aria-label={`Countdown to ${FAMILY_REUNION_DETAILS.countdownLabel}`}>
      <div className="countdown-unit">
        <span className="countdown-value">{formatNumber(timeLeft.days)}</span>
        <span className="countdown-label">Days</span>
      </div>
      <span className="countdown-separator">:</span>
      
      <div className="countdown-unit">
        <span className="countdown-value">{formatNumber(timeLeft.hours)}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <span className="countdown-separator">:</span>
      
      <div className="countdown-unit">
        <span className="countdown-value">{formatNumber(timeLeft.minutes)}</span>
        <span className="countdown-label">Min</span>
      </div>
      <span className="countdown-separator">:</span>
      
      <div className="countdown-unit">
        <span className="countdown-value">{formatNumber(timeLeft.seconds)}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
