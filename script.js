(() => {
  const $ = (selector) => document.querySelector(selector);
  const soundToggle = $('#soundToggle');
  let soundOn = false;
  let audioContext;
  function playTone(frequency = 660, duration = 0.11) {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + 0.02);
    } catch (error) { /* Audio is optional; the site stays usable without it. */ }
  }
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    soundToggle.innerHTML = '<span class="sound-dot"></span> sound ' + (soundOn ? 'on' : 'off');
    if (soundOn) playTone(740, 0.16);
  });
  const cakeSteps = [
    { button: $('#frostButton'), layer: $('#cupcakeFrosting'), message: 'Frosting: done. This is already looking expensive.' },
    { button: $('#sprinkleButton'), layer: $('#cupcakeSprinkles'), message: 'Sprinkles: added. A little extra never hurt anybody.' },
    { button: $('#candleButton'), layer: $('#cupcakeCandle'), message: 'Candle: lit. Make a wish, birthday girl! ✨' }
  ];
  let cakeStep = 0;
  const cakeStatus = $('#cakeStatus');
  function updateCakeButtons() { cakeSteps.forEach((step, index) => { step.button.disabled = index !== cakeStep; }); }
  cakeSteps.forEach((step, index) => {
    step.button.addEventListener('click', () => {
      if (index !== cakeStep) return;
      step.layer.classList.add('show'); cakeStatus.textContent = step.message; cakeStep += 1;
      playTone([523, 659, 784][index], 0.15); updateCakeButtons();
      if (cakeStep === 3) { cakeStatus.textContent = 'Officially bakery-approved. Happy sweet sixteen! 🧁'; playTone(988, 0.22); }
    });
  });
  $('#resetCake').addEventListener('click', () => {
    cakeStep = 0; cakeSteps.forEach(step => step.layer.classList.remove('show'));
    cakeStatus.textContent = "Your cupcake is looking a little plain. Let's fix that.";
    updateCakeButtons(); playTone(440);
  });
  updateCakeButtons();
  let goals = 0, saves = 0, shooting = false;
  const keeper = $('#keeper'), ball = $('#ball'), penaltyStatus = $('#penaltyStatus');
  const shotPositions = { left: '25%', middle: '50%', right: '75%' };
  const reactions = {
    goal: ['GOOOOAL! The birthday girl has done it! ⚽', 'Straight into the net. Somebody sign her.', 'Clinical finish. The keeper needs a minute.'],
    save: ['Saved! The keeper has clearly been practising.', 'Not this time, superstar. Rematch?', 'The keeper guessed right. Suspicious behaviour.']
  };
  document.querySelectorAll('.shot-button').forEach(button => {
    button.addEventListener('click', () => {
      if (shooting) return;
      shooting = true;
      const shot = button.dataset.shot;
      const keeperShot = ['left', 'middle', 'right'][Math.floor(Math.random() * 3)];
      const scored = shot !== keeperShot;
      keeper.style.left = shotPositions[keeperShot]; ball.style.left = shotPositions[shot]; ball.style.bottom = '80px';
      ball.style.transform = 'translateX(-50%) rotate(' + (shot === 'left' ? '-25deg' : shot === 'right' ? '25deg' : '0deg') + ')';
      penaltyStatus.textContent = scored ? 'SHE SHOOTS… SHE SCORES!' : 'THE KEEPER GOT A HAND TO IT!';
      if (scored) { goals += 1; playTone(880, 0.18); } else { saves += 1; playTone(240, 0.18); }
      $('#goalCount').textContent = goals; $('#saveCount').textContent = saves;
      window.setTimeout(() => {
        const pool = scored ? reactions.goal : reactions.save;
        penaltyStatus.textContent = pool[Math.floor(Math.random() * pool.length)];
        ball.style.bottom = '-42px'; ball.style.left = '50%'; ball.style.transform = 'translateX(-50%)';
        keeper.style.left = '50%'; shooting = false;
      }, 760);
    });
  });
  $('#resetScore').addEventListener('click', () => {
    goals = 0; saves = 0; $('#goalCount').textContent = '0'; $('#saveCount').textContent = '0';
    penaltyStatus.textContent = 'The crowd is waiting. Choose your shot.'; playTone(440);
  });
  const introductions = [
    'Make some noise for the one, the only… RETSHEGO! 🎤',
    'From the bedroom concerts to the big stage… it is RETSHEGO!',
    'Please welcome our birthday headliner. The mic belongs to RETSHEGO!',
    'Sixteen candles, one superstar. RETSHEGO IS IN THE BUILDING!'
  ];
  $('#micButton').addEventListener('click', () => {
    const announcement = $('#micAnnouncement'), current = announcement.dataset.last || '';
    let next = introductions[Math.floor(Math.random() * introductions.length)];
    if (introductions.length > 1) while (next === current) next = introductions[Math.floor(Math.random() * introductions.length)];
    announcement.dataset.last = next; announcement.textContent = next;
    playTone(523, .12); window.setTimeout(() => playTone(659, .12), 120); window.setTimeout(() => playTone(784, .18), 240);
  });
  const openLetter = $('#openLetter'), wishEnvelope = $('#wishEnvelope');
  openLetter.addEventListener('click', () => {
    const isOpen = wishEnvelope.classList.toggle('open');
    openLetter.setAttribute('aria-expanded', String(isOpen));
    openLetter.innerHTML = isOpen ? 'Close your letter <span aria-hidden="true">↙</span>' : 'Open your letter <span aria-hidden="true">↗</span>';
    $('#letterHint').textContent = isOpen ? 'Keep this little reminder close. ♡' : 'There is something sweet inside. Go on.';
    playTone(isOpen ? 784 : 523, .15);
  });
})();