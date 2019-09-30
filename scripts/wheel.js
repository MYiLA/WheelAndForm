window.showWheel = (sectors, _cb) => {
  const sectorsHtml = sectors
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

  document.querySelector('.reel__inner--circle-content').innerHTML = sectorsHtml;

  resizeWheel();
  window.addEventListener('resize', onResizeHandler);
  
  document.querySelector('.reel__inner--pointer').addEventListener('click', () => spin(sectors));
};

const hideWheel = () => {
  window.removeEventListener('resize', onResizeHandler);
}

const spin = (sectors) => {
  const availableSectors = sectors.filter(({ allow }) => allow);
  const resultSector = availableSectors[random(availableSectors.length)];
  const resultIndex = sectors.indexOf(resultSector);
  const angle = (5 * 360) - (360 / sectors.length) * resultIndex;
  const randomOffset = 0.8 * (Math.random() - 0.5) * (360 / sectors.length);

  document.querySelector('.reel__inner--circle-content').style.transform = `rotate(${angle + randomOffset}deg)`;
  document.querySelector('.reel__inner--circle-small').style.transform = `rotate(${(4 + Math.random()) * 360}deg)`;
  document.querySelector('.reel__inner--circle-medium').style.transform = `rotate(-${(4 + Math.random()) * 360}deg)`;
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
  document.querySelector('.wheel').style.fontSize = `${scale}px`;
};

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