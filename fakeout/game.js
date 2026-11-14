(() => {
  const HS_KEY = "fakeout_highscore_v1";
  const NICK_KEY = "fakeout_nickname_v1";

  const state = {
    nick: "",
    lives: 3,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: 0,
    correct: 0,
    infected: 0,
    phase: "start",
    levelIndex: 0,
    qIndex: 0,
    timer: null,
    timeLeft: 0,
    timeMax: 0,
    frozen: false,
    tickWarned: false,
    powers: { hint: true, freeze: true, fifty: true },
    investLeft: 3,
    current: null,
    awaiting: false,
  };

  const levels = ["level1", "level2", "level3", "boss"];

  const $ = (id) => document.getElementById(id);
  const screens = {
    start: $("screen-start"),
    level: $("screen-level"),
    play: $("screen-play"),
    explain: $("screen-explain"),
    over: $("screen-over"),
    results: $("screen-results"),
  };

  function show(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
    state.phase = name;
  }

  function loadHigh() {
    try {
      const raw = localStorage.getItem(HS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function saveHigh(score, nick) {
    const prev = loadHigh();
    if (!prev || score > prev.score) {
      const next = { score, nick, at: Date.now() };
      try {
        localStorage.setItem(HS_KEY, JSON.stringify(next));
      } catch (_) {}
      return true;
    }
    return false;
  }

  function renderHigh() {
    const hs = loadHigh();
    $("highscore-line").textContent = hs
      ? `🏆 Best on this device: ${hs.score} · ${hs.nick || "Player"}`
      : "🏆 Best on this device: — · be the first lah!";
  }

  function updateHud() {
    $("hud").hidden = state.phase === "start";
    const hearts = "❤️".repeat(state.lives) + "🖤".repeat(Math.max(0, 3 - state.lives));
    $("hud-lives").textContent = hearts;
    $("hud-score").textContent = String(state.score);
    const mult = multiplier();
    $("hud-mult").textContent = `×${mult}`;
  }

  function multiplier() {
    if (state.streak >= 8) return 4;
    if (state.streak >= 5) return 3;
    if (state.streak >= 2) return 2;
    return 1;
  }

  function clearTimer() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
    state.frozen = false;
    state.tickWarned = false;
  }

  function startTimer(seconds) {
    clearTimer();
    state.timeMax = seconds;
    state.timeLeft = seconds;
    const bar = $("timer-bar");
    bar.classList.remove("urgent");
    bar.style.transform = "scaleX(1)";

    state.timer = setInterval(() => {
      if (state.frozen || state.awaiting) return;
      state.timeLeft = Math.max(0, state.timeLeft - 0.1);
      const pct = state.timeLeft / state.timeMax;
      bar.style.transform = `scaleX(${pct})`;
      if (state.timeLeft <= 3) {
        bar.classList.add("urgent");
        const sec = Math.ceil(state.timeLeft);
        if (state.tickWarned !== sec) {
          state.tickWarned = sec;
          FakeOutAudio.tick();
        }
      }
      if (state.timeLeft <= 0) {
        clearTimer();
        onTimeout();
      }
    }, 100);
  }

  function speedBonus() {
    if (state.timeMax <= 0) return 0;
    const ratio = state.timeLeft / state.timeMax;
    if (ratio >= 0.66) return 40;
    if (ratio >= 0.33) return 20;
    return 5;
  }

  function resetGame() {
    clearTimer();
    state.lives = 3;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.answered = 0;
    state.correct = 0;
    state.infected = 0;
    state.levelIndex = 0;
    state.qIndex = 0;
    state.powers = { hint: true, freeze: true, fifty: true };
    state.investLeft = GAME_CONTENT.level3.investigateTokens;
    state.current = null;
    state.awaiting = false;
    updatePowerButtons();
    updateHud();
  }

  function updatePowerButtons() {
    ["hint", "freeze", "fifty"].forEach((k) => {
      const btn = $(`pwr-${k}`);
      btn.disabled = !state.powers[k];
      btn.classList.toggle("used", !state.powers[k]);
    });
  }

  function beginLevel() {
    const key = levels[state.levelIndex];
    const meta = GAME_CONTENT[key];
    FakeOutAudio.levelUp();
    $("level-kicker").textContent = meta.kicker;
    $("level-title").textContent = meta.title;
    $("level-desc").textContent = meta.desc;
    show("level");
    updateHud();
  }

  function startLevelPlay() {
    state.qIndex = 0;
    if (levels[state.levelIndex] === "level3") {
      state.investLeft = GAME_CONTENT.level3.investigateTokens;
    }
    showQuestion();
  }

  function currentItems() {
    const key = levels[state.levelIndex];
    if (key === "level1") return GAME_CONTENT.level1.cards;
    if (key === "level2") return GAME_CONTENT.level2.rounds;
    if (key === "level3") return GAME_CONTENT.level3.posts;
    return GAME_CONTENT.boss.items;
  }

  function showQuestion() {
    const key = levels[state.levelIndex];
    const items = currentItems();
    if (state.qIndex >= items.length) {
      state.levelIndex += 1;
      if (state.levelIndex >= levels.length) {
        endVictory();
      } else {
        beginLevel();
      }
      return;
    }

    state.current = items[state.qIndex];
    state.awaiting = false;
    show("play");
    updateHud();

    const meta = GAME_CONTENT[key];
    $("play-level-tag").textContent = meta.title;
    $("play-progress").textContent = `${state.qIndex + 1} / ${items.length}`;
    $("hint-line").hidden = true;
    $("hint-line").textContent = "";
    $("invest-result").hidden = true;
    $("invest-result").textContent = "";

    const viralOn = key === "level3";
    $("viral-meter").hidden = !viralOn;
    $("investigate-row").hidden = !viralOn;
    if (viralOn) {
      $("invest-count").textContent = String(state.investLeft);
      updateViral();
    }

    const body = $("prompt-body");
    const kind = $("prompt-kind");
    const choices = $("choices");
    choices.innerHTML = "";
    choices.className = "choices";

    if (key === "level1") {
      kind.textContent = "Sort this card";
      body.innerHTML = `<p class="scenario">${escapeHtml(state.current.text)}</p>`;
      choices.classList.add("bins");
      [
        ["mis", "Misinformation", "False · no harm meant"],
        ["dis", "Disinformation", "False · on purpose"],
        ["mal", "Malinformation", "True · used to harm"],
      ].forEach(([id, title, desc]) => {
        choices.appendChild(makeChoice(id, `<span class="bin-title">${title}</span><span class="bin-desc">${desc}</span>`));
      });
    } else if (key === "level2") {
      kind.textContent = "Name the trick";
      body.innerHTML = `<p class="scenario">${escapeHtml(state.current.text)}</p>`;
      const opts = buildOptions(GAME_CONTENT.level2.tactics, state.current.answer, 4);
      opts.forEach((t) => choices.appendChild(makeChoice(t, escapeHtml(t))));
    } else if (key === "level3") {
      kind.textContent = "Feed Detective";
      const p = state.current;
      body.innerHTML = `
        <div class="feed-post">
          <div class="who">
            <div class="avatar">${escapeHtml(p.avatar)}</div>
            <div>
              <div class="handle">${escapeHtml(p.who)}</div>
              <div class="meta">${escapeHtml(p.handle)} · ${escapeHtml(p.time)}</div>
            </div>
          </div>
          <p class="caption">${escapeHtml(p.caption)}</p>
          <span class="tag">#HKStudents #CampusFeed</span>
        </div>`;
      choices.appendChild(makeChoice("share", "🔁 Share"));
      choices.appendChild(makeChoice("flag", "🚩 Flag"));
    } else {
      kind.textContent = "Real or AI? · double points";
      body.innerHTML = `<p class="scenario">${escapeHtml(state.current.text)}</p>`;
      choices.appendChild(makeChoice("real", "✅ Genuine"));
      choices.appendChild(makeChoice("ai", "🤖 AI-fabricated"));
    }

    updatePowerButtons();
    startTimer(meta.timer);
  }

  function buildOptions(pool, answer, n) {
    const others = pool.filter((x) => x !== answer);
    shuffle(others);
    const picks = [answer, ...others.slice(0, n - 1)];
    return shuffle(picks);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function makeChoice(value, html) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.dataset.value = value;
    btn.innerHTML = html;
    btn.addEventListener("click", () => {
      FakeOutAudio.click();
      submitAnswer(value, btn);
    });
    return btn;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function updateViral() {
    const max = 25000;
    const pct = Math.min(100, (state.infected / max) * 100);
    $("viral-fill").style.width = `${pct}%`;
    $("viral-count").textContent = state.infected.toLocaleString();
  }

  function grade(value) {
    const key = levels[state.levelIndex];
    const q = state.current;
    if (key === "level1") {
      const ok = value === q.answer;
      return {
        ok,
        explain: ok
          ? q.explain
          : `Not quite. Correct bin: ${labelBin(q.answer)}. ${q.explain}`,
      };
    }
    if (key === "level2") {
      const ok = value === q.answer;
      return {
        ok,
        explain: ok ? q.explain : `The tactic was “${q.answer}”. ${q.explain}`,
      };
    }
    if (key === "level3") {
      const choseFlag = value === "flag";
      const ok = choseFlag === q.shouldFlag;
      let explain;
      if (ok && q.shouldFlag) explain = q.explainRightFlag;
      else if (ok && !q.shouldFlag) explain = q.explainRightShare;
      else if (!ok && q.shouldFlag) explain = q.explainWrongShare;
      else explain = q.explainWrongFlag;
      return { ok, explain, sharedFake: !ok && q.shouldFlag && value === "share" };
    }
    const ok = value === q.answer;
    return {
      ok,
      explain: ok ? q.explain : `It was ${q.answer === "ai" ? "AI-fabricated" : "genuine"}. ${q.explain}`,
      boss: true,
    };
  }

  function labelBin(a) {
    return { mis: "Misinformation", dis: "Disinformation", mal: "Malinformation" }[a] || a;
  }

  function submitAnswer(value, btn) {
    if (state.awaiting || state.phase !== "play") return;
    state.awaiting = true;
    clearTimer();

    const result = grade(value);
    const buttons = [...$("choices").querySelectorAll(".choice")];
    buttons.forEach((b) => (b.disabled = true));

    state.answered += 1;
    let gained = 0;

    if (result.ok) {
      btn.classList.add("correct");
      state.correct += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const mult = multiplier();
      const base = 100;
      gained = (base + speedBonus()) * mult;
      if (result.boss) gained *= 2; // boss round: points doubled
      state.score += gained;
      FakeOutAudio.correct();
      if (state.streak >= 2) FakeOutAudio.combo(state.streak);
    } else {
      btn.classList.add("wrong");
      state.streak = 0;
      state.lives -= 1;
      FakeOutAudio.wrong();
      if (result.sharedFake) {
        state.infected += state.current.infect || 0;
        updateViral();
      }
      const right = buttons.find((b) => {
        const key = levels[state.levelIndex];
        if (key === "level3") {
          const need = state.current.shouldFlag ? "flag" : "share";
          return b.dataset.value === need;
        }
        if (key === "boss") return b.dataset.value === state.current.answer;
        if (key === "level1") return b.dataset.value === state.current.answer;
        return b.dataset.value === state.current.answer;
      });
      if (right) right.classList.add("correct");
    }

    updateHud();

    setTimeout(() => {
      if (state.lives <= 0) {
        showExplain(result, gained, true);
      } else {
        showExplain(result, gained, false);
      }
    }, 450);
  }

  function onTimeout() {
    if (state.awaiting) return;
    state.awaiting = true;
    const buttons = [...$("choices").querySelectorAll(".choice")];
    buttons.forEach((b) => (b.disabled = true));
    state.answered += 1;
    state.streak = 0;
    state.lives -= 1;
    FakeOutAudio.wrong();
    updateHud();
    const key = levels[state.levelIndex];
    let explain = "Time’s up! Slow answers still need a careful read — try the power-ups next time.";
    if (key === "level1") explain = `Time’s up. Correct bin: ${labelBin(state.current.answer)}. ${state.current.explain}`;
    if (key === "level2") explain = `Time’s up. Tactic: ${state.current.answer}. ${state.current.explain}`;
    if (key === "level3") {
      explain = state.current.shouldFlag
        ? `Time’s up — this one should have been flagged. ${state.current.explainRightFlag}`
        : `Time’s up — this one was fine to share. ${state.current.explainRightShare}`;
    }
    if (key === "boss") {
      explain = `Time’s up. It was ${state.current.answer === "ai" ? "AI-fabricated" : "genuine"}. ${state.current.explain}`;
    }
    setTimeout(() => {
      showExplain({ ok: false, explain }, 0, state.lives <= 0);
    }, 300);
  }

  function showExplain(result, gained, gameOverNext) {
    show("explain");
    const badge = $("explain-badge");
    badge.textContent = result.ok ? "Nice one! ✅" : "Aiya… not quite ❌";
    badge.className = "explain-badge " + (result.ok ? "ok" : "no");
    $("explain-text").textContent = result.explain;
    $("explain-points").textContent = result.ok
      ? `+${gained} pts · streak ${state.streak} · combo ×${multiplier()}`
      : `Hearts left: ${state.lives}`;
    $("explain-next").dataset.gameOver = gameOverNext ? "1" : "0";
    updateHud();
  }

  function afterExplain() {
    if ($("explain-next").dataset.gameOver === "1") {
      endGameOver();
      return;
    }
    state.qIndex += 1;
    showQuestion();
  }

  function endGameOver() {
    FakeOutAudio.gameOver();
    $("over-score").textContent = String(state.score);
    $("over-msg").textContent = `Hey ${state.nick}, out of hearts! The rumours win this round — try again and beat your streak.`;
    show("over");
    updateHud();
  }

  function endVictory() {
    FakeOutAudio.victory();
    const acc = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
    const rank = [...GAME_CONTENT.ranks].reverse().find((r) => state.score >= r.min) || GAME_CONTENT.ranks[0];
    const isNew = saveHigh(state.score, state.nick);
    $("results-kicker").textContent = "Round complete · 唔該晒!";
    $("rank-title").textContent = rank.title;
    $("results-nick").textContent = `${state.nick} · ${rank.blurb}`;
    $("res-score").textContent = String(state.score);
    $("res-acc").textContent = `${acc}%`;
    $("res-streak").textContent = String(state.bestStreak);
    $("res-infect").textContent = state.infected.toLocaleString();
    $("new-best").hidden = !isNew;
    show("results");
    updateHud();
  }

  /* Power-ups */
  function useHint() {
    if (!state.powers.hint || state.phase !== "play" || state.awaiting) return;
    state.powers.hint = false;
    updatePowerButtons();
    FakeOutAudio.powerup();
    const q = state.current;
    const line = $("hint-line");
    line.hidden = false;
    line.textContent = "🔍 Lens: " + (q.hint || q.investigate || "Look for intent, source, and weird urgency.");
  }

  function useFreeze() {
    if (!state.powers.freeze || state.phase !== "play" || state.awaiting) return;
    state.powers.freeze = false;
    state.frozen = true;
    updatePowerButtons();
    FakeOutAudio.powerup();
    setTimeout(() => {
      state.frozen = false;
    }, 5000);
  }

  function useFifty() {
    if (!state.powers.fifty || state.phase !== "play" || state.awaiting) return;
    const key = levels[state.levelIndex];
    if (key === "level3" || key === "boss") return; // only 2 options
    const buttons = [...$("choices").querySelectorAll(".choice:not(.removed)")];
    if (buttons.length <= 2) return;
    state.powers.fifty = false;
    updatePowerButtons();
    FakeOutAudio.powerup();
    const answer = state.current.answer;
    const wrongs = buttons.filter((b) => b.dataset.value !== answer);
    shuffle(wrongs)
      .slice(0, 2)
      .forEach((b) => {
        b.classList.add("removed");
        b.disabled = true;
      });
  }

  function useInvestigate() {
    if (levels[state.levelIndex] !== "level3" || state.awaiting) return;
    if (state.investLeft <= 0) return;
    state.investLeft -= 1;
    $("invest-count").textContent = String(state.investLeft);
    FakeOutAudio.powerup();
    const box = $("invest-result");
    box.hidden = false;
    box.textContent = "🔎 Investigate: " + state.current.investigate;
  }

  /* Wire UI */
  function syncMuteBtn() {
    const m = FakeOutAudio.isMuted();
    $("mute-btn").textContent = m ? "🔇" : "🔊";
    $("mute-btn").setAttribute("aria-pressed", m ? "true" : "false");
    $("mute-btn").setAttribute("aria-label", m ? "Unmute sounds" : "Mute sounds");
  }

  $("mute-btn").addEventListener("click", () => {
    FakeOutAudio.setMuted(!FakeOutAudio.isMuted());
    syncMuteBtn();
    if (!FakeOutAudio.isMuted()) FakeOutAudio.click();
  });

  $("nick-form").addEventListener("submit", (e) => {
    e.preventDefault();
    FakeOutAudio.unlock();
    FakeOutAudio.click();
    const nick = $("nickname").value.trim().slice(0, 16);
    if (!nick) return;
    state.nick = nick;
    try {
      localStorage.setItem(NICK_KEY, nick);
    } catch (_) {}
    resetGame();
    beginLevel();
  });

  $("level-start-btn").addEventListener("click", () => {
    FakeOutAudio.click();
    startLevelPlay();
  });

  $("explain-next").addEventListener("click", () => {
    FakeOutAudio.click();
    afterExplain();
  });

  $("retry-btn").addEventListener("click", () => {
    FakeOutAudio.click();
    resetGame();
    beginLevel();
  });

  $("over-home-btn").addEventListener("click", () => {
    FakeOutAudio.click();
    clearTimer();
    show("start");
    updateHud();
    renderHigh();
  });

  $("again-btn").addEventListener("click", () => {
    FakeOutAudio.click();
    resetGame();
    beginLevel();
  });

  $("pwr-hint").addEventListener("click", useHint);
  $("pwr-freeze").addEventListener("click", useFreeze);
  $("pwr-fifty").addEventListener("click", useFifty);
  $("invest-btn").addEventListener("click", useInvestigate);

  /* Boot */
  FakeOutAudio.loadMutePref();
  syncMuteBtn();
  renderHigh();
  try {
    const saved = localStorage.getItem(NICK_KEY);
    if (saved) $("nickname").value = saved;
  } catch (_) {}
  updateHud();
})();
