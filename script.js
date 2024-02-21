const ONE_HOUR = 3600000;
const ONE_MINUTE = 60000;
const ONE_SECOND = 1000;
const F1_SESSIONS = {
  FP: ONE_HOUR,
  Q1: 18 * ONE_MINUTE,
  Q2: 15 * ONE_MINUTE,
  Q3: 12 * ONE_MINUTE,
  SQ1: 12 * ONE_MINUTE,
  SQ2: 10 * ONE_MINUTE,
  SQ3: 8 * ONE_MINUTE,
  R: 2 * ONE_HOUR,
  T: 4 * ONE_HOUR,
};

let startTime = 0;
let elapsedTime = ONE_HOUR;
let timerInterval;
let running = false;
let countdownMode = true;

// Selectors
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const stopButton = document.getElementById('stop');
const continueButton = document.getElementById('continue');
const setCountdownButton = document.getElementById('setCountdown');
const increaseTimeSecondsButton = document.getElementById(
  'increaseTimeSeconds'
);
const decreaseTimeSecondsButton = document.getElementById(
  'decreaseTimeSeconds'
);
const increaseTimeMinutesButton = document.getElementById(
  'increaseTimeMinutes'
);
const decreaseTimeMinutesButton = document.getElementById(
  'decreaseTimeMinutes'
);
const increaseTimeHoursButton = document.getElementById('increaseTimeHours');
const decreaseTimeHoursButton = document.getElementById('decreaseTimeHours');
const sessionSelector = document.getElementById('sesion-selector');
const countDownHoursInput = document.getElementById('countdownHours');
const countDownMinutesInput = document.getElementById('countdownMinutes');
const countDownSecondsInput = document.getElementById('countdownSeconds');
const displayTimeContainer = document.getElementById('display-time');
const displayTyresContainer = document.getElementById('display-tyres');
const countdownErrors = document.getElementById('countdownErrors');

function timeToString(time) {
  const diffInHrs = time / ONE_HOUR;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  disableAddAndSubtractButtons(hh, mm, ss);

  const diffInMs = (diffInSec - ss) * 1000;
  const ms = Math.floor(diffInMs);

  const formattedHH = hh.toString().padStart(2, '0');
  const formattedMM = mm.toString().padStart(2, '0');
  const formattedSS = ss.toString().padStart(2, '0');
  const formattedMS = ms.toString().padStart(3, '0');

  return `${formattedHH} : ${formattedMM} : ${formattedSS}<span class="!absolute top-4 right-6 text-sm">${formattedMS}</span>`;
}

function disableButton(disable, button) {
  button.disabled = disable;
}

function toggleClass(element, className, add) {
  if (add) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

function showAndHideElements(showList, hideList) {
  showList.forEach((element) => {
    toggleClass(element, 'hidden', false);
    toggleClass(element, 'flex', true);
  });

  hideList.forEach((element) => {
    toggleClass(element, 'hidden', true);
    toggleClass(element, 'flex', false);
  });
}

function disableAddAndSubtractButtons(hh, mm, ss) {
  disableButton(hh === 0 || running, decreaseTimeHoursButton);
  disableButton((hh === 0 && mm === 0) || running, decreaseTimeMinutesButton);
  disableButton(
    (hh === 0 && mm === 0 && ss === 0) || running,
    decreaseTimeSecondsButton
  );
}

function print(txt) {
  document.getElementById('display').innerHTML = txt;
}

function start() {
  startTime = countdownMode
    ? performance.now() + elapsedTime
    : performance.now() - elapsedTime;
  timerInterval = requestAnimationFrame(updateTimer);

  changeDisableAddAndSubtractButtons();
  setCountdownButton.disabled = true;

  showAndHideElements([stopButton], [startButton, resetButton, continueButton]);

  running = true;
}

function changeDisableAddAndSubtractButtons(disable = true) {
  let buttons = document.querySelectorAll('.add-subtract-button');
  buttons.forEach((button) => {
    button.disabled = disable;
  });
}

function stop() {
  elapsedTime = countdownMode
    ? startTime - performance.now()
    : performance.now() - startTime;
  cancelAnimationFrame(timerInterval);
  changeDisableAddAndSubtractButtons(false);
  setCountdownButton.disabled = false;
  running = false;

  showAndHideElements([resetButton, continueButton], [stopButton]);
}

function reset() {
  cancelAnimationFrame(timerInterval);
  elapsedTime = getSessionTime(sessionSelector.value);
  print(timeToString(elapsedTime));
  running = false;
  changeDisableAddAndSubtractButtons(false);
  setCountdownButton.disabled = false;
  showAndHideElements(
    [startButton, displayTimeContainer],
    [stopButton, resetButton, continueButton, displayTyresContainer]
  );
}

function updateTimer() {
  let now = performance.now();
  let timeElapsed = countdownMode ? startTime - now : now - startTime;
  elapsedTime = Math.max(0, timeElapsed);
  print(timeToString(elapsedTime));
  if (elapsedTime > 0) {
    timerInterval = requestAnimationFrame(updateTimer);
  } else if (countdownMode) {
    showTyres();
    stop();
    continueButton.classList.add('hidden');
    continueButton.classList.remove('flex');
    changeDisableAddAndSubtractButtons(true);
  }
}

function showTyres(show = true) {
  if (!show) {
    showAndHideElements([displayTimeContainer], [displayTyresContainer]);
    return;
  }
  showAndHideElements([displayTyresContainer], [displayTimeContainer]);
}

function validateInput(input, min, max) {
  let value = parseInt(input.value);
  if (isNaN(value) || value < min || value > max) {
    input.classList.add('border-rojo');
    input.classList.remove('border-gris');
    return {
      valid: false,
      value,
    };
  }
  input.classList.remove('border-rojo');
  input.classList.add('border-gris');
  return {
    valid: true,
    value,
  };
}

function parseValues() {
  const hours = validateInput(countDownHoursInput, 0, 100);
  const minutes = validateInput(countDownMinutesInput, 0, 59);
  const seconds = validateInput(countDownSecondsInput, 0, 59);
  return { hours, minutes, seconds };
}

function setCountdownTime() {
  const { hours, minutes, seconds } = parseValues();

  if (!hours.valid || !minutes.valid || !seconds.valid) {
    countdownErrors.classList.remove('hidden');
    return;
  }

  countdownErrors.classList.add('hidden');

  elapsedTime =
    (hours.value * 3600 + minutes.value * 60 + seconds.value) * 1000;
  print(timeToString(elapsedTime));
  countdownMode = true;
}

// Event listeners
startButton.addEventListener('click', start);
continueButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);
resetButton.addEventListener('click', reset);
setCountdownButton.addEventListener('click', () => {
  reset();
  setCountdownTime();
});
increaseTimeSecondsButton.addEventListener('click', addSecond);
decreaseTimeSecondsButton.addEventListener('click', subtractSecond);
increaseTimeMinutesButton.addEventListener('click', addMinute);
decreaseTimeMinutesButton.addEventListener('click', subtractMinute);
increaseTimeHoursButton.addEventListener('click', addHour);
decreaseTimeHoursButton.addEventListener('click', subtractHour);

sessionSelector.addEventListener('change', (e) => {
  changeSession(e.target.value);
});

function changeSession(selectedValue) {
  running = false;
  elapsedTime = getSessionTime(selectedValue);
  print(timeToString(elapsedTime));
}

function getSessionTime(selectedValue) {
  let time = elapsedTime;
  if (selectedValue) {
    time = F1_SESSIONS[selectedValue] || ONE_HOUR;
  }
  return time;
}

// Functions for listeners
function addSecond() {
  elapsedTime += ONE_SECOND + 1;
  print(timeToString(elapsedTime));
}

function subtractSecond() {
  elapsedTime = Math.max(0, elapsedTime - ONE_SECOND);
  print(timeToString(elapsedTime));
}

function addMinute() {
  elapsedTime += ONE_MINUTE + 1;
  print(timeToString(elapsedTime));
}

function subtractMinute() {
  elapsedTime = Math.max(0, elapsedTime - ONE_MINUTE);
  print(timeToString(elapsedTime));
}

function addHour() {
  elapsedTime += ONE_HOUR + 1;
  print(timeToString(elapsedTime));
}

function subtractHour() {
  elapsedTime = Math.max(0, elapsedTime - ONE_HOUR);
  print(timeToString(elapsedTime));
}

// Add on click for elements with class toggleTheme
document.querySelectorAll('.toggleTheme').forEach((el) => {
  el.addEventListener('click', toggleTheme);
});

function toggleTheme() {
  document.getElementsByTagName('html')[0].classList.toggle('dark');
}
