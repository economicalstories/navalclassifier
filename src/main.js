import { boats, memos } from './game/boats.js';
import { classifyBoat, performanceReview } from './game/scoring.js';

const ROUND_SECONDS = 14;
const app = document.querySelector('#app');
let state = freshState();
let timer;

function freshState() {
  return {
    deck: shuffle(boats),
    index: 0,
    seconds: ROUND_SECONDS,
    score: 0,
    correct: 0,
    answered: 0,
    streak: 0,
    best: Number(localStorage.getItem('naval-classifier-best') ?? 0),
    feedback: null,
    shiftOver: false
  };
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function currentBoat() {
  return state.deck[state.index];
}

function accuracy() {
  return state.answered === 0 ? 100 : Math.round((state.correct / state.answered) * 100);
}

function setBestScore() {
  if (state.score > state.best) {
    state.best = state.score;
    localStorage.setItem('naval-classifier-best', String(state.score));
  }
}

function startTimer() {
  window.clearInterval(timer);
  if (state.feedback || state.shiftOver) return;
  timer = window.setInterval(() => {
    if (state.feedback || state.shiftOver) return;
    state.seconds -= 1;
    if (state.seconds <= 0) answer('Missed vessel');
    render();
  }, 1000);
}

function answer(choice) {
  if (state.feedback || state.shiftOver) return;
  const boat = currentBoat();
  const result = classifyBoat(boat, choice, state.seconds, state.streak);
  state.answered += 1;
  state.correct += result.isCorrect ? 1 : 0;
  state.score = Math.max(0, state.score + result.points);
  state.streak = result.isCorrect ? state.streak + 1 : 0;
  state.feedback = {
    title: result.outcome,
    body: result.isCorrect ? boat.feedback : `Incorrect. This was ${boat.correct}. ${boat.feedback}`,
    points: result.points,
    correct: result.isCorrect
  };
  setBestScore();
  if (navigator.vibrate) navigator.vibrate(result.isCorrect ? 25 : [30, 30, 30]);
  render();
}

function nextBoat() {
  state.feedback = null;
  state.seconds = ROUND_SECONDS;
  if (state.index >= state.deck.length - 1) state.shiftOver = true;
  else state.index += 1;
  render();
}

function restart() {
  state = freshState();
  render();
}

function stat(label, value) {
  return `<div class="stat"><span>${label}</span><strong>${value}</strong></div>`;
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
        ${stat('Best', state.best)}
      </div>
      <p class="review">${performanceReview(accuracy(), state.score)}</p>
      <button class="primary" data-action="restart">Start another shift</button>
    </section>`;
}

function renderGame() {
  const boat = currentBoat();
  const memo = boat.memo ?? memos[state.index % memos.length];
  app.className = 'app';
  app.innerHTML = `
    <header class="hud shell" aria-label="Shift status">
      ${stat('Score', state.score)}
      ${stat('Time', `${state.seconds}s`)}
      ${stat('Accuracy', `${accuracy()}%`)}
      ${stat('Streak', state.streak)}
    </header>
    <section class="ocean" aria-label="Vessel observation area">
      <div class="sun"></div>
      <div class="memo">${memo}</div>
      <article class="vessel-card">
        <p class="phase">${boat.phase}</p>
        <div class="vessel" aria-hidden="true">${boat.emoji}</div>
        <h1>${boat.name}</h1>
        <p>${boat.visualCue}</p>
        <small>${boat.silhouette}</small>
      </article>
      <div class="wave wave-one"></div>
      <div class="wave wave-two"></div>
    </section>
    <section class="controls shell" aria-label="Classification options">
      <p class="instruction">Classify before it sails past.</p>
      <div class="options">
        ${boat.options.map((option) => `<button data-answer="${option}">${option}</button>`).join('')}
      </div>
    </section>
    ${state.feedback ? `
      <section class="feedback ${state.feedback.correct ? 'good' : 'bad'}" role="status">
        <div>
          <p class="eyebrow">${state.feedback.points >= 0 ? `+${state.feedback.points}` : state.feedback.points} points</p>
          <h2>${state.feedback.title}</h2>
          <p>${state.feedback.body}</p>
        </div>
        <button class="primary" data-action="next">${state.index >= state.deck.length - 1 ? 'Finish shift' : 'Next vessel'}</button>
      </section>` : ''}`;
}

function bindActions() {
  document.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => answer(button.dataset.answer));
  });
  document.querySelector('[data-action="next"]')?.addEventListener('click', nextBoat);
  document.querySelector('[data-action="restart"]')?.addEventListener('click', restart);
}

function render() {
  window.clearInterval(timer);
  if (state.shiftOver) renderEndCard();
  else renderGame();
  bindActions();
  startTimer();
}

render();
