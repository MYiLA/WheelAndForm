'use strict';

(() => {

window.showTimer = (timeout) => {
  const timerElement = document.querySelector('.wheel-timer');
  const timerDigitsElements = [...timerElement.querySelectorAll('.wheel-timer__sign')];
  const timerTextsElements = [...timerElement.querySelectorAll('.wheel-timer__desc')];
  let secondsLeft = Math.floor(timeout * 0.001);
  let countdownIntervalId = null;

  const countDownIntervalHandler = () => {
    if (secondsLeft <= 0) {
      hide();
      return;
    }

    secondsLeft -= 1;
    updateTimer(secondsLeft);
  };

  const updateTimer = (seconds) => {
    const parsedTime = parseTime(seconds);
    parsedTime.forEach((value, i) => {
      timerTextsElements[i].innerText = getCountingText(value, texts[i]);
    });
    parsedTime.map(value => value >= 10 ? value : `0${value}`)
      .join('').split('')
      .forEach((digit, i) => {
        timerDigitsElements[i].innerText = digit;
      });
  };

  const init = () => {
    timerElement.classList.add('wheel-timer--visible');
    updateTimer(secondsLeft);
    countdownIntervalId = setInterval(countDownIntervalHandler, 1000);
  };

  const hide = () => {
    timerElement.classList.remove('wheel-timer--visible');
    clearInterval(countdownIntervalId);
  };

  init();

  return hide;
};

const parseTime = (seconds) => {
  const s = seconds % 60;
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor((seconds / (60 * 60)) % 24);
  const d = Math.floor((seconds / (24 * 60 * 60)) % 24);

  return [d, h, m, s];
};

const getCountingText = (number, texts) => {
  switch (number % 100) {
    case 11:
    case 12:
    case 13:
    case 14:
      return texts[2];
  }

  switch (number % 10) {
    case 1:
      return texts[0];
    case 2:
    case 3:
    case 4:
      return texts[1];
    default:
      return texts[2];
  }
};

const texts = [
  ['день', 'дня', 'дней'],
  ['час', 'часа', 'часов'],
  ['минута', 'минуты', 'минут'],
  ['секунда', 'секунды', 'секунд'],
];

})();