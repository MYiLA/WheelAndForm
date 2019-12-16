'use strict';

(() => {

window.showWheel = (sectors, timeout, callback) => {
  const wheel = document.querySelector('.wheel');

  const smallReel = document.querySelector('.reel__inner--circle-small');
  const mediumReel = document.querySelector('.reel__inner--circle-medium');
  const contentReel = document.querySelector('.reel__inner--circle-content');
  const sectorsContainer = document.querySelector('.reel__content');
  const resultText = document.querySelector('.reel__result-text');
  const resultValue = document.querySelector('.reel__result-value');

  const form = document.querySelector('.wheel__form');
  const nameInput = document.querySelector('.wheel__input[name=username]');
  const phoneInput = document.querySelector('.wheel__input[name=phone]');
  const checkboxInput = document.querySelector('.wheel__checkbox');
  const spinBtn = document.querySelector('.wheel__button--spin');
  const closeBtn = document.querySelector('.wheel__close');

  const nameMask = IMask(nameInput, {
    mask: /^(?!.*\s{2,})[a-zA-Zа-яА-Я\s]+$/,
  });
  const phoneMask = IMask(phoneInput, {
    mask: '+{7}(000)000-00-00',
    placeholderChar: '#',
    lazy: false,
  });

  const availableSectors = sectors.filter(({ allow }) => allow);
  const resultSector = availableSectors[random(availableSectors.length)];

  let hideTimeoutId = null;

  const init = () => {
    wheel.classList.add('wheel--visible');

    sectorsContainer.innerHTML = getSectorsHtml(sectors);

    resize();
    window.addEventListener('resize', resizeHandler);

    form.addEventListener('submit', submitHandler);
    nameInput.addEventListener('input', inputHandler);
    nameInput.addEventListener('focusout', focusOutHandler);
    phoneInput.addEventListener('input', inputHandler);
    phoneInput.addEventListener('focusout', focusOutHandler);
    checkboxInput.addEventListener('input', inputHandler);

    spinBtn.addEventListener('click', spin);
    closeBtn.addEventListener('click', hide);
  };

  const hide = () => {
    wheel.classList.remove('wheel--visible');

    clearTimeout(hideTimeoutId);

    window.removeEventListener('resize', resizeHandler);

    form.removeEventListener('submit', submitHandler);
    nameInput.removeEventListener('input', inputHandler);
    nameInput.removeEventListener('focusout', focusOutHandler);
    phoneInput.removeEventListener('input', inputHandler);
    phoneInput.removeEventListener('focusout', focusOutHandler);
    checkboxInput.removeEventListener('input', inputHandler);

    spinBtn.removeEventListener('click', spin);
    closeBtn.removeEventListener('click', hide);

    contentReel.removeEventListener('transitionend', spinStopHandler);
  };

  const spin = () => {
    spinBtn.removeEventListener('click', spin);
    spinBtn.disabled = true;
    checkboxInput.disabled = true;

    const resultIndex = sectors.indexOf(resultSector);
    const angle = (5 * 360) - ((360 / sectors.length) * resultIndex);
    const randomOffset = 0.8 * (Math.random() - 0.5) * (360 / sectors.length);

    contentReel.style.transform = `rotate(${angle + randomOffset}deg)`;
    smallReel.style.transform = `rotate(${(4 + Math.random()) * 360}deg)`;
    mediumReel.style.transform = `rotate(-${(4 + Math.random()) * 360}deg)`;

    contentReel.addEventListener('transitionend', spinStopHandler);
  };

  const spinStopHandler = () => {
    contentReel.removeEventListener('transitionend', spinStopHandler);

    wheel.classList.remove('wheel--initial');
    wheel.classList.add('wheel--result');

    if (isDiscount(resultSector.text)) {
      resultValue.innerText = resultSector.text;
    } else {
      resultText.innerText = resultSector.text;
      resultValue.hidden = true;
    }

    callback({
      name: nameMask.unmaskedValue.trim(),
      phone: phoneMask.unmaskedValue,
      value: resultSector.value,
    });
  
    hideTimeoutId = setTimeout(hide, timeout);
  };

  const resize = () => {
    if ([nameInput, phoneInput].includes(document.activeElement)) {
      return;
    }

    const vertical = window.innerWidth < window.innerHeight;

    const defaultWidth = vertical ? 890 : 1560;
    const defaultHeigth = vertical ? 1400 : 780;

    const scaleX = window.innerWidth / defaultWidth;
    const scaleY = window.innerHeight / defaultHeigth;
    const scale = Math.min(1, scaleX, scaleY);

    if (vertical) {
      wheel.classList.add('wheel--vertical');
    } else {
      wheel.classList.remove('wheel--vertical');
    }

    wheel.style.setProperty('--scale', scale);
  };

  const resizeHandler = debounce(resize, 150);

  const submitHandler = e => e.preventDefault();

  const inputHandler = ({ target }) => {
    validateInput(target, false);

    const formInvalid = !isValid('username') || !isValid('phone') || !checkboxInput.checked;

    spinBtn.disabled = formInvalid;
  };

  const focusOutHandler = ({ target }) => validateInput(target, true);

  const validateInput = (el, setInvalid) => {
    if (isValid(el.name)) {
      el.classList.remove('wheel__input--invalid');
    } else if (setInvalid) {
      el.classList.add('wheel__input--invalid');
    }
  };

  const isValid = (name) => ({
    phone: phoneMask.unmaskedValue.length === 11,
    username: nameMask.unmaskedValue.length >= 3,
  }[name]);

  init();

  return hide;
};

const isDiscount = text => /^\d+\%$/.test(text);

const getSectorsHtml = sectors => sectors
  .map(({ text }, i) => {
    const style = `transform: translateY(-50%) rotate(${(360/12) * i}deg)`;
    const bigTextClass = isDiscount(text) ? 'reel__sector-text--big' : '';

    return (
      `<div class="reel__sector" style="${style}">
        <span class="reel__sector-text ${bigTextClass}">${text}</span>
      </div>`
    );
  })
  .reduce((acc, curr) => `${acc}${curr}`, '');

const debounce = (func, delay) => {
  let timeoutId = null;

  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(func, delay);
  };
};

const random = (max) => Math.floor(Math.random() * max);

})();