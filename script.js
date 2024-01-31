const ONE_HOUR = 3600000;
const ONE_MINUTE = 60000;
const ONE_SECOND = 1000;

let startTime = 0;
let elapsedTime = ONE_HOUR;
let timerInterval;
let running = false;
let countdownMode = true;

function timeToString(time) {
  const diffInHrs = time / ONE_HOUR;
  const hh = Math.floor(diffInHrs);

  const diffInMin = (diffInHrs - hh) * 60;
  const mm = Math.floor(diffInMin);

  const diffInSec = (diffInMin - mm) * 60;
  const ss = Math.floor(diffInSec);

  const diffInMs = (diffInSec - ss) * 1000;
  const ms = Math.floor(diffInMs);

  const formattedHH = hh.toString().padStart(2, '0');
  const formattedMM = mm.toString().padStart(2, '0');
  const formattedSS = ss.toString().padStart(2, '0');
  const formattedMS = ms.toString().padStart(3, '0');

  return `${formattedHH}:${formattedMM}:${formattedSS}<span class="absolute top-0 text-sm">${formattedMS}</span>`;
}

function print(txt) {
  document.getElementById('display').innerHTML = txt;
}

function start() {
  startTime = countdownMode
    ? performance.now() + elapsedTime
    : performance.now() - elapsedTime;
  timerInterval = requestAnimationFrame(updateTimer);
  running = true;
}

function stop() {
  elapsedTime = countdownMode
    ? startTime - performance.now()
    : performance.now() - startTime;
  cancelAnimationFrame(timerInterval);
  running = false;
}

function reset() {
  cancelAnimationFrame(timerInterval);
  print('01:00:00<span class="absolute top-0 text-sm">000</span>');
  elapsedTime = ONE_HOUR;
  running = false;
  document.getElementById('startStop').textContent = 'Iniciar';
}

function updateTimer() {
  let now = performance.now();
  let timeElapsed = countdownMode ? startTime - now : now - startTime;
  elapsedTime = Math.max(0, timeElapsed);
  print(timeToString(elapsedTime));
  if (elapsedTime > 0) {
    timerInterval = requestAnimationFrame(updateTimer);
  } else if (countdownMode) {
    stop();
    alert('Tiempo terminado!');
  }
}

function setCountdownTime() {
  let hours = parseInt(document.getElementById('countdownHours').value) || 0;
  let minutes =
    parseInt(document.getElementById('countdownMinutes').value) || 0;
  let seconds =
    parseInt(document.getElementById('countdownSeconds').value) || 0;
  elapsedTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
  print(timeToString(elapsedTime));
  countdownMode = true;
}

document.getElementById('startStop').addEventListener('click', () => {
  if (running) {
    stop();
    document.getElementById('startStop').textContent = 'Iniciar';
  } else {
    start();
    document.getElementById('startStop').textContent = 'Detener';
  }
});

// Event listeners
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('setCountdown').addEventListener('click', () => {
  reset();
  setCountdownTime();
});
document
  .getElementById('increaseTimeSeconds')
  .addEventListener('click', addSecond);
document
  .getElementById('decreaseTimeSeconds')
  .addEventListener('click', subtractSecond);
document
  .getElementById('increaseTimeMinutes')
  .addEventListener('click', addMinute);
document
  .getElementById('decreaseTimeMinutes')
  .addEventListener('click', subtractMinute);
document.getElementById('increaseTimeHours').addEventListener('click', addHour);
document
  .getElementById('decreaseTimeHours')
  .addEventListener('click', subtractHour);

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
