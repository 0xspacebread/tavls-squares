/* Tavls Squares — football squares prototype. Vanilla JS, no backend. */
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => '$' + Number(n).toLocaleString();
  const initials = n => { const p = String(n).trim().split(/\s+/); return (p.length > 1 ? p[0][0] + p[1][0] : String(n).slice(0, 2)).toUpperCase(); };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

  const HOUSE = 0.10; // Tavls keeps 10% of the pool; 90% goes to winners
  const PERIODS = [['Q1', 'End of 1st Quarter'], ['Half', 'Halftime'], ['Q3', 'End of 3rd Quarter'], ['Final', 'Final Score']];
  const payoutFor = (g, i) => Math.round(g.fee * 100 * (1 - HOUSE) * g.splits[i]);
  const ROSTER = ['Marcus', 'Yolanda', 'Devon', 'Patrice', 'Renee', 'Anthony', 'Jordan', 'Casey', 'Sam', 'Alex', 'Riley', 'Taylor', 'Mike', 'Nina', 'Omar', 'Lena', 'Chris', 'Dana', 'Kofi', 'Priya'];

  // NFL Week 1 — away team = columns, home team = rows
  const GAMES = [
    { id: 'ne-sea', a: 'Patriots', h: 'Seahawks', aA: 'NE', hA: 'SEA', aC: '#294d80', hC: '#69BE28', when: 'Wed · Sep 9 · 8:20 PM ET', fee: 25, splits: [.25, .25, .25, .25] },
    { id: 'sf-lar', a: '49ers', h: 'Rams', aA: 'SF', hA: 'LAR', aC: '#AA0000', hC: '#1a4ea0', when: 'Thu · Sep 10 · 8:35 PM ET', fee: 10, splits: [.25, .25, .25, .25] },
    { id: 'no-det', a: 'Saints', h: 'Lions', aA: 'NO', hA: 'DET', aC: '#b3974f', hC: '#0076B6', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 5, splits: [.15, .30, .20, .35] },
    { id: 'bal-ind', a: 'Ravens', h: 'Colts', aA: 'BAL', hA: 'IND', aC: '#4731a0', hC: '#2667a8', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 50, splits: [.25, .25, .25, .25] },
    { id: 'nyj-ten', a: 'Jets', h: 'Titans', aA: 'NYJ', hA: 'TEN', aC: '#1c6b4a', hC: '#4B92DB', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 10, splits: [.20, .20, .15, .45] },
    { id: 'atl-pit', a: 'Falcons', h: 'Steelers', aA: 'ATL', hA: 'PIT', aC: '#C8102E', hC: '#c69214', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 20, splits: [.25, .25, .25, .25] },
    { id: 'tb-cin', a: 'Buccaneers', h: 'Bengals', aA: 'TB', hA: 'CIN', aC: '#D50A0A', hC: '#FB4F14', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 100, splits: [.10, .25, .15, .50] },
    { id: 'cle-jax', a: 'Browns', h: 'Jaguars', aA: 'CLE', hA: 'JAX', aC: '#7a4a22', hC: '#008197', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 5, splits: [.25, .25, .25, .25] },
    { id: 'buf-hou', a: 'Bills', h: 'Texans', aA: 'BUF', hA: 'HOU', aC: '#00338D', hC: '#2a5670', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 250, splits: [.20, .30, .20, .30] },
    { id: 'chi-car', a: 'Bears', h: 'Panthers', aA: 'CHI', hA: 'CAR', aC: '#C83803', hC: '#0085CA', when: 'Sun · Sep 13 · 1:00 PM ET', fee: 10, splits: [.25, .25, .25, .25] },
    { id: 'gb-min', a: 'Packers', h: 'Vikings', aA: 'GB', hA: 'MIN', aC: '#2c5038', hC: '#5a2d96', when: 'Sun · Sep 13 · 4:25 PM ET', fee: 500, splits: [.15, .20, .25, .40] },
    { id: 'ari-lac', a: 'Cardinals', h: 'Chargers', aA: 'ARI', hA: 'LAC', aC: '#b51e44', hC: '#0098d8', when: 'Sun · Sep 13 · 4:25 PM ET', fee: 20, splits: [.25, .25, .25, .25] },
    { id: 'mia-lv', a: 'Dolphins', h: 'Raiders', aA: 'MIA', hA: 'LV', aC: '#009aa6', hC: '#6b7075', when: 'Sun · Sep 13 · 4:25 PM ET', fee: 50, splits: [.30, .15, .20, .35] },
    { id: 'was-phi', a: 'Commanders', h: 'Eagles', aA: 'WAS', hA: 'PHI', aC: '#7c1f1f', hC: '#186a72', when: 'Sun · Sep 13 · 4:25 PM ET', fee: 100, splits: [.25, .25, .25, .25] },
    { id: 'dal-nyg', a: 'Cowboys', h: 'Giants', aA: 'DAL', hA: 'NYG', aC: '#2a4d80', hC: '#14306e', when: 'Sun · Sep 13 · 8:20 PM ET · SNF', fee: 1000, splits: [.10, .20, .20, .50] },
    { id: 'den-kc', a: 'Broncos', h: 'Chiefs', aA: 'DEN', hA: 'KC', aC: '#FB4F14', hC: '#E31837', when: 'Mon · Sep 14 · 8:15 PM ET · MNF', fee: 100, splits: [.20, .25, .20, .35] },
  ];

  const SVG = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICONS = {
    grid: SVG('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
    ticket: SVG('<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/><path d="M9 5.5v8" stroke-dasharray="2 2"/>'),
    trophy: SVG('<path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3"/><path d="M12 12v4M9 20h6M10 20v-2h4v2"/>'),
    help: SVG('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.4-1.4 1-1.4 1.9v.3"/><path d="M12 17.5h.01"/>'),
  };

  const freshBoard = () => ({ squares: Array(100).fill(null), colNums: null, rowNums: null, locked: false, justGen: false, results: {},
    scores: { Q1: { a: 7, b: 3 }, Half: { a: 14, b: 10 }, Q3: { a: 21, b: 17 }, Final: { a: 24, b: 20 } } });

  const state = { tab: 'board', you: 'You', balance: 250, currentGame: GAMES[0].id, boards: {} };
  function B() { return state.boards[state.currentGame] || (state.boards[state.currentGame] = freshBoard()); }
  const game = () => GAMES.find(g => g.id === state.currentGame);

  const filledOf = bd => bd ? bd.squares.filter(s => s && !(s.mine && s.pending)).length : 0;
  const filled = () => filledOf(B());
  const pending = () => B().squares.filter(s => s && s.mine && s.pending).length;
  const mineCount = () => B().squares.filter(s => s && s.mine && !s.pending).length;
  const pot = () => filled() * game().fee;

  function toast(msg, win) { const t = $('#toast'); t.textContent = msg; t.className = 'toast show' + (win ? ' win' : ''); setTimeout(() => { t.className = 'toast' + (win ? ' win' : ''); }, 2800); }

  /* ---------- nav ---------- */
  const TABS = [['board', 'Squares', 'grid'], ['picks', 'My Picks', 'ticket'], ['rules', 'How to play', 'help']];
  function renderNav() {
    $('#sideTabs').innerHTML = TABS.map(([id, label, ic]) =>
      `<button class="side-tab ${state.tab === id ? 'active' : ''}" data-tab="${id}"><span class="st-ic">${ICONS[ic]}</span>${label}</button>`).join('');
    const mb = document.getElementById('mBottom');
    if (mb) mb.innerHTML = TABS.map(([id, label, ic]) =>
      `<button class="m-tab ${state.tab === id ? 'active' : ''}" data-tab="${id}"><span class="m-ic">${ICONS[ic]}</span><small>${label === 'How to play' ? 'Rules' : label}</small></button>`).join('');
  }

  function winIdx(bd, a, b) { if (!bd.colNums) return -1; const c = bd.colNums.indexOf(a % 10), r = bd.rowNums.indexOf(b % 10); return (c < 0 || r < 0) ? -1 : r * 10 + c; }
  function winners(bd) { const m = {}; Object.entries(bd.results).forEach(([p, res]) => { (m[res.idx] = m[res.idx] || []).push(p); }); return m; }

  /* ---------- render ---------- */
  function render() {
    renderNav();
    const handle = '@' + (state.you || 'you').toLowerCase().replace(/\s+/g, ''), bal = '$' + Number(state.balance).toFixed(2);
    $('#sideUser').textContent = handle; $('#sideBal').textContent = bal;
    const mu = document.getElementById('mUser'); if (mu) mu.textContent = handle;
    const mbl = document.getElementById('mBal'); if (mbl) mbl.textContent = bal;
    const gsOld = document.getElementById('gamesStrip'); const prevScroll = gsOld ? gsOld.scrollLeft : 0;
    $('#view').innerHTML = ({ board: viewBoard, picks: viewPicks, rules: viewRules })[state.tab]();
    const gs = document.getElementById('gamesStrip'); if (gs) gs.scrollLeft = prevScroll;
  }

  function gameStrip() {
    const cards = GAMES.map(g => {
      const f = filledOf(state.boards[g.id]); const lk = state.boards[g.id] && state.boards[g.id].locked;
      return `<div class="game-card ${g.id === state.currentGame ? 'active' : ''}" data-game="${g.id}">
        <div class="gc-teams"><span class="gc-dot" style="background:${g.aC}">${g.aA}</span><span class="gc-at">@</span><span class="gc-dot" style="background:${g.hC}">${g.hA}</span></div>
        <div class="gc-when">${g.when}</div>
        <div class="gc-fill">${money(g.fee)} · ${f}/100${lk ? ' · LOCKED' : ''}</div></div>`;
    }).join('');
    const chev = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
    return `<div class="games-bar">
      <button class="strip-arrow left" data-strip="-1">${chev('M15 18l-6-6 6-6')}</button>
      <div class="games-strip" id="gamesStrip">${cards}</div>
      <button class="strip-arrow right" data-strip="1">${chev('M9 18l6-6-6-6')}</button>
    </div>`;
  }

  function viewBoard() {
    const g = game(), bd = B(), f = filled(), locked = bd.locked;
    const head = `<div class="contest-card">
      <div class="cc-top">
        <div class="matchup">
          <div class="team"><span class="dot" style="background:${g.aC};color:#fff">${g.aA}</span><div><div class="tn">${g.a}</div><div class="tx">Away · columns</div></div></div>
          <span class="at">@</span>
          <div class="team"><span class="dot" style="background:${g.hC};color:#fff">${g.hA}</span><div><div class="tn">${g.h}</div><div class="tx">Home · rows</div></div></div>
        </div>
        <div class="status-pill ${locked ? 'locked' : 'live'}">${locked ? 'LOCKED · NUMBERS SET' : 'FILLING · ' + f + '/100'}</div>
      </div>
      <div class="cc-meta">
        <div class="cc-stat"><div class="l">Kickoff</div><div class="v" style="font-size:14px">${g.when}</div></div>
        <div class="cc-stat"><div class="l">Entry / square</div><div class="v">${money(g.fee)}</div></div>
        <div class="cc-stat"><div class="l">Squares filled</div><div class="v">${f}<span style="color:var(--muted);font-size:14px">/100</span></div></div>
        <div class="cc-stat"><div class="l">Your squares</div><div class="v orange">${mineCount()}</div></div>
        <div class="cc-stat"><div class="l">Prize pool</div><div class="v">${money(Math.round(g.fee * 100 * (1 - HOUSE)))}</div></div>
      </div>
      <div class="payouts">${PERIODS.map(([k, lbl], i) => `<div class="payout-chip">${lbl}<b>${money(payoutFor(g, i))}</b></div>`).join('')}
        <div class="payout-chip house">Tavls fee · 10%<b>${money(g.fee * 100 * HOUSE)}</b></div></div>
    </div>`;

    const controls = `<div class="controls">
      <input id="nameInput" value="${esc(state.you)}" ${locked ? 'disabled' : ''} placeholder="Your name" maxlength="14" />
      <button class="btn ghost sm" data-act="mine10" ${locked ? 'disabled' : ''}>+ Select 5 for me</button>
      <button class="btn ghost sm" data-act="fill" ${locked ? 'disabled' : ''}>Fill remaining (others)</button>
      <button class="btn sm" data-act="lock" ${locked || f === 0 ? 'disabled' : ''}>Lock &amp; generate numbers</button>
      <button class="btn ghost sm" data-act="reset">Reset board</button>
      <div class="fill-progress"><div class="bar"><i style="width:${f}%"></i></div>${f}%</div>
    </div>`;

    const eb = (!locked && pending() > 0)
      ? `<div class="enter-bar"><div class="eb-info"><b>${pending()}</b> square${pending() > 1 ? 's' : ''} selected <span>· pay ${money(pending() * g.fee)}</span></div>
         <button class="btn" data-act="enter">Enter contest — ${money(pending() * g.fee)}</button></div>` : '';

    return gameStrip() + head + controls + `<div class="board-wrap">${boardHtml(bd, g)}</div>` + (locked ? scorePanel(bd) : '') + eb;
  }

  function boardHtml(bd, g) {
    const wins = winners(bd);
    let h = '<div class="board">';
    h += `<div class="cell corner"><span class="ca">${g.aA} →</span><span class="cb">${g.hA} ↓</span></div>`;
    for (let c = 0; c < 10; c++) { const n = bd.colNums ? bd.colNums[c] : '?'; h += `<div class="cell axis col ${bd.colNums ? '' : 'q'} ${bd.justGen ? 'reveal' : ''}" style="animation-delay:${c * 55}ms">${n}</div>`; }
    for (let r = 0; r < 10; r++) {
      const n = bd.rowNums ? bd.rowNums[r] : '?';
      h += `<div class="cell axis row ${bd.rowNums ? '' : 'q'} ${bd.justGen ? 'reveal' : ''}" style="animation-delay:${(10 + r) * 55}ms">${n}</div>`;
      for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c, sq = bd.squares[idx], won = wins[idx];
        if (sq) {
          const cls = sq.mine ? (sq.pending ? 'mine pending' : 'mine') : 'other';
          h += `<div class="cell sq ${sq.pending ? '' : 'taken'} ${cls} ${won ? 'win' : ''}" title="${esc(sq.name)}" data-sq="${idx}">
            ${won ? `<span class="wbadge">${won.join('·')}</span>` : ''}<span class="ini">${esc(sq.ini)}</span><span class="nm">${esc(sq.name)}</span></div>`;
        } else h += `<div class="cell sq ${bd.locked ? 'locked-empty' : ''} ${won ? 'win' : ''}" data-sq="${idx}"><span class="sq-plus">+</span></div>`;
      }
    }
    return h + '</div>';
  }

  function scorePanel(bd) {
    const g = game();
    return `<div class="score-panel"><h3>Live scoring</h3>
      <p style="color:var(--muted);font-size:13px;margin:6px 0 0">Enter each team's score — the winning square is found from the last digit of each score.</p>
      <div class="score-grid">${PERIODS.map(([k, lbl], i) => { const sc = bd.scores[k], res = bd.results[k];
        return `<div class="score-cell"><h4>${lbl}</h4><div class="pay">${money(payoutFor(g, i))}</div>
          <div class="score-inputs"><input data-score="${k}.a" value="${sc.a}" maxlength="3"><span>${g.aA}</span><span style="color:var(--muted)">—</span><input data-score="${k}.b" value="${sc.b}" maxlength="3"><span>${g.hA}</span></div>
          <button class="btn sm" style="width:100%" data-settle="${k}">${res ? 'Re-settle' : 'Settle ' + k}</button>
          ${res ? `<div class="winner">Winner: <b>${esc(res.name)}</b> · (${res.a % 10},${res.b % 10}) · ${money(res.pay)}</div>` : ''}</div>`;
      }).join('')}</div></div>`;
  }

  function viewPicks() {
    let html = `<div class="page-h"><div><h1>My Picks</h1><div class="sub">Every square you've entered across NFL Week 1</div></div></div>`;
    let any = false;
    GAMES.forEach(g => {
      const bd = state.boards[g.id]; if (!bd) return;
      const mine = []; bd.squares.forEach((s, i) => { if (s && s.mine && !s.pending) mine.push(i); });
      if (!mine.length) return; any = true;
      html += `<div class="picks-game"><div class="picks-game-head">
        <span class="gc-dot" style="background:${g.aC}">${g.aA}</span><span class="gc-at">@</span><span class="gc-dot" style="background:${g.hC}">${g.hA}</span>
        <strong style="font-size:15px">${g.a} @ ${g.h}</strong><span class="gc-when">${g.when}</span></div>`;
      mine.forEach(idx => {
        const c = idx % 10, r = Math.floor(idx / 10);
        if (bd.colNums) {
          const ad = bd.colNums[c], hd = bd.rowNums[r];
          html += `<div class="pick-row">
            <div class="pick-sq"><span style="color:var(--teamA)">${ad}</span><span style="color:var(--teamB)">${hd}</span></div>
            <div class="pick-need"><div class="nl">This square hits when, at the end of a period:</div>
              <div class="nv"><span>${g.a} ends in</span><span class="digit a">${ad}</span><span>and ${g.h} ends in</span><span class="digit b">${hd}</span></div></div>
            <div style="text-align:right"><div class="nl" style="font-size:11px">Pays up to</div><div style="color:var(--green);font-weight:800">${money(Math.max(...PERIODS.map((_, i) => payoutFor(g, i))))}</div></div></div>`;
        } else {
          html += `<div class="pick-row"><div class="pick-sq">?<span>?</span></div>
            <div class="pick-need"><div class="pick-pending">Your numbers are assigned once this board fills up. Check back after kickoff is locked.</div></div></div>`;
        }
      });
      html += `</div>`;
    });
    if (!any) html += `<div class="list-card"><div class="empty">You haven't entered any squares yet.<br>Go to <b>Squares</b>, pick some, and hit <b>Enter contest</b>.</div></div>`;
    return html;
  }

  function viewRules() {
    const g = game();
    return `<div class="page-h"><div><h1>How to play</h1><div class="sub">Football Squares on Tavls</div></div></div>
      <div class="rules">
        <p>A <b>10×10 board</b> has 100 squares. The away team runs along the <b>columns</b>, the home team down the <b>rows</b>.</p>
        <h3>1. Pick your squares</h3><p>Pick any open squares — your initials show instantly. Each square's price depends on the contest (this one is ${money(g.fee)}). When you're ready, hit <b>Enter contest</b> to lock them in — your balance updates right away.</p>
        <h3>2. Numbers drop</h3><p>Once the board <b>fills up</b>, digits <b>0–9 are randomly assigned</b> to each axis — every digit exactly once. This happens <b>after</b> squares are taken, so it's completely fair, and numbers never change once set.</p>
        <h3>3. Win every period</h3><p>At the end of each scoring period, only the <b>last digit</b> of each team's score matters. The four periods are <b>End of 1st Quarter</b>, <b>Halftime</b>, <b>End of 3rd Quarter</b>, and <b>Final Score</b>. Your <b>My Picks</b> tab shows exactly which digits you need.</p>
        <h3>What counts as the "Final Score"?</h3>
        <p>The <b>Final Score</b> is the score when the <b>game is actually over</b> — not necessarily the end of the 4th quarter. If a game goes to <b>overtime</b>, the 4th-quarter score does <b>not</b> decide the final-score winner; the winning number is taken at the <b>end of overtime</b>. If there's no overtime, the final score is simply the score at the end of regulation.</p>
        <h3>Payouts</h3>
        <p>The full pool is <b>${money(g.fee)} × 100 squares = ${money(g.fee * 100)}</b>. Tavls keeps <b>10%</b> (${money(g.fee * 100 * HOUSE)}); the remaining <b>90%</b> (${money(g.fee * 100 * (1 - HOUSE))}) is paid to winners across the four periods. Most contests split it evenly, but some weight certain periods more heavily — check each game's payout chips. For this game:</p>
        <ul>${PERIODS.map(([k, lbl], i) => `<li>${lbl}: <b>${money(payoutFor(g, i))}</b></li>`).join('')}</ul>
        <p style="color:var(--muted);font-size:13px">A single square can win multiple periods if the score endings repeat.</p>
      </div>`;
  }

  /* ---------- actions ---------- */
  function claim(idx) {
    const bd = B();
    if (bd.locked) return toast('Board is locked — squares are final');
    const sq = bd.squares[idx];
    if (sq && sq.mine && sq.pending) { bd.squares[idx] = null; return render(); }
    if (sq && sq.mine) return toast("You've already entered that square");
    if (sq) return toast('That square is already taken');
    bd.squares[idx] = { name: state.you || 'You', ini: initials(state.you || 'You'), mine: true, pending: true };
    render();
  }
  function claimMany(n, mine) {
    const bd = B(), open = []; bd.squares.forEach((s, i) => { if (!s) open.push(i); });
    shuffle(open).slice(0, n).forEach(i => {
      bd.squares[i] = mine ? { name: state.you || 'You', ini: initials(state.you || 'You'), mine: true, pending: true }
        : (p => ({ name: p, ini: initials(p), mine: false, pending: false }))(ROSTER[Math.floor(Math.random() * ROSTER.length)]);
    });
    if (!mine && filled() >= 100 && !bd.colNums) return generateNumbers();
    render();
  }
  function enterContest() {
    const bd = B(), ps = []; bd.squares.forEach((s, i) => { if (s && s.mine && s.pending) ps.push(i); });
    if (!ps.length) return;
    const cost = ps.length * game().fee;
    if (state.balance < cost) return toast('Not enough balance');
    state.balance -= cost;
    ps.forEach(i => { bd.squares[i].pending = false; });
    render();
    showCongrats(ps.length, cost);
    if (filled() >= 100 && !bd.colNums) generateNumbers();
  }
  function showCongrats(count, cost) {
    const colors = ['#FF5C00', '#ffb15c', '#e8b923', '#39d0d8', '#ffffff', '#16c784'];
    let pieces = '';
    for (let i = 0; i < 90; i++) { const c = colors[i % colors.length], left = Math.random() * 100, dur = 1.9 + Math.random() * 1.8, delay = Math.random() * .5, w = 7 + Math.random() * 6;
      pieces += `<span class="confetti" style="left:${left}%;background:${c};width:${w}px;height:${w * 1.4}px;animation-duration:${dur}s;animation-delay:${delay}s"></span>`; }
    $('#congrats').innerHTML = `<img src="assets/blu-mascot.png" alt=""><h2>You're in!</h2>
      <p>You entered <span class="ce">${count} square${count > 1 ? 's' : ''}</span> for <span class="ce">${money(cost)}</span>.<br>Good luck — winning numbers drop when the board fills.</p>
      <button class="btn" data-act="closeConfetti">Let's go</button>`;
    const ov = $('#confetti'); ov.insertAdjacentHTML('afterbegin', pieces); ov.classList.remove('hidden');
    clearTimeout(showCongrats._t); showCongrats._t = setTimeout(closeConfetti, 5500);
  }
  function closeConfetti() { const ov = $('#confetti'); ov.classList.add('hidden'); ov.querySelectorAll('.confetti').forEach(e => e.remove()); }
  function generateNumbers() {
    const bd = B();
    bd.squares.forEach((s, i) => { if (s && s.pending) bd.squares[i] = null; });
    bd.colNums = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].slice());
    bd.rowNums = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].slice());
    bd.locked = true; bd.justGen = true;
    render(); toast('Board full — numbers locked in!', true);
    setTimeout(() => { bd.justGen = false; }, 1300);
  }
  function settle(period) {
    const bd = B(), sc = bd.scores[period], idx = winIdx(bd, sc.a, sc.b);
    if (idx < 0) return;
    const sq = bd.squares[idx], pay = payoutFor(game(), PERIODS.findIndex(p => p[0] === period));
    bd.results[period] = { idx, name: sq ? sq.name : 'No winner (open square)', pay, a: sc.a, b: sc.b };
    render(); toast(sq ? `${period}: ${sq.name} wins ${money(pay)}!` : `${period}: open square — no winner`, true);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    if (e.target.id === 'confetti') return closeConfetti();
    const st = e.target.closest('[data-strip]'); if (st) { const gs = document.getElementById('gamesStrip'); if (gs) gs.scrollLeft += 380 * (+st.dataset.strip); return; }
    const gc = e.target.closest('[data-game]'); if (gc) { state.currentGame = gc.dataset.game; return render(); }
    const tab = e.target.closest('[data-tab]'); if (tab) { state.tab = tab.dataset.tab; return render(); }
    const sq = e.target.closest('[data-sq]'); if (sq) return claim(+sq.dataset.sq);
    const act = e.target.closest('[data-act]'); if (act) {
      const a = act.dataset.act;
      if (a === 'mine10') return claimMany(5, true);
      if (a === 'fill') return claimMany(100, false);
      if (a === 'enter') return enterContest();
      if (a === 'closeConfetti') return closeConfetti();
      if (a === 'lock') { if (filled() === 0) return; return generateNumbers(); }
      if (a === 'reset') { state.boards[state.currentGame] = freshBoard(); return render(); }
    }
    const settleBtn = e.target.closest('[data-settle]'); if (settleBtn) return settle(settleBtn.dataset.settle);
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'nameInput') state.you = e.target.value || 'You';
    const sc = e.target.dataset && e.target.dataset.score;
    if (sc) { const [p, k] = sc.split('.'); B().scores[p][k] = parseInt(e.target.value, 10) || 0; }
  });
  document.addEventListener('wheel', e => {
    const strip = e.target.closest('.games-strip');
    if (strip && Math.abs(e.deltaY) > Math.abs(e.deltaX)) { strip.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });

  render();
})();
