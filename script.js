// ============================================================
//  SUPER MARIO NEON - Complete Game Engine
//  Mobile-first, futuristic neon style
// ============================================================

(function () {
  'use strict';

  // ── CONSTANTS ────────────────────────────────────────────
  const TILE = 32;
  const GRAVITY = 0.55;
  const MAX_FALL = 14;
  const PLAYER_SPEED = 3.4;
  const JUMP_FORCE = -12.5;
  const FIRESPEED = 7;

  // ── COLORS (Neon palette) ─────────────────────────────────
  const C = {
    sky:       '#05050f',
    skyHorizon:'#0a0a22',
    ground:    '#0d1a33',
    groundTop: '#00f3ff',
    brick:     '#1a0533',
    brickLine: '#ff00aa',
    question:  '#1a1100',
    questionBorder: '#ffe600',
    pipe:      '#001a0d',
    pipeTop:   '#00ff88',
    mario:     '#ff4444',
    marioHat:  '#cc0000',
    marioBig:  '#ff6666',
    marioFire: '#ffe600',
    goomba:    '#cc6600',
    koopa:     '#006600',
    koopaNeon: '#00ff88',
    bullet:    '#ff00aa',
    fire:      '#ff6600',
    fireNeon:  '#ffe600',
    coin:      '#ffe600',
    coinGlow:  '#ffcc00',
    star:      '#ffe600',
    mushroom:  '#ff3333',
    flower:    '#ff66cc',
    flag:      '#00f3ff',
    pole:      '#aaaaaa',
    cloud:     '#101030',
    cloudBorder:'#00f3ff',
    neonBlue:  '#00f3ff',
    neonPink:  '#ff00aa',
    neonYellow:'#ffe600',
    neonGreen: '#00ff88',
    white:     '#ffffff',
    black:     '#000000',
    transparent:'rgba(0,0,0,0)',
  };

  // ── LEVEL DEFINITIONS ────────────────────────────────────
  // Each cell: 0=empty, G=ground, B=brick, Q=question, P=pipe, E=pipeEnd, M=goomba, K=koopa, C=coin, F=flagpole
  const LEVELS = [
    {
      name: '1-1', timeLimit: 300, bgColor: '#05050f',
      width: 220,
      tiles: buildLevel1(),
      enemies: [
        { type:'goomba', tx:22, ty:11 },
        { type:'goomba', tx:30, ty:11 },
        { type:'goomba', tx:35, ty:11 },
        { type:'koopa',  tx:45, ty:11 },
        { type:'goomba', tx:52, ty:11 },
        { type:'goomba', tx:60, ty:11 },
        { type:'koopa',  tx:70, ty:11 },
        { type:'goomba', tx:75, ty:11 },
        { type:'goomba', tx:80, ty:11 },
        { type:'koopa',  tx:90, ty:11 },
        { type:'goomba', tx:100,ty:11 },
        { type:'goomba', tx:110,ty:11 },
        { type:'koopa',  tx:120,ty:11 },
      ],
    },
    {
      name: '1-2', timeLimit: 300, bgColor: '#030318',
      width: 240,
      tiles: buildLevel2(),
      enemies: [
        { type:'goomba', tx:20, ty:11 },
        { type:'goomba', tx:28, ty:11 },
        { type:'koopa',  tx:38, ty:11 },
        { type:'goomba', tx:50, ty:11 },
        { type:'goomba', tx:55, ty:11 },
        { type:'koopa',  tx:65, ty:11 },
        { type:'goomba', tx:80, ty:11 },
        { type:'koopa',  tx:90, ty:11 },
        { type:'goomba', tx:100,ty:11 },
        { type:'goomba', tx:115,ty:11 },
        { type:'koopa',  tx:130,ty:11 },
        { type:'goomba', tx:140,ty:11 },
      ],
    },
    {
      name: '1-3', timeLimit: 250, bgColor: '#020210',
      width: 260,
      tiles: buildLevel3(),
      enemies: [
        { type:'goomba', tx:18, ty:11 },
        { type:'koopa',  tx:25, ty:11 },
        { type:'goomba', tx:35, ty:11 },
        { type:'goomba', tx:42, ty:11 },
        { type:'koopa',  tx:52, ty:11 },
        { type:'goomba', tx:62, ty:11 },
        { type:'koopa',  tx:72, ty:11 },
        { type:'goomba', tx:85, ty:11 },
        { type:'goomba', tx:90, ty:11 },
        { type:'koopa',  tx:100,ty:11 },
        { type:'goomba', tx:112,ty:11 },
        { type:'koopa',  tx:125,ty:11 },
        { type:'goomba', tx:135,ty:11 },
      ],
    },
  ];

  function buildLevel1() {
    const W = 220, H = 14;
    const g = Array.from({length:H}, () => Array(W).fill(0));
    // Ground row
    for (let x = 0; x < W - 10; x++) { g[13][x] = 'G'; g[12][x] = 'G'; }
    // Gap
    for (let x = W-10; x < W; x++) { g[13][x] = 'G'; g[12][x] = 'G'; }
    // Platforms and blocks
    setRow(g, [[5,'B'],[6,'B'],[7,'Q'],[8,'B']], 9);
    setRow(g, [[14,'B'],[15,'B'],[16,'B'],[17,'B']], 9);
    setBlock(g, 20, 7, 'Q');
    setBlock(g, 22, 5, 'Q');
    setBlock(g, 23, 5, 'B');
    setBlock(g, 24, 5, 'Q');
    setBlock(g, 25, 5, 'B');
    setBlock(g, 26, 5, 'Q');
    setBlock(g, 24, 7, 'Q');
    // Pipes
    setPipe(g, 29, 12, 2); setPipe(g, 38, 12, 3); setPipe(g, 48, 12, 4);
    // More platforms
    setRow(g, [[56,'B'],[57,'B'],[58,'B'],[59,'B'],[60,'B']], 8);
    setRow(g, [[65,'B'],[66,'Q'],[67,'B']], 8);
    setBlock(g, 70, 6, 'Q');
    setBlock(g, 73, 8, 'B'); setBlock(g, 74, 8, 'Q'); setBlock(g, 75, 8, 'B');
    setPipe(g, 82, 12, 2); setPipe(g, 92, 12, 3);
    setRow(g, [[95,'B'],[96,'B'],[97,'B'],[98,'Q'],[99,'B']], 7);
    setRow(g, [[102,'B'],[103,'B'],[104,'B'],[105,'B'],[106,'B'],[107,'B']], 9);
    setPipe(g, 110, 12, 2);
    setRow(g, [[115,'B'],[116,'Q'],[117,'B'],[118,'Q'],[119,'B']], 8);
    setBlock(g, 120, 5, 'Q');
    // Staircase approach to flag
    for (let s = 0; s < 8; s++) {
      for (let r = 0; r <= s; r++) { setBlock(g, W-18+s, 13-r, 'G'); }
    }
    // Flag pole
    for (let y = 3; y <= 12; y++) g[y][W-10] = 'F';
    g[2][W-10] = 'FT';
    return g;
  }

  function buildLevel2() {
    const W = 240, H = 14;
    const g = Array.from({length:H}, () => Array(W).fill(0));
    for (let x = 0; x < W; x++) { g[13][x] = 'G'; g[12][x] = 'G'; }
    setRow(g, [[4,'B'],[5,'Q'],[6,'B'],[7,'Q'],[8,'B']], 9);
    setRow(g, [[12,'B'],[13,'B'],[14,'B']], 8);
    setBlock(g, 16, 6, 'Q'); setBlock(g, 17, 6, 'Q'); setBlock(g, 18, 6, 'Q');
    setRow(g, [[16,'B'],[17,'B'],[18,'B']], 8);
    setPipe(g, 22, 12, 3); setPipe(g, 32, 12, 2);
    setRow(g, [[38,'Q'],[39,'B'],[40,'Q'],[41,'B'],[42,'Q']], 7);
    setRow(g, [[38,'B'],[39,'B'],[40,'B'],[41,'B'],[42,'B']], 9);
    setPipe(g, 48, 12, 4);
    setRow(g, [[55,'B'],[56,'B'],[57,'B'],[58,'B'],[59,'B'],[60,'B'],[61,'B']], 6);
    setRow(g, [[63,'Q'],[64,'B'],[65,'Q'],[66,'B'],[67,'Q']], 9);
    setPipe(g, 72, 12, 3);
    setRow(g, [[78,'B'],[79,'Q'],[80,'B'],[81,'Q'],[82,'B']], 7);
    setBlock(g, 85, 5, 'Q');
    setRow(g, [[90,'B'],[91,'B'],[92,'B'],[93,'B'],[94,'B']], 8);
    setPipe(g, 98, 12, 2); setPipe(g, 108, 12, 3);
    setRow(g, [[112,'Q'],[113,'B'],[114,'Q'],[115,'B'],[116,'Q'],[117,'B']], 8);
    setRow(g, [[120,'B'],[121,'B'],[122,'B'],[123,'B']], 6);
    setBlock(g, 125, 4, 'Q');
    setPipe(g, 130, 12, 2);
    for (let s = 0; s < 8; s++) {
      for (let r = 0; r <= s; r++) { setBlock(g, W-18+s, 13-r, 'G'); }
    }
    for (let y = 3; y <= 12; y++) g[y][W-10] = 'F';
    g[2][W-10] = 'FT';
    return g;
  }

  function buildLevel3() {
    const W = 260, H = 14;
    const g = Array.from({length:H}, () => Array(W).fill(0));
    for (let x = 0; x < W; x++) { g[13][x] = 'G'; g[12][x] = 'G'; }
    setRow(g, [[3,'Q'],[4,'B'],[5,'Q'],[6,'B'],[7,'Q']], 8);
    setBlock(g, 5, 6, 'Q');
    setPipe(g, 12, 12, 3); setPipe(g, 22, 12, 4);
    setRow(g, [[28,'B'],[29,'Q'],[30,'B'],[31,'Q'],[32,'B'],[33,'Q'],[34,'B']], 7);
    setRow(g, [[28,'B'],[29,'B'],[30,'B'],[31,'B'],[32,'B'],[33,'B'],[34,'B']], 9);
    setPipe(g, 40, 12, 2);
    setRow(g, [[45,'B'],[46,'B'],[47,'B'],[48,'B'],[49,'B'],[50,'B'],[51,'B'],[52,'B']], 5);
    setRow(g, [[55,'Q'],[56,'B'],[57,'Q'],[58,'B'],[59,'Q']], 9);
    setBlock(g, 60, 7, 'Q'); setBlock(g, 62, 5, 'Q');
    setPipe(g, 68, 12, 3);
    setRow(g, [[74,'B'],[75,'Q'],[76,'B'],[77,'Q'],[78,'B']], 8);
    setRow(g, [[80,'B'],[81,'B'],[82,'B']], 6);
    setBlock(g, 84, 4, 'Q');
    setPipe(g, 90, 12, 2); setPipe(g, 100, 12, 3);
    setRow(g, [[105,'Q'],[106,'B'],[107,'Q'],[108,'B'],[109,'Q'],[110,'B'],[111,'Q']], 7);
    setRow(g, [[105,'B'],[106,'B'],[107,'B'],[108,'B'],[109,'B'],[110,'B'],[111,'B']], 9);
    setBlock(g, 115, 5, 'Q');
    setPipe(g, 120, 12, 4);
    setRow(g, [[126,'B'],[127,'B'],[128,'B'],[129,'B'],[130,'B'],[131,'B']], 6);
    setRow(g, [[134,'Q'],[135,'B'],[136,'Q'],[137,'B'],[138,'Q']], 9);
    setPipe(g, 142, 12, 2);
    setBlock(g, 148, 4, 'Q'); setBlock(g, 150, 6, 'Q'); setBlock(g, 152, 8, 'Q');
    for (let s = 0; s < 8; s++) {
      for (let r = 0; r <= s; r++) { setBlock(g, W-18+s, 13-r, 'G'); }
    }
    for (let y = 3; y <= 12; y++) g[y][W-10] = 'F';
    g[2][W-10] = 'FT';
    return g;
  }

  function setRow(g, items, row) {
    items.forEach(([x, t]) => { if (g[row] && g[row][x] !== undefined) g[row][x] = t; });
  }
  function setBlock(g, x, y, t) { if (g[y] && g[y][x] !== undefined) g[y][x] = t; }
  function setPipe(g, x, y, h) {
    g[y][x] = 'PE'; g[y][x+1] = 'PE';
    for (let i = 1; i < h; i++) { g[y-i][x] = 'P'; g[y-i][x+1] = 'P'; }
    // mark top
    g[y - h + 1][x] = 'PT'; g[y - h + 1][x+1] = 'PT';
  }

  // ── STATE ─────────────────────────────────────────────────
  let state = {
    screen: 'start',
    score: 0,
    lives: 3,
    level: 0,
    paused: false,
    playerForm: 'small', // small | big | fire
  };

  let player, camera, entities, fireballs, particles, coins, powerups;
  let tileMap, lvlData;
  let gameTimer = 0, timerTick = 0;
  let keys = {};
  let touchButtons = { left:false, right:false, jump:false, fire:false };
  let lastFireTime = 0;
  let animFrame = 0;
  let previewAnim = 0;
  let levelComplete = false;
  let levelCompleteTimer = 0;

  // ── DOM refs ──────────────────────────────────────────────
  const screens = {};
  ['start','hiscore','help','game','pause','gameover','win'].forEach(id => {
    screens[id] = document.getElementById('screen-' + id);
  });

  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const previewCanvas = document.getElementById('preview-canvas');
  const pctx = previewCanvas.getContext('2d');

  const hudScore = document.getElementById('hud-score');
  const hudLevel = document.getElementById('hud-level');
  const hudLives = document.getElementById('hud-lives');
  const hudTime  = document.getElementById('hud-time');

  // ── SCREEN SWITCH ──────────────────────────────────────────
  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[name]) screens[name].classList.add('active');
    state.screen = name;
  }

  // ── BUTTON WIRING ──────────────────────────────────────────
  function initUI() {
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-hiscore').addEventListener('click', () => { showHighScores(); showScreen('hiscore'); });
    document.getElementById('btn-help').addEventListener('click', () => showScreen('help'));
    document.getElementById('btn-back-hs').addEventListener('click', () => showScreen('start'));
    document.getElementById('btn-back-help').addEventListener('click', () => showScreen('start'));
    document.getElementById('btn-pause').addEventListener('click', pauseGame);
    document.getElementById('btn-resume').addEventListener('click', resumeGame);
    document.getElementById('btn-quit').addEventListener('click', () => { cancelAnimationFrame(animFrame); showScreen('start'); });
    document.getElementById('btn-save-score').addEventListener('click', saveScore);
    document.getElementById('btn-retry').addEventListener('click', startGame);
    document.getElementById('btn-menu').addEventListener('click', () => showScreen('start'));
    document.getElementById('btn-win-menu').addEventListener('click', () => showScreen('start'));

    // Mobile controls
    const btnL = document.getElementById('btn-left');
    const btnR = document.getElementById('btn-right');
    const btnJ = document.getElementById('btn-jump');
    const btnF = document.getElementById('btn-fire');

    function addTouch(el, key) {
      el.addEventListener('touchstart', e => { e.preventDefault(); touchButtons[key] = true; el.classList.add('pressed'); }, {passive:false});
      el.addEventListener('touchend',   e => { e.preventDefault(); touchButtons[key] = false; el.classList.remove('pressed'); }, {passive:false});
      el.addEventListener('touchcancel',e => { e.preventDefault(); touchButtons[key] = false; el.classList.remove('pressed'); }, {passive:false});
    }
    addTouch(btnL, 'left');
    addTouch(btnR, 'right');
    addTouch(btnJ, 'jump');
    addTouch(btnF, 'fire');

    // Keyboard
    window.addEventListener('keydown', e => {
      keys[e.code] = true;
      if (e.code === 'Escape' && state.screen === 'game') pauseGame();
      if (e.code === 'Escape' && state.screen === 'pause') resumeGame();
      e.preventDefault();
    });
    window.addEventListener('keyup', e => { keys[e.code] = false; });
  }

  // ── HIGH SCORES ────────────────────────────────────────────
  function getScores() {
    try { return JSON.parse(localStorage.getItem('marioNeonScores') || '[]'); } catch(e) { return []; }
  }
  function saveScores(arr) {
    try { localStorage.setItem('marioNeonScores', JSON.stringify(arr)); } catch(e) {}
  }
  function showHighScores() {
    const list = document.getElementById('hiscore-list');
    const scores = getScores().sort((a,b) => b.score - a.score).slice(0,10);
    if (scores.length === 0) { list.innerHTML = '<div class="hs-row"><span>Nog geen scores</span></div>'; return; }
    list.innerHTML = scores.map((s,i) =>
      `<div class="hs-row"><span>${i+1}. ${s.name}</span><span>${String(s.score).padStart(6,'0')}</span></div>`
    ).join('');
  }
  function saveScore() {
    const name = document.getElementById('go-name').value.trim() || 'AAA';
    const scores = getScores();
    scores.push({ name, score: state.score });
    saveScores(scores.sort((a,b) => b.score - a.score).slice(0,10));
    document.getElementById('btn-save-score').textContent = '✅ OPGESLAGEN!';
    document.getElementById('btn-save-score').disabled = true;
  }

  // ── RESIZE ─────────────────────────────────────────────────
  function resizeCanvas() {
    const hud = document.getElementById('hud');
    const ctrl = document.getElementById('mobile-controls');
    const hudH = hud ? hud.offsetHeight : 50;
    const ctrlH = ctrl ? ctrl.offsetHeight : 100;
    const w = window.innerWidth;
    const h = window.innerHeight - hudH - ctrlH;
    canvas.width = w;
    canvas.height = Math.max(h, 100);
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', resizeCanvas);

  // ── START GAME ─────────────────────────────────────────────
  function startGame() {
    state.score = 0;
    state.lives = 3;
    state.level = 0;
    state.playerForm = 'small';
    showScreen('game');
    resizeCanvas();
    loadLevel(0);
    cancelAnimationFrame(animFrame);
    loop();
  }

  function loadLevel(idx) {
    lvlData = LEVELS[idx];
    tileMap = lvlData.tiles;
    gameTimer = lvlData.timeLimit;
    timerTick = 0;
    levelComplete = false;
    levelCompleteTimer = 0;

    const startX = 3 * TILE;
    const startY = 11 * TILE;

    player = {
      x: startX, y: startY,
      vx: 0, vy: 0,
      w: TILE * 0.75, h: TILE,
      onGround: false,
      dir: 1,
      form: state.playerForm,
      alive: true,
      invincible: 0,
      starPower: 0,
      walkFrame: 0,
      walkTick: 0,
      jumpPressed: false,
      deathTimer: 0,
    };
    if (player.form !== 'small') player.h = TILE * 1.8;

    camera = { x: 0, y: 0 };
    entities = [];
    fireballs = [];
    particles = [];
    coins = [];
    powerups = [];

    // Spawn enemies
    lvlData.enemies.forEach(e => {
      entities.push(createEnemy(e.type, e.tx * TILE, e.ty * TILE));
    });

    // Spawn coins from Q-blocks as visual
    updateHUD();
  }

  function createEnemy(type, x, y) {
    return {
      type, x, y, w: TILE * 0.85, h: TILE * 0.85,
      vx: type === 'goomba' ? -1.2 : -1.0,
      vy: 0, alive: true, stomped: false, stompTimer: 0,
      onGround: false, dir: -1,
      shellSliding: false, shellTimer: 0,
      walkFrame: 0, walkTick: 0,
    };
  }

  // ── PAUSE ──────────────────────────────────────────────────
  function pauseGame() { state.paused = true; showScreen('pause'); }
  function resumeGame() { state.paused = false; showScreen('game'); loop(); }

  // ── MAIN LOOP ─────────────────────────────────────────────
  let lastTime = 0;
  function loop(ts = 0) {
    if (state.screen !== 'game' || state.paused) return;
    const dt = Math.min((ts - lastTime) / 16.67, 3);
    lastTime = ts;
    update(dt);
    render();
    animFrame = requestAnimationFrame(loop);
  }

  // ── UPDATE ────────────────────────────────────────────────
  function update(dt) {
    if (!player.alive && player.deathTimer <= 0) {
      endDeath();
      return;
    }
    if (!player.alive) {
      player.deathTimer -= dt;
      player.vy += GRAVITY * dt;
      player.y += player.vy * dt;
      return;
    }

    updateTimer(dt);
    updatePlayer(dt);
    updateCamera();
    updateEntities(dt);
    updateFireballs(dt);
    updateParticles(dt);
    updatePowerups(dt);
    updateCoins(dt);
    checkLevelComplete();
    updateHUD();
  }

  function updateTimer(dt) {
    timerTick += dt;
    if (timerTick >= 60) {
      timerTick -= 60;
      gameTimer = Math.max(0, gameTimer - 1);
      if (gameTimer === 0) killPlayer('time');
    }
  }

  function updatePlayer(dt) {
    const p = player;
    const left  = keys['ArrowLeft']  || keys['KeyA'] || touchButtons.left;
    const right = keys['ArrowRight'] || keys['KeyD'] || touchButtons.right;
    const jump  = keys['ArrowUp']    || keys['KeyW'] || keys['Space'] || touchButtons.jump;
    const fire  = keys['KeyX']       || keys['KeyZ'] || touchButtons.fire;

    // Horizontal
    if (left)  { p.vx = Math.max(p.vx - 0.8 * dt, -PLAYER_SPEED); p.dir = -1; }
    else if (right) { p.vx = Math.min(p.vx + 0.8 * dt, PLAYER_SPEED); p.dir = 1; }
    else {
      if (p.vx > 0) p.vx = Math.max(0, p.vx - 0.5 * dt);
      else if (p.vx < 0) p.vx = Math.min(0, p.vx + 0.5 * dt);
    }

    // Jump
    if (jump && p.onGround && !p.jumpPressed) {
      p.vy = JUMP_FORCE;
      p.onGround = false;
      p.jumpPressed = true;
      spawnParticle(p.x + p.w/2, p.y + p.h, C.neonBlue, 4);
    }
    if (!jump) p.jumpPressed = false;

    // Variable jump height
    if (!jump && p.vy < -5) p.vy += 0.8 * dt;

    // Fire
    if (fire && p.form === 'fire' && Date.now() - lastFireTime > 300) {
      lastFireTime = Date.now();
      fireballs.push({ x: p.x + (p.dir > 0 ? p.w : 0), y: p.y + p.h/2 - 6, vx: FIRESPEED * p.dir, vy: -2, alive: true, bounces: 3 });
    }

    // Gravity
    p.vy = Math.min(p.vy + GRAVITY * dt, MAX_FALL);
    p.y += p.vy * dt;
    p.x += p.vx * dt;

    // Clamp to level width
    p.x = Math.max(0, Math.min(p.x, lvlData.width * TILE - p.w));

    // Tile collision
    p.onGround = false;
    resolveTileCollision(p, true);

    // Fall death
    if (p.y > 15 * TILE) { killPlayer('fall'); return; }

    // Enemy collision
    if (p.invincible <= 0 && p.starPower <= 0) {
      for (const e of entities) {
        if (!e.alive || e.stomped) continue;
        if (overlaps(p, e)) {
          // Stomp?
          if (p.vy > 0 && p.y + p.h < e.y + e.h * 0.5 + 8) {
            stompEnemy(e);
            p.vy = -7;
          } else {
            hurtPlayer();
          }
        }
      }
    }
    if (p.starPower > 0) {
      p.starPower -= dt;
      for (const e of entities) {
        if (!e.alive || e.stomped) continue;
        if (overlaps(p, e)) { killEnemy(e, 'star'); }
      }
    }

    // Powerup pickup
    for (const pu of powerups) {
      if (!pu.alive) continue;
      if (overlaps(p, pu)) {
        collectPowerup(pu);
      }
    }

    // Coin pickup
    for (const c of coins) {
      if (!c.alive) continue;
      if (overlaps(p, c)) {
        c.alive = false;
        addScore(200, c.x, c.y);
        spawnParticle(c.x, c.y, C.neonYellow, 5);
      }
    }

    // Walk animation
    if (Math.abs(p.vx) > 0.2) {
      p.walkTick += dt;
      if (p.walkTick > 8) { p.walkTick = 0; p.walkFrame = (p.walkFrame + 1) % 3; }
    } else { p.walkFrame = 0; }

    if (p.invincible > 0) p.invincible -= dt;
  }

  function resolveTileCollision(obj, isPlayer) {
    const ROWS = tileMap.length;
    const COLS = tileMap[0].length;

    const x0 = Math.max(0, Math.floor(obj.x / TILE));
    const x1 = Math.min(COLS - 1, Math.floor((obj.x + obj.w - 1) / TILE));
    const y0 = Math.max(0, Math.floor(obj.y / TILE));
    const y1 = Math.min(ROWS - 1, Math.floor((obj.y + obj.h - 1) / TILE));

    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const cell = tileMap[ty] && tileMap[ty][tx];
        if (!isSolid(cell)) continue;

        const tw = TILE, th = TILE;
        const tx2 = tx * TILE, ty2 = ty * TILE;
        const overlapX = Math.min(obj.x + obj.w - tx2, tx2 + tw - obj.x);
        const overlapY = Math.min(obj.y + obj.h - ty2, ty2 + th - obj.y);

        if (overlapX <= 0 || overlapY <= 0) continue;

        if (overlapX < overlapY) {
          if (obj.x + obj.w / 2 < tx2 + tw / 2) { obj.x = tx2 - obj.w; obj.vx = 0; }
          else { obj.x = tx2 + tw; obj.vx = 0; }
        } else {
          if (obj.y + obj.h / 2 < ty2 + th / 2) {
            // Hit from below (player hit block)
            obj.y = ty2 - obj.h;
            obj.vy = 0;
            obj.onGround = true;
          } else {
            // Land on top
            obj.y = ty2 + th;
            if (isPlayer && obj.vy < 0) {
              hitBlock(tx, ty);
            }
            obj.vy = Math.max(obj.vy, 0);
          }
        }
      }
    }
  }

  function isSolid(cell) {
    return cell && cell !== 0 && cell !== 'M' && cell !== 'K' && cell !== 'C';
  }

  function hitBlock(tx, ty) {
    const cell = tileMap[ty] && tileMap[ty][tx];
    if (cell === 'B') {
      if (player.form !== 'small') {
        tileMap[ty][tx] = 0;
        spawnParticle(tx * TILE + TILE/2, ty * TILE, C.neonPink, 8);
        addScore(50, tx * TILE, ty * TILE);
      }
    } else if (cell === 'Q' || cell === 'QE') {
      if (cell === 'Q') {
        tileMap[ty][tx] = 'QE';
        spawnBlockBump(tx, ty);
        spawnPowerupFromBlock(tx, ty);
      }
    }
  }

  function spawnBlockBump(tx, ty) {
    particles.push({ type:'bump', tx, ty, timer: 8, oy: ty * TILE });
  }

  function spawnPowerupFromBlock(tx, ty) {
    const px = tx * TILE + TILE/4;
    const py = (ty - 1) * TILE;
    let ptype;
    const r = Math.random();
    if (r < 0.2) ptype = 'star';
    else if (r < 0.5) ptype = player.form === 'small' ? 'mushroom' : 'flower';
    else ptype = 'coin';

    if (ptype === 'coin') {
      addScore(200, px, py);
      coins.push({ x: px, y: py, alive: true, animTimer: 0 });
      return;
    }
    powerups.push({ type: ptype, x: px, y: py, w: TILE*0.8, h: TILE*0.8, vx: 1.5, vy: -3, alive: true, onGround: false });
  }

  function collectPowerup(pu) {
    pu.alive = false;
    if (pu.type === 'mushroom') {
      if (player.form === 'small') {
        player.form = 'big';
        state.playerForm = 'big';
        player.h = TILE * 1.8;
        player.y -= TILE * 0.8;
      }
      addScore(1000, pu.x, pu.y);
    } else if (pu.type === 'flower') {
      player.form = 'fire';
      state.playerForm = 'fire';
      player.h = TILE * 1.8;
      addScore(1000, pu.x, pu.y);
    } else if (pu.type === 'star') {
      player.starPower = 600;
      addScore(1000, pu.x, pu.y);
    }
    spawnParticle(pu.x, pu.y, C.neonGreen, 8);
  }

  function updateEntities(dt) {
    for (const e of entities) {
      if (!e.alive) continue;
      if (e.stomped) { e.stompTimer -= dt; if (e.stompTimer <= 0) e.alive = false; continue; }

      // Only update enemies near camera
      if (e.x < camera.x - TILE * 3 || e.x > camera.x + canvas.width + TILE * 3) continue;

      e.vy = Math.min(e.vy + GRAVITY * dt * 0.9, MAX_FALL);
      e.y += e.vy * dt;
      e.x += e.vx * dt;
      e.onGround = false;
      resolveTileCollision(e, false);

      // Wall bounce
      if (e.vx === 0 || e.x <= 0 || e.x + e.w >= lvlData.width * TILE) {
        e.vx = -e.vx;
        if (e.x <= 0) e.x = 1;
        if (e.x + e.w >= lvlData.width * TILE) e.x = lvlData.width * TILE - e.w - 1;
      }

      // Fall off
      if (e.y > 15 * TILE) { e.alive = false; continue; }

      // Walk animation
      e.walkTick += dt;
      if (e.walkTick > 8) { e.walkTick = 0; e.walkFrame = (e.walkFrame + 1) % 2; }
    }
  }

  function stompEnemy(e) {
    e.stomped = true;
    e.stompTimer = 20;
    e.vy = 0; e.vx = 0;
    addScore(e.type === 'koopa' ? 200 : 100, e.x, e.y);
    spawnParticle(e.x + e.w/2, e.y, C.neonYellow, 6);
  }

  function killEnemy(e, reason) {
    e.alive = false;
    addScore(500, e.x, e.y);
    for (let i = 0; i < 6; i++) spawnParticle(e.x + e.w/2, e.y + e.h/2, C.neonPink, 4);
  }

  function updateFireballs(dt) {
    for (const f of fireballs) {
      if (!f.alive) continue;
      f.vy = Math.min(f.vy + GRAVITY * dt * 0.7, 8);
      f.x += f.vx * dt;
      f.y += f.vy * dt;

      // Tile collision for fireball
      const tx = Math.floor((f.x + 6) / TILE);
      const ty = Math.floor((f.y + 6) / TILE);
      const cell = tileMap[ty] && tileMap[ty][tx];
      if (isSolid(cell)) {
        if (f.bounces > 0) { f.vy = -5; f.bounces--; }
        else { f.alive = false; spawnParticle(f.x, f.y, C.neonPink, 4); continue; }
      }

      if (f.x < camera.x - TILE * 2 || f.x > camera.x + canvas.width + TILE * 2) { f.alive = false; continue; }

      // Hit enemies
      for (const e of entities) {
        if (!e.alive || e.stomped) continue;
        if (f.x + 12 > e.x && f.x < e.x + e.w && f.y + 12 > e.y && f.y < e.y + e.h) {
          f.alive = false;
          killEnemy(e, 'fire');
          break;
        }
      }

      spawnParticle(f.x, f.y, C.neonPink, 1);
    }
    // Clean up
    for (let i = fireballs.length - 1; i >= 0; i--) {
      if (!fireballs[i].alive) fireballs.splice(i, 1);
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.type === 'bump') { p.timer -= dt; if (p.timer <= 0) { particles.splice(i,1); } continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.3 * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function updatePowerups(dt) {
    for (const pu of powerups) {
      if (!pu.alive) continue;
      pu.vy = Math.min(pu.vy + GRAVITY * dt * 0.8, MAX_FALL);
      pu.y += pu.vy * dt;
      pu.x += pu.vx * dt;
      pu.onGround = false;
      resolveTileCollision(pu, false);
      if (pu.x <= 0 || pu.x + pu.w >= lvlData.width * TILE) pu.vx = -pu.vx;
      if (pu.y > 16 * TILE) pu.alive = false;
    }
  }

  function updateCoins(dt) {
    for (const c of coins) {
      if (!c.alive) continue;
      c.animTimer += dt;
    }
  }

  function updateCamera() {
    const targetX = player.x - canvas.width * 0.35;
    camera.x = Math.max(0, Math.min(targetX, lvlData.width * TILE - canvas.width));
    camera.y = 0;
  }

  function checkLevelComplete() {
    if (levelComplete) {
      levelCompleteTimer++;
      if (levelCompleteTimer > 120) {
        state.level++;
        if (state.level >= LEVELS.length) {
          document.getElementById('win-score-val').textContent = state.score;
          showScreen('win');
          return;
        }
        loadLevel(state.level);
      }
      return;
    }
    // Check if player touches flag pole
    const ROWS = tileMap.length;
    const COLS = tileMap[0].length;
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        const cell = tileMap[ty][tx];
        if (cell === 'F' || cell === 'FT') {
          const fx = tx * TILE;
          const fy = ty * TILE;
          if (player.x + player.w > fx && player.x < fx + TILE * 0.5 &&
              player.y + player.h > fy && player.y < fy + TILE) {
            levelComplete = true;
            levelCompleteTimer = 0;
            addScore(5000 + gameTimer * 10, fx, fy);
            for (let i = 0; i < 20; i++) spawnParticle(fx + TILE/2, fy, C.neonYellow, 6);
          }
        }
      }
    }
  }

  // ── PLAYER DAMAGE ──────────────────────────────────────────
  function hurtPlayer() {
    if (player.invincible > 0) return;
    if (player.form === 'fire' || player.form === 'big') {
      player.form = 'small';
      state.playerForm = 'small';
      player.h = TILE;
      player.invincible = 120;
    } else {
      killPlayer('enemy');
    }
  }

  function killPlayer(reason) {
    if (!player.alive) return;
    player.alive = false;
    player.vy = -14;
    player.deathTimer = 120;
    state.lives--;
    spawnParticle(player.x + player.w/2, player.y, C.neonPink, 12);
  }

  function endDeath() {
    if (state.lives <= 0) {
      document.getElementById('go-score-val').textContent = state.score;
      document.getElementById('btn-save-score').disabled = false;
      document.getElementById('btn-save-score').textContent = '💾 OPSLAAN';
      showScreen('gameover');
    } else {
      loadLevel(state.level);
    }
  }

  // ── HELPERS ───────────────────────────────────────────────
  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function addScore(pts, x, y) {
    state.score += pts;
    showPointsPopup(pts, x, y);
  }

  function showPointsPopup(pts, x, y) {
    const pop = document.getElementById('popup-points');
    const el = document.createElement('div');
    el.className = 'pt-pop';
    el.textContent = '+' + pts;
    const screenX = x - camera.x;
    const screenY = y - camera.y + document.getElementById('hud').offsetHeight;
    el.style.left = screenX + 'px';
    el.style.top = screenY + 'px';
    pop.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
  }

  function spawnParticle(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color, life: 20 + Math.random() * 20,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function updateHUD() {
    hudScore.textContent = String(state.score).padStart(6, '0');
    hudLevel.textContent = lvlData ? lvlData.name : '1-1';
    hudLives.textContent = '❤️'.repeat(Math.max(0, state.lives));
    hudTime.textContent = Math.ceil(gameTimer);
  }

  // ── RENDER ────────────────────────────────────────────────
  function render() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    drawBackground(W, H);
    ctx.save();
    ctx.translate(-camera.x, -camera.y + (H - 14 * TILE));
    drawTiles();
    drawCoins();
    drawPowerups();
    drawEntities();
    drawFireballs();
    drawPlayer();
    drawParticles();
    ctx.restore();

    // Level complete overlay
    if (levelComplete) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = 'bold 28px Orbitron, monospace';
      ctx.textAlign = 'center';
      const grad = ctx.createLinearGradient(0,0,W,0);
      grad.addColorStop(0, C.neonBlue); grad.addColorStop(0.5, C.neonYellow); grad.addColorStop(1, C.neonPink);
      ctx.fillStyle = grad;
      ctx.shadowColor = C.neonYellow; ctx.shadowBlur = 20;
      ctx.fillText('⭐ LEVEL KLAAR! ⭐', W/2, H/2);
      ctx.shadowBlur = 0;
    }
  }

  function drawBackground(W, H) {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#020210');
    grad.addColorStop(0.6, '#050520');
    grad.addColorStop(1, '#0a0a30');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137.5 + Math.sin(i) * 30) % W;
      const sy = (i * 73.1) % (H * 0.6);
      const a = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() / 1000 + i));
      ctx.globalAlpha = a;
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;

    // Clouds (decorative)
    for (let i = 0; i < 3; i++) {
      const cx = ((i * 300 - camera.x * 0.2 + 10000) % (W + 300)) - 100;
      const cy = 20 + i * 25;
      drawCloud(cx, cy, 60 + i * 20);
    }
  }

  function drawCloud(x, y, w) {
    ctx.strokeStyle = C.cloudBorder;
    ctx.lineWidth = 1;
    ctx.shadowColor = C.neonBlue;
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(0,10,40,0.7)';
    roundRect(ctx, x, y, w, 18, 9);
    ctx.fill(); ctx.stroke();
    roundRect(ctx, x + w*0.2, y - 10, w * 0.5, 16, 8);
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawTiles() {
    const ROWS = tileMap.length;
    const COLS = tileMap[0].length;
    const startCol = Math.max(0, Math.floor(camera.x / TILE) - 1);
    const endCol   = Math.min(COLS - 1, Math.ceil((camera.x + canvas.width) / TILE) + 1);

    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = startCol; tx <= endCol; tx++) {
        const cell = tileMap[ty][tx];
        if (!cell || cell === 0) continue;
        const x = tx * TILE, y = ty * TILE;
        drawTile(cell, x, y, tx, ty);
      }
    }
  }

  function drawTile(cell, x, y, tx, ty) {
    const t = TILE;
    switch(cell) {
      case 'G':
        // Ground
        ctx.fillStyle = C.ground;
        ctx.fillRect(x, y, t, t);
        ctx.fillStyle = C.groundTop;
        ctx.shadowColor = C.neonBlue;
        ctx.shadowBlur = 4;
        ctx.fillRect(x, y, t, 3);
        // Grid lines
        ctx.strokeStyle = '#00f3ff22';
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 0;
        ctx.strokeRect(x, y, t, t);
        break;
      case 'B':
        ctx.fillStyle = C.brick;
        ctx.fillRect(x, y, t, t);
        ctx.strokeStyle = C.brickLine;
        ctx.lineWidth = 1;
        ctx.shadowColor = C.neonPink;
        ctx.shadowBlur = 3;
        ctx.strokeRect(x+1, y+1, t-2, t-2);
        ctx.beginPath();
        ctx.moveTo(x, y+t/2); ctx.lineTo(x+t, y+t/2);
        ctx.moveTo(x+t/4, y); ctx.lineTo(x+t/4, y+t/2);
        ctx.moveTo(x+3*t/4, y+t/2); ctx.lineTo(x+3*t/4, y+t);
        ctx.strokeStyle = '#ff00aa33';
        ctx.shadowBlur = 0;
        ctx.stroke();
        break;
      case 'Q':
        ctx.fillStyle = C.question;
        ctx.fillRect(x, y, t, t);
        ctx.strokeStyle = C.questionBorder;
        ctx.lineWidth = 2;
        ctx.shadowColor = C.neonYellow;
        ctx.shadowBlur = 8 + 4 * Math.sin(Date.now() / 200);
        ctx.strokeRect(x+1, y+1, t-2, t-2);
        ctx.fillStyle = C.neonYellow;
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', x + t/2, y + t/2);
        ctx.shadowBlur = 0;
        break;
      case 'QE':
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(x, y, t, t);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.strokeRect(x+1, y+1, t-2, t-2);
        break;
      case 'P':
        // Pipe body
        ctx.fillStyle = C.pipe;
        ctx.fillRect(x+2, y, t-4, t);
        ctx.strokeStyle = C.pipeTop;
        ctx.lineWidth = 1;
        ctx.shadowColor = C.neonGreen;
        ctx.shadowBlur = 5;
        ctx.strokeRect(x+2, y, t-4, t);
        ctx.shadowBlur = 0;
        break;
      case 'PT':
        // Pipe top cap
        ctx.fillStyle = C.pipe;
        ctx.fillRect(x, y, t, t);
        ctx.strokeStyle = C.pipeTop;
        ctx.lineWidth = 2;
        ctx.shadowColor = C.neonGreen;
        ctx.shadowBlur = 8;
        ctx.strokeRect(x+1, y+1, t-2, t-2);
        ctx.fillStyle = C.pipeTop;
        ctx.fillRect(x, y, t, 4);
        ctx.shadowBlur = 0;
        break;
      case 'PE':
        // Pipe exit (bottom)
        ctx.fillStyle = C.pipe;
        ctx.fillRect(x+2, y, t-4, t);
        ctx.strokeStyle = C.pipeTop;
        ctx.lineWidth = 1;
        ctx.shadowColor = C.neonGreen;
        ctx.shadowBlur = 3;
        ctx.strokeRect(x+2, y, t-4, t);
        ctx.shadowBlur = 0;
        break;
      case 'F':
        // Flag pole
        ctx.fillStyle = '#666';
        ctx.fillRect(x + t/2 - 1, y, 2, t);
        break;
      case 'FT':
        // Flag top
        ctx.fillStyle = '#666';
        ctx.fillRect(x + t/2 - 1, y, 2, t);
        // Flag
        ctx.fillStyle = C.neonBlue;
        ctx.shadowColor = C.neonBlue;
        ctx.shadowBlur = 8;
        ctx.fillRect(x + t/2 + 1, y + 2, 14, 10);
        ctx.shadowBlur = 0;
        // Ball on top
        ctx.beginPath();
        ctx.arc(x + t/2, y + 1, 4, 0, Math.PI * 2);
        ctx.fillStyle = C.neonYellow;
        ctx.shadowColor = C.neonYellow;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        break;
    }
  }

  function drawPlayer() {
    const p = player;
    if (!p.alive && p.deathTimer < 60) return; // Flash at death

    // Invincible flicker
    if (p.invincible > 0 && Math.floor(p.invincible / 5) % 2 === 0) return;

    const x = Math.round(p.x), y = Math.round(p.y);
    const w = p.w, h = p.h;
    const isBig = p.form !== 'small';
    const isFire = p.form === 'fire';
    const hasStarPower = p.starPower > 0;

    ctx.save();
    if (p.dir === -1) {
      ctx.scale(-1, 1);
      ctx.translate(-(x + w/2) * 2, 0);
    }

    // Star power rainbow
    if (hasStarPower) {
      const hue = (Date.now() / 10) % 360;
      ctx.shadowColor = `hsl(${hue},100%,60%)`;
      ctx.shadowBlur = 20;
    }

    // Body
    const bodyColor = isFire ? C.marioFire : (isBig ? C.marioBig : C.mario);
    ctx.fillStyle = bodyColor;

    if (isBig) {
      // Big/fire Mario - draw 2 tiles tall
      // Hat
      ctx.fillStyle = C.marioHat;
      ctx.fillRect(x + w*0.1, y, w*0.8, h*0.22);
      ctx.fillRect(x, y + h*0.07, w, h*0.18);
      // Face
      ctx.fillStyle = '#ffaa88';
      ctx.fillRect(x + w*0.1, y + h*0.25, w*0.8, h*0.22);
      // Body
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x + w*0.05, y + h*0.47, w*0.9, h*0.33);
      // Overall
      ctx.fillStyle = '#4444cc';
      ctx.fillRect(x + w*0.1, y + h*0.53, w*0.35, h*0.44);
      ctx.fillRect(x + w*0.55, y + h*0.53, w*0.35, h*0.44);
      // Shoes
      ctx.fillStyle = C.marioHat;
      ctx.fillRect(x, y + h*0.88, w*0.45, h*0.12);
      ctx.fillRect(x + w*0.55, y + h*0.88, w*0.45, h*0.12);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(x + w*0.55, y + h*0.28, w*0.12, h*0.08);
      // Walk legs
      if (p.walkFrame === 1 && Math.abs(p.vx) > 0.2) {
        ctx.fillStyle = '#4444cc';
        ctx.fillRect(x + w*0.05, y + h*0.7, w*0.38, h*0.28);
        ctx.fillRect(x + w*0.57, y + h*0.6, w*0.38, h*0.38);
      }
    } else {
      // Small Mario
      // Hat
      ctx.fillStyle = C.marioHat;
      ctx.fillRect(x + w*0.15, y, w*0.7, h*0.28);
      ctx.fillRect(x, y + h*0.12, w, h*0.2);
      // Face
      ctx.fillStyle = '#ffaa88';
      ctx.fillRect(x + w*0.15, y + h*0.32, w*0.7, h*0.26);
      // Body
      ctx.fillStyle = bodyColor;
      ctx.fillRect(x + w*0.1, y + h*0.58, w*0.8, h*0.26);
      // Overall
      ctx.fillStyle = '#4444cc';
      ctx.fillRect(x + w*0.1, y + h*0.62, w*0.36, h*0.38);
      ctx.fillRect(x + w*0.54, y + h*0.62, w*0.36, h*0.38);
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(x + w*0.58, y + h*0.36, w*0.12, h*0.1);
      // Shoes
      ctx.fillStyle = C.marioHat;
      ctx.fillRect(x, y + h*0.87, w*0.45, h*0.13);
      ctx.fillRect(x + w*0.55, y + h*0.87, w*0.45, h*0.13);
    }

    // Fire badge
    if (isFire) {
      ctx.fillStyle = C.neonPink;
      ctx.shadowColor = C.neonPink;
      ctx.shadowBlur = 6;
      ctx.fillRect(x + w*0.3, y + h*0.55, w*0.4, h*0.06);
      ctx.shadowBlur = 0;
    }

    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawEntities() {
    for (const e of entities) {
      if (!e.alive) continue;
      if (e.x + e.w < camera.x - TILE || e.x > camera.x + canvas.width + TILE) continue;
      if (e.type === 'goomba') drawGoomba(e);
      else if (e.type === 'koopa') drawKoopa(e);
    }
  }

  function drawGoomba(e) {
    const x = Math.round(e.x), y = Math.round(e.y);
    const w = e.w, h = e.stomped ? e.h * 0.4 : e.h;
    const yOff = e.stomped ? e.h * 0.6 : 0;
    ctx.save();

    // Body
    ctx.fillStyle = C.goomba;
    ctx.shadowColor = '#ff880044';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + yOff + h*0.6, w/2, h*0.55, 0, 0, Math.PI*2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#dd7700';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + yOff + h*0.3, w*0.45, h*0.35, 0, 0, Math.PI*2);
    ctx.fill();

    if (!e.stomped) {
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(x + w*0.32, y + h*0.25, w*0.09, h*0.1, 0, 0, Math.PI*2);
      ctx.ellipse(x + w*0.68, y + h*0.25, w*0.09, h*0.1, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(x + w*0.34, y + h*0.27, w*0.05, h*0.06, 0, 0, Math.PI*2);
      ctx.ellipse(x + w*0.66, y + h*0.27, w*0.05, h*0.06, 0, 0, Math.PI*2);
      ctx.fill();
      // Feet
      ctx.fillStyle = '#552200';
      if (e.walkFrame === 0) {
        ctx.fillRect(x, y + h*0.82, w*0.35, h*0.18);
        ctx.fillRect(x + w*0.65, y + h*0.82, w*0.35, h*0.18);
      } else {
        ctx.fillRect(x + w*0.05, y + h*0.78, w*0.35, h*0.22);
        ctx.fillRect(x + w*0.6, y + h*0.82, w*0.35, h*0.18);
      }
    }
    ctx.restore();
  }

  function drawKoopa(e) {
    const x = Math.round(e.x), y = Math.round(e.y);
    const w = e.w, h = e.stomped ? e.h * 0.5 : e.h;
    const yOff = e.stomped ? e.h * 0.5 : 0;
    ctx.save();

    // Shell
    ctx.fillStyle = e.stomped ? '#004400' : C.koopa;
    ctx.shadowColor = C.neonGreen;
    ctx.shadowBlur = e.stomped ? 12 : 5;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + yOff + h*0.55, w*0.45, h*0.48, 0, 0, Math.PI*2);
    ctx.fill();

    // Shell pattern
    ctx.strokeStyle = C.koopaNeon;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + yOff + h*0.55, w*0.3, h*0.32, 0, 0, Math.PI*2);
    ctx.stroke();

    if (!e.stomped) {
      // Head
      ctx.fillStyle = '#00aa44';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(x + (e.vx > 0 ? w*0.75 : w*0.25), y + h*0.2, w*0.25, h*0.22, 0, 0, Math.PI*2);
      ctx.fill();
      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + (e.vx > 0 ? w*0.82 : w*0.18), y + h*0.17, 4, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(x + (e.vx > 0 ? w*0.83 : w*0.17), y + h*0.17, 2, 0, Math.PI*2);
      ctx.fill();
      // Legs
      ctx.fillStyle = '#005500';
      if (e.walkFrame === 0) {
        ctx.fillRect(x + w*0.1, y + h*0.82, w*0.25, h*0.18);
        ctx.fillRect(x + w*0.65, y + h*0.82, w*0.25, h*0.18);
      } else {
        ctx.fillRect(x + w*0.15, y + h*0.78, w*0.25, h*0.22);
        ctx.fillRect(x + w*0.6, y + h*0.82, w*0.25, h*0.18);
      }
    }
    ctx.restore();
    ctx.shadowBlur = 0;
  }

  function drawFireballs() {
    for (const f of fireballs) {
      if (!f.alive) continue;
      const t = Date.now() / 100;
      ctx.beginPath();
      ctx.arc(f.x + 6, f.y + 6, 6, 0, Math.PI * 2);
      ctx.fillStyle = C.neonPink;
      ctx.shadowColor = C.neonPink;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Core
      ctx.beginPath();
      ctx.arc(f.x + 6, f.y + 6, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      if (p.type === 'bump') continue;
      ctx.globalAlpha = Math.max(0, p.life / 40);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function drawCoins() {
    for (const c of coins) {
      if (!c.alive) continue;
      const t = c.animTimer / 10;
      const scaleX = Math.abs(Math.cos(t));
      ctx.save();
      ctx.translate(c.x + TILE*0.4, c.y + TILE*0.4);
      ctx.scale(scaleX, 1);
      ctx.beginPath();
      ctx.arc(0, 0, TILE * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = C.coin;
      ctx.shadowColor = C.neonYellow;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    }
  }

  function drawPowerups() {
    for (const pu of powerups) {
      if (!pu.alive) continue;
      const x = Math.round(pu.x), y = Math.round(pu.y);
      const w = pu.w, h = pu.h;
      if (pu.type === 'mushroom') {
        ctx.fillStyle = C.mushroom;
        ctx.shadowColor = C.mushroom;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(x + w/2, y + h*0.4, w*0.5, h*0.45, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fillRect(x + w*0.15, y + h*0.55, w*0.7, h*0.45);
        // Dots
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + w*0.3, y + h*0.32, 4, 0, Math.PI*2);
        ctx.arc(x + w*0.7, y + h*0.32, 4, 0, Math.PI*2);
        ctx.fill();
      } else if (pu.type === 'flower') {
        ctx.fillStyle = C.flower;
        ctx.shadowColor = C.flower;
        ctx.shadowBlur = 10;
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(x + w/2 + Math.cos(angle)*w*0.28, y + h/2 + Math.sin(angle)*h*0.28, w*0.18, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.fillStyle = C.neonYellow;
        ctx.shadowColor = C.neonYellow;
        ctx.beginPath();
        ctx.arc(x + w/2, y + h/2, w*0.2, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (pu.type === 'star') {
        const hue = (Date.now() / 5) % 360;
        ctx.fillStyle = `hsl(${hue},100%,65%)`;
        ctx.shadowColor = `hsl(${hue},100%,65%)`;
        ctx.shadowBlur = 14;
        drawStar(ctx, x + w/2, y + h/2, w*0.5, 5);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function drawStar(ctx, cx, cy, r, points) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI/2;
      const radius = i % 2 === 0 ? r : r * 0.4;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  // ── PREVIEW ANIMATION (start screen) ──────────────────────
  function runPreview() {
    previewAnim++;
    const W = previewCanvas.width, H = previewCanvas.height;
    pctx.clearRect(0, 0, W, H);
    pctx.fillStyle = '#05050f';
    pctx.fillRect(0, 0, W, H);

    // Ground
    pctx.fillStyle = '#0d1a33';
    pctx.fillRect(0, H - 24, W, 24);
    pctx.fillStyle = '#00f3ff';
    pctx.shadowColor = '#00f3ff';
    pctx.shadowBlur = 4;
    pctx.fillRect(0, H - 24, W, 3);
    pctx.shadowBlur = 0;

    // Platforms
    pctx.fillStyle = '#1a0533';
    pctx.strokeStyle = '#ff00aa';
    pctx.lineWidth = 1;
    [[50,60,60,14],[140,45,50,14],[230,70,60,14]].forEach(([x,y,w,h]) => {
      pctx.fillRect(x, y, w, h);
      pctx.strokeRect(x, y, w, h);
    });

    // Animated Mario
    const mX = ((previewAnim * 1.5) % (W + 32)) - 32;
    const mY = H - 24 - 24;
    pctx.fillStyle = '#cc0000';
    pctx.fillRect(mX + 4, mY, 16, 8);
    pctx.fillRect(mX, mY + 4, 24, 6);
    pctx.fillStyle = '#ff4444';
    pctx.fillRect(mX + 2, mY + 10, 20, 14);
    pctx.fillStyle = '#ffaa88';
    pctx.fillRect(mX + 4, mY + 6, 16, 8);
    pctx.fillStyle = '#4444cc';
    pctx.fillRect(mX + 2, mY + 16, 8, 8);
    pctx.fillRect(mX + 14, mY + 16, 8, 8);

    // Coin
    const coinY = H - 60 + Math.sin(previewAnim / 20) * 8;
    pctx.beginPath();
    pctx.arc(W - 50, coinY, 8, 0, Math.PI*2);
    pctx.fillStyle = '#ffe600';
    pctx.shadowColor = '#ffe600';
    pctx.shadowBlur = 10;
    pctx.fill();
    pctx.shadowBlur = 0;

    // Stars
    pctx.fillStyle = '#fff';
    for (let i = 0; i < 10; i++) {
      const sx = (i * 37 + previewAnim * 0.3) % W;
      const sy = (i * 13) % (H - 30);
      const a = 0.4 + 0.6 * Math.abs(Math.sin(previewAnim / 30 + i));
      pctx.globalAlpha = a;
      pctx.fillRect(sx, sy, 1, 1);
    }
    pctx.globalAlpha = 1;

    requestAnimationFrame(runPreview);
  }

  // ── INIT ──────────────────────────────────────────────────
  function init() {
    initUI();
    showScreen('start');
    resizeCanvas();
    runPreview();

    // Create manifest.json
    // (already handled via sw.js)
  }

  init();

})();
