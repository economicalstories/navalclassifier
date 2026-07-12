import { boats, classes, memos } from './game/boats.js';
import { classifyBoat, missBoat, performanceReview } from './game/scoring.js';

const app = document.querySelector('#app');
let state = freshState();
let rafId;
let lastFrame = performance.now();

function freshState() {
  return {
    deck: shuffle(boats),
    index: 0,
    elapsed: 0,
    score: 0,
    correct: 0,
    answered: 0,
    missed: 0,
    streak: 0,
    best: Number(localStorage.getItem('naval-classifier-best') ?? 0),
    scan: 0,
    scanLock: false,
    scanning: false,
    feedback: null,
    shiftOver: false,
    shake: false
  };
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function boat() {
  return state.deck[state.index];
}

function progress() {
  return Math.min(1, state.elapsed / boat().duration);
}

function accuracy() {
  return state.answered === 0 ? 100 : Math.round((state.correct / state.answered) * 100);
}

function updateBest() {
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem('naval-classifier-best', String(state.score));
  }
}

function tick(now) {
  const delta = Math.min(80, now - lastFrame);
  lastFrame = now;

  if (!state.feedback && !state.shiftOver) {
    state.elapsed += delta;
    if (state.scanning && !state.scanLock) state.scan = Math.min(100, state.scan + delta * 0.045);
    if (!state.scanning && !state.scanLock) state.scan = Math.max(0, state.scan - delta * 0.025);
    if (state.scan >= 100) state.scanLock = true;
    if (progress() >= 1) markMissed();
  }

  render();
  rafId = requestAnimationFrame(tick);
}

function fire(classId) {
  if (state.feedback || state.shiftOver) return;
  const result = classifyBoat(boat(), classId, progress(), state.scanLock, state.streak);
  applyResult(result);
}

function markMissed() {
  const result = missBoat(boat());
  state.missed += 1;
  applyResult(result);
}

function applyResult(result) {
  state.answered += 1;
  state.correct += result.isCorrect ? 1 : 0;
  state.score = Math.max(0, state.score + result.points);
  state.streak = result.isCorrect ? state.streak + 1 : 0;
  state.feedback = result;
  state.shake = !result.isCorrect;
  state.scanning = false;
  updateBest();
  if (navigator.vibrate) navigator.vibrate(result.isCorrect ? 20 : [35, 25, 35]);
  window.setTimeout(() => { state.shake = false; }, 260);
}

function nextBoat() {
  state.feedback = null;
  state.elapsed = 0;
  state.scan = 0;
  state.scanLock = false;
  state.scanning = false;
  if (state.index >= state.deck.length - 1) state.shiftOver = true;
  else state.index += 1;
}

function restart() {
  state = freshState();
  lastFrame = performance.now();
}

function stat(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
}

function classButtons() {
  return classes.map((item) => `
    <button class="stamp" data-class="${item.id}" aria-label="Classify as ${item.label}">
      <span>${item.icon}</span>
      <strong>${item.label}</strong>
      <kbd>${item.key}</kbd>
    </button>`).join('');
}

function renderEndCard() {
  app.className = 'app shell';
  app.innerHTML = `
    <section class="panel end-card">
      <p class="eyebrow">End of shift performance review</p>
      <h1>Classification shift complete</h1>
      <div class="review-grid">
        ${stat('Score', state.score)}
        ${stat('Accuracy', `${accuracy()}%`)}
        ${stat('Missed', state.missed)}
      </div>
      <p class="review">${performanceReview(accuracy(), state.score, state.missed)}</p>
      <button class="primary" data-action="restart">Start another shift</button>
    </section>`;
}

function renderGame() {
  const target = boat();
  const pct = progress();
  const left = Math.round(-14 + pct * 128);
  const memo = memos[state.index % memos.length];
  const remaining = Math.max(0, Math.ceil((target.duration - state.elapsed) / 1000));

  app.className = `app ${state.shake ? 'shake' : ''}`;
  app.innerHTML = `
    <header class="hud shell" aria-label="Shift status">
      ${stat('Score', state.score)}
      ${stat('Time', `${remaining}s`)}
      ${stat('Streak', state.streak)}
      ${stat('Best', state.best)}
    </header>
    <section class="radar shell">
      <div class="memo">${memo}</div>
      <div class="sea-lane" aria-label="Moving vessel lane">
        <div class="range-line danger"></div>
        <div class="range-line lock"></div>
        <article class="moving-vessel ${state.scanLock ? 'locked' : ''}" style="left:${left}%; --scale:${target.size}" aria-label="${target.name}">
          <span class="wake ${target.wake}"></span>
          <span class="sprite">${target.emoji}</span>
          <span class="tag">${target.name}</span>
        </article>
      </div>
      <aside class="intel">
        <p class="phase">${target.phase}</p>
        <h1>${state.scanLock ? target.name : 'Unidentified contact'}</h1>
        <p>${state.scanLock ? target.lockClue : target.clue}</p>
        <div class="scanbar"><span style="width:${state.scan}%"></span></div>
        <small>${state.scanLock ? 'SCAN LOCK: bonus evidence active' : 'Hold SCAN for evidence before firing a stamp'}</small>
      </aside>
    </section>
    <section class="controls shell" aria-label="Action console">
      <button class="scan ${state.scanning ? 'active' : ''}" data-action="scan" aria-pressed="${state.scanning}">🔎 Hold scan</button>
      <div class="stamps">${classButtons()}</div>
    </section>
    ${state.feedback ? `
      <section class="feedback ${state.feedback.isCorrect ? 'good' : 'bad'}" role="status">
        <p class="eyebrow">${state.feedback.points >= 0 ? `+${state.feedback.points}` : state.feedback.points} points</p>
        <h2>${state.feedback.outcome}</h2>
        <p>${state.feedback.message}</p>
        <button class="primary" data-action="next">${state.index >= state.deck.length - 1 ? 'Finish shift' : 'Next contact'}</button>
      </section>` : ''}`;
}

function bindActions() {
  document.querySelectorAll('[data-class]').forEach((button) => {
    button.addEventListener('click', () => fire(button.dataset.class));
  });

  const scan = document.querySelector('[data-action="scan"]');
  scan?.addEventListener('pointerdown', () => { state.scanning = true; });
  scan?.addEventListener('pointerup', () => { state.scanning = false; });
  scan?.addEventListener('pointerleave', () => { state.scanning = false; });
  scan?.addEventListener('click', () => { state.scanning = !state.scanning; });

  document.querySelector('[data-action="next"]')?.addEventListener('click', nextBoat);
  document.querySelector('[data-action="restart"]')?.addEventListener('click', restart);
}

function render() {
  if (state.shiftOver) renderEndCard();
  else renderGame();
  bindActions();
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toUpperCase();
  const matched = classes.find((item) => item.key === key);
  if (matched) fire(matched.id);
  if (key === ' ') state.scanning = true;
  if (key === 'ENTER' && state.feedback) nextBoat();
});

window.addEventListener('keyup', (event) => {
  if (event.key === ' ') state.scanning = false;
});

render();
rafId = requestAnimationFrame((now) => {
  lastFrame = now;
  rafId = requestAnimationFrame(tick);
});
