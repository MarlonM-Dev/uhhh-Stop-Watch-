const timeDisplay = document.querySelector(".time");
const startBtn = document.querySelector(".start-btn");
const stopBtn = document.querySelector(".stop-btn");
const resetBtn = document.querySelector(".reset-btn");
const playBtn = document.querySelector(".play-btn");
const homeBtn = document.querySelector(".home-btn");
const contentWrapper = document.querySelector(".content-wrapper");
const stopwatchWrapper = document.querySelector(".stopwatch-wrapper");
const countdownHoursInput = document.getElementById("countdown-hours");
const countdownMinutesInput = document.getElementById("countdown-minutes");
const countdownSecondsInput = document.getElementById("countdown-seconds");
const startCountdownBtn = document.querySelector(".start-countdown-btn");
const quickBtns = document.querySelectorAll(".quick-btn");
const audio = new Audio("./sound/beep2.wav");

let intervalId, countdownInterval, notification;
let totalSeconds = 0;
let isRunning = false;

function updateTimeDisplay(hours, minutes, seconds) {
  timeDisplay.innerHTML = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    intervalId = setInterval(() => {
      totalSeconds++;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      updateTimeDisplay(hours, minutes, seconds);
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalId);
  isRunning = false;
}

function resetTimer() {
  stopTimer();
  totalSeconds = 0;
  updateTimeDisplay(0, 0, 0);
}

function startCountdown(seconds) {
  clearInterval(countdownInterval);
  totalSeconds = seconds;

  countdownInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(countdownInterval);
      playAudioAndNotify();
    } else {
      totalSeconds--;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      updateTimeDisplay(hours, minutes, secs);
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdownInterval);
  stopAlarm();
}

function resetCountdown() {
  stopCountdown();
  totalSeconds = 0;
  updateTimeDisplay(0, 0, 0);
}

function playAudioAndNotify() {
  audio.play().catch((err) => console.error("Audio play error:", err));

  if ("Notification" in window && Notification.permission === "granted") {
    notification = new Notification("Time's up!", {
      body: "Click to stop the alarm.",
      icon: "path/to/icon.png",
    });
    notification.onclick = stopAlarm;
  } else {
    alert("Time's up! Click 'OK' to stop the alarm.");
    stopAlarm();
  }
}

function stopAlarm() {
  audio.pause();
  audio.currentTime = 0;
  if (notification) notification.close();
}

function validateTimeInput(hours, minutes, seconds) {
  return [hours, minutes, seconds].every((time) => !isNaN(time) && time >= 0);
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

startCountdownBtn.addEventListener("click", () => {
  const hours = parseInt(countdownHoursInput.value, 10) || 0;
  const minutes = parseInt(countdownMinutesInput.value, 10) || 0;
  const seconds = parseInt(countdownSecondsInput.value, 10) || 0;

  if (validateTimeInput(hours, minutes, seconds)) {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total > 0) {
      startCountdown(total);
    } else {
      alert("Please enter a positive time value.");
    }
  } else {
    alert("Please enter valid time values.");
  }
});

quickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const seconds = parseInt(btn.getAttribute("data-seconds"), 10);
    if (seconds > 0) {
      stopCountdown();
      startCountdown(seconds);
    } else {
      alert("Invalid time value.");
    }
  });
});

function showPage(page) {
  const isStopwatch = page === "stopwatch";
  contentWrapper.classList.toggle("hidden", isStopwatch);
  playBtn.classList.toggle("hidden-play", isStopwatch);
  stopwatchWrapper.classList.toggle("hidden", !isStopwatch);
  stopwatchWrapper.classList.toggle("show", isStopwatch);
  localStorage.setItem("page", page);
}

document.addEventListener("DOMContentLoaded", () => {
  const savedPage = localStorage.getItem("page") || "home";
  showPage(savedPage);
});

playBtn.addEventListener("click", () => showPage("stopwatch"));
homeBtn.addEventListener("click", () => showPage("home"));

window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const content = document.querySelector(".content");

  setTimeout(() => {
    loadingScreen.style.opacity = "0";
    content.style.opacity = "1";

    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 800);
  }, 800);
});
