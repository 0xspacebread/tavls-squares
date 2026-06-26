const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 800 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  const url = 'file://' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  const shot = async n => { await p.waitForTimeout(200); await p.screenshot({ path: `shots/${n}.png` }); };
  await p.goto(url);
  await shot('1-board-empty');
  await p.click('[data-act="mine10"]');                       // select 5 (pending)
  await shot('2-selected');
  await p.click('[data-act="enter"]');                        // enter contest -> confetti
  await p.waitForTimeout(450);
  await shot('2b-confetti');
  await p.click('[data-act="closeConfetti"]');
  await p.click('[data-act="fill"]');                          // fill rest -> auto-generate numbers
  await p.waitForTimeout(700);
  await shot('3-numbers-generated');
  await p.screenshot({ path: 'shots/3b-full.png', fullPage: true });
  await p.click('[data-settle="Q1"]'); await p.click('[data-settle="Final"]');
  await shot('4-settled');
  await p.click('[data-tab="picks"]'); await shot('5-picks');
  await p.click('[data-tab="rules"]'); await shot('6-rules');
  await p.click('[data-tab="board"]'); await p.click('[data-game="den-kc"]'); await shot('7-game-switch');

  // mobile pass
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  m.on('pageerror', e => errs.push('M PAGEERROR: ' + e.message));
  m.on('console', x => { if (x.type() === 'error') errs.push('M CONSOLE: ' + x.text()); });
  await m.goto(url);
  await m.waitForTimeout(250); await m.screenshot({ path: 'shots/m1-mobile.png' });
  await m.click('[data-act="mine10"]'); await m.click('[data-act="enter"]'); await m.waitForTimeout(400);
  await m.screenshot({ path: 'shots/m2-mobile-confetti.png' });
  await m.click('[data-act="closeConfetti"]');
  await m.click('.m-bottom [data-tab="rules"]'); await m.waitForTimeout(150); await m.screenshot({ path: 'shots/m3-mobile-rules.png' });
  await m.close();

  await b.close();
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'NO JS ERRORS ✓');
})();
