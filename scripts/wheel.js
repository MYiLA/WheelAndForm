
const wheel = document.querySelector('.wheel');
const smallReel = document.querySelector('.reel__inner--circle-small');
const mediumReel = document.querySelector('.reel__inner--circle-medium');
const contentReel = document.querySelector('.reel__inner--circle-content');

const nameInput = document.querySelector('.wheel__input[name=name]');
const phoneInput = document.querySelector('.wheel__input[name=tel]');
const checkboxInput = document.querySelector('.wheel__checkbox');
const button = document.querySelector('.wheel__button');

window.showWheel = (sectors, _cb) => {
  contentReel.innerHTML = getSectorsHtml(sectors);

  resizeWheel();
  window.addEventListener('resize', onResizeHandler);

  nameInput.addEventListener('input', onInputHandler);
  phoneInput.addEventListener('input', onInputHandler);
  checkboxInput.addEventListener('input', onInputHandler);

  button.addEventListener('click', () => spin(sectors));
};

const hideWheel = () => {
  window.removeEventListener('resize', onResizeHandler);
}

const onInputHandler = () => {
  button.disabled = nameInput.value === '' || phoneInput.value === '' || !checkboxInput.checked;
}

const spin = (sectors) => {
  button.disabled = true;

  const availableSectors = sectors.filter(({ allow }) => allow);
  const resultSector = availableSectors[random(availableSectors.length)];
  const resultIndex = sectors.indexOf(resultSector);
  const angle = (5 * 360) - (360 / sectors.length) * resultIndex;
  const randomOffset = 0.8 * (Math.random() - 0.5) * (360 / sectors.length);

  contentReel.style.transform = `rotate(${angle + randomOffset}deg)`;
  smallReel.style.transform = `rotate(${(4 + Math.random()) * 360}deg)`;
  mediumReel.style.transform = `rotate(-${(4 + Math.random()) * 360}deg)`;

  contentReel.addEventListener('transitionend', () => {
    button.disabled = false;
  });
};

const resizeWheel = () => {
  const vertical = window.innerWidth < window.innerHeight;
  const defaultWidth = vertical ? 800 : 800;
  const defaultHeigth = vertical ? 800 : 800;

  const scaleX = window.innerWidth / defaultWidth;
  const scaleY = window.innerHeight / defaultHeigth;
  const scale = Math.min(1, scaleX, scaleY);

  if (vertical) {
    document.querySelector('.wheel__wrap').classList.add('vertical');
  } else {
    document.querySelector('.wheel__wrap').classList.remove('vertical');
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

const onResizeHandler = debounce(resizeWheel, 150);