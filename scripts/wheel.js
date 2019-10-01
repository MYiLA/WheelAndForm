
const wheel = document.querySelector('.wheel');
const smallReel = document.querySelector('.reel__inner--circle-small');
const mediumReel = document.querySelector('.reel__inner--circle-medium');
const contentReel = document.querySelector('.reel__inner--circle-content');

const nameInput = document.querySelector('.wheel__input[name=name]');
const phoneInput = document.querySelector('.wheel__input[name=tel]');
const checkboxInput = document.querySelector('.wheel__checkbox');
const continueBtn = document.querySelector('.wheel__button');
const closeBtn = document.querySelector('.wheel__close');

window.showWheel = (sectors, _cb) => {
  contentReel.innerHTML = getSectorsHtml(sectors);

  resizeWheel();
  window.addEventListener('resize', resizeHandler);

  nameInput.addEventListener('input', inputHandler);
  phoneInput.addEventListener('input', inputHandler);
  checkboxInput.addEventListener('input', inputHandler);

  continueBtn.addEventListener('click', () => spin(sectors));

  closeBtn.addEventListener('click', hideWheel);

  return hideWheel;
};

const hideWheel = () => {
  wheel.style.opacity = 0;

  window.removeEventListener('resize', resizeHandler);

  nameInput.removeEventListener('input', inputHandler);
  phoneInput.removeEventListener('input', inputHandler);
  checkboxInput.removeEventListener('input', inputHandler);

  continueBtn.removeEventListener('click', spin);
  closeBtn.removeEventListener('click', hideWheel);

  contentReel.removeEventListener('transitionend', spinStopHandler);
};

const inputHandler = () => {
  continueBtn.disabled = nameInput.value === '' || phoneInput.value === '' || !checkboxInput.checked;
};

const spinStopHandler = () => {
  continueBtn.disabled = false;
};

const spin = (sectors) => {
  continueBtn.disabled = true;

  const availableSectors = sectors.filter(({ allow }) => allow);
  const resultSector = availableSectors[random(availableSectors.length)];
  const resultIndex = sectors.indexOf(resultSector);
  const angle = (5 * 360) - (360 / sectors.length) * resultIndex;
  const randomOffset = 0.8 * (Math.random() - 0.5) * (360 / sectors.length);

  contentReel.style.transform = `rotate(${angle + randomOffset}deg)`;
  smallReel.style.transform = `rotate(${(4 + Math.random()) * 360}deg)`;
  mediumReel.style.transform = `rotate(-${(4 + Math.random()) * 360}deg)`;

  contentReel.addEventListener('transitionend', spinStopHandler);
};

const resizeWheel = () => {
  const vertical = window.innerWidth < window.innerHeight;
  const defaultWidth = vertical ? 800 : 800;
  const defaultHeigth = vertical ? 800 : 800;

  const scaleX = window.innerWidth / defaultWidth;
  const scaleY = window.innerHeight / defaultHeigth;
  const scale = Math.min(1, scaleX, scaleY);

  if (vertical) {
    wheel.classList.add('vertical');
  } else {
    wheel.classList.remove('vertical');
  }
  wheel.style.fontSize = `${scale}px`;
};

const getSectorsHtml = sectors => sectors
  .map(({ text }, i) => {
    const style = `transform: translateY(-50%) rotate(${(360/12) * i}deg)`;
    const bigTextClass = /\%$/.test(text) ? 'reel__sector-text--big' : '';
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

const resizeHandler = debounce(resizeWheel, 150);