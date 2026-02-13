const CONFIG = {
  // Customize these 👇
  yourName: "Me",
  partnerName: "Aliya (My Princess)",
  kissText: "MWAH! Million kisses for you 💋",
  sweetLines: [
    "You’re my favorite place to be. 💗",
    "If kisses were stars, I’d give you a galaxy. ✨",
    "I wanted good in life - I found PERFECTTTTT. 🌙",
    "One kiss, and my day is complete. 💞",
    "You make everything feel soft and safe. 🤍"
  ],
  questions: [
    "Can I steal one sweet kiss today? 💞",
    "Okay… how about a forehead kiss? 🥺",
    "Last one… can I keep kissing you forever? 💖"
  ]
};

const $ = (id) => document.getElementById(id);

const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const modal = $("modal");
const modalBackdrop = $("modalBackdrop");
const closeModal = $("closeModal");
const kissBtn = $("kissBtn");
const sweetBtn = $("sweetBtn");
const sweetLine = $("sweetLine");
const kissOverlay = $("kissOverlay");
const overlayClose = $("overlayClose");
const kissText = $("kissText");
const dateText = $("dateText");
const questionText = $("questionText");
const questionTitle = $("questionTitle");
const note = $("note");
const muteBtn = $("muteBtn");
const muteIcon = $("muteIcon");

let step = 0;
let muted = false;

// Tiny sound (optional)
const clickSound = new Audio(
  "data:audio/wav;base64,UklGRmQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YUUAAAAA/////wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAAAP///wAA"
);
clickSound.volume = 0.25;

function playClick(){
  if (muted) return;
  try { clickSound.currentTime = 0; clickSound.play(); } catch {}
}

function setDate(){
  const d = new Date();
  const opts = { year: "numeric", month: "long", day: "numeric" };
  dateText.textContent = d.toLocaleDateString(undefined, opts);
}

function setProgress(activeIndex){
  const pills = document.querySelectorAll(".pill");
  pills.forEach((p, i) => p.classList.toggle("active", i === activeIndex));
}

function advanceQuestion(){
  step = Math.min(step + 1, CONFIG.questions.length - 1);
  questionText.textContent = CONFIG.questions[step];
  setProgress(step);

  if (step === CONFIG.questions.length - 1) {
    note.textContent = `Okay ${CONFIG.partnerName}… I’m waiting for your “Yes”. 💗`;
    noBtn.textContent = "I’m shy 🙈";
  } else {
    note.textContent = "Tip: tap “Yes” if you want to unlock the surprise ✨";
  }
}

function openModal(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModalFn(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  sweetLine.textContent = "";
}

function openKissOverlay(){
  kissText.textContent = CONFIG.kissText;
  kissOverlay.classList.add("show");
  kissOverlay.setAttribute("aria-hidden", "false");

  // confetti-ish floating hearts
  burstHearts();
}

function closeKissOverlay(){
  kissOverlay.classList.remove("show");
  kissOverlay.setAttribute("aria-hidden", "true");
}

function randomSweetLine(){
  const i = Math.floor(Math.random() * CONFIG.sweetLines.length);
  sweetLine.textContent = CONFIG.sweetLines[i];
}

function burstHearts(){
  const count = 18;
  for (let i = 0; i < count; i++){
    const el = document.createElement("div");
    el.textContent = Math.random() > 0.5 ? "💗" : "💘";
    el.style.position = "fixed";
    el.style.left = `${Math.random() * 100}vw`;
    el.style.top = `${60 + Math.random() * 30}vh`;
    el.style.fontSize = `${16 + Math.random() * 22}px`;
    el.style.zIndex = 90;
    el.style.pointerEvents = "none";
    el.style.filter = "drop-shadow(0 10px 18px rgba(255,79,163,.25))";

    const drift = (Math.random() * 120) - 60;
    const rise = 220 + Math.random() * 220;
    const dur = 900 + Math.random() * 800;

    document.body.appendChild(el);

    el.animate([
      { transform: "translate(0, 0) scale(1)", opacity: 0 },
      { transform: "translate(0, -20px) scale(1)", opacity: 1, offset: 0.15 },
      { transform: `translate(${drift}px, -${rise}px) scale(1.15)`, opacity: 0 }
    ], { duration: dur, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" });

    setTimeout(() => el.remove(), dur + 30);
  }
}

/* Events */
yesBtn.addEventListener("click", () => {
  playClick();
  openModal();
});

noBtn.addEventListener("click", () => {
  playClick();
  advanceQuestion();

  // playful: make the "No" button wiggle and slightly dodge
  const dx = (Math.random() * 18) - 9;
  const dy = (Math.random() * 10) - 5;
  noBtn.animate(
    [
      { transform: "translate(0,0) rotate(0deg)" },
      { transform: `translate(${dx}px, ${dy}px) rotate(-2deg)` },
      { transform: "translate(0,0) rotate(0deg)" }
    ],
    { duration: 260, easing: "ease-out" }
  );
});

modalBackdrop.addEventListener("click", closeModalFn);
closeModal.addEventListener("click", closeModalFn);

kissBtn.addEventListener("click", () => {
  playClick();
  closeModalFn();
  openKissOverlay();
});

sweetBtn.addEventListener("click", () => {
  playClick();
  randomSweetLine();
});

overlayClose.addEventListener("click", () => {
  playClick();
  closeKissOverlay();
});

muteBtn.addEventListener("click", () => {
  muted = !muted;
  muteIcon.textContent = muted ? "🔇" : "🔊";
});

/* Init */
setDate();
questionText.textContent = CONFIG.questions[0];
setProgress(0);
questionTitle.textContent = `One question for you, ${CONFIG.partnerName}…`;

// ESC closes modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    if (modal.classList.contains("show")) closeModalFn();
    if (kissOverlay.classList.contains("show")) closeKissOverlay();
  }
});
