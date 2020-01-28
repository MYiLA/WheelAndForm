'use strict';

(() => {

window.showTimer = (timeout) => {
  const timerElement = document.querySelector('.wheel-timer');
  const timerDigitsElements = [...timerElement.querySelectorAll('.wheel-timer__sign')];
  let secondsLeft = Math.floor(timeout * 0.001);
  let countdownIntervalId = null;

  const countDownIntervalHandler = () => {
    if (secondsLeft <= 0) {
      clearInterval(countdownIntervalId);
      return;
    }

    secondsLeft -= 1;
    updateTimer(secondsLeft);
  };

  const updateTimer = (seconds) => {
    parseTime(seconds).split('').forEach((digit, i) => {
      timerDigitsElements[i].innerText = digit;
    });
  };

  const init = () => {
    updateTimer(secondsLeft);
    countdownIntervalId = setInterval(countDownIntervalHandler, 1000);
  };

  const hide = () => {};

  init();

  return hide;
};

const parseTime = (seconds) => {
  const s = seconds % 60;
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor((seconds / (60 * 60)) % 24);
  const d = Math.floor((seconds / (24 * 60 * 60)) % 24);

  return [d, h, m, s].map(digit => digit >= 10 ? digit : `0${digit}`).join('');
};

})();