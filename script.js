document.addEventListener("DOMContentLoaded", () => {
  const SECRET_PASSCODE = "OCD";

  const wrongAttemptsData = [
    { emoji: "😒", quote: "Wrong passcode! Trying to keep your distance as usual?", error: "Access Denied! Step back 5 feet!" },
    { emoji: "🙄", quote: "Eye roll! That's definitely not the password, Miss Clean Freak.", error: "Incorrect! Did you sanitize your keyboard?" },
    { emoji: "😤", quote: "Getting frustrated? That fiery personality won't bypass security!", error: "Nope! Try again with less attitude!" },
    { emoji: "🤨", quote: "Suspicious... Are you really Nidhu or an imposter?", error: "Wrong key! Hint is right below." }
  ];

  let attemptIndex = 0;

  // Screen Elements
  const welcomeScreen = document.getElementById("welcome-screen");
  const passwordScreen = document.getElementById("password-screen");
  const mainScreen = document.getElementById("main-screen");
  const bookScreen = document.getElementById("book-screen");

  // Buttons
  const startBtn = document.getElementById("start-btn");
  const unlockBtn = document.getElementById("unlock-btn");
  const passInput = document.getElementById("pass-input");
  
  const topGotoBookBtn = document.getElementById("top-goto-book-btn");
  const bottomGotoBookBtn = document.getElementById("bottom-goto-book-btn");
  const homeBtn = document.getElementById("home-btn");
  const bottomHomeBtn = document.getElementById("bottom-home-btn");
  const backLetterBtn = document.getElementById("back-letter-btn");

  const dynamicEmoji = document.getElementById("dynamic-emoji");
  const attitudeText = document.getElementById("dynamic-attitude-text");
  const errorBox = document.getElementById("error-box");
  const errorEmoji = document.getElementById("error-emoji");
  const errorMsgText = document.getElementById("error-msg-text");
  
  const hintBtn = document.getElementById("hint-btn");
  const hintMsg = document.getElementById("hint-msg");

  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themeIcon = document.getElementById("theme-icon");
  const pinDots = document.querySelectorAll(".dot");

  // Screen Switcher Function
  function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove("active");
    setTimeout(() => {
      toScreen.classList.add("active");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  }

  // --- NAVIGATION EVENT LISTENERS ---
  // Screen 1 -> Screen 2
  startBtn.addEventListener("click", () => {
    switchScreen(welcomeScreen, passwordScreen);
    setTimeout(() => passInput.focus(), 500);
  });

  // Screen 3 -> Screen 4 (Book Page)
  if (topGotoBookBtn) topGotoBookBtn.addEventListener("click", () => switchScreen(mainScreen, bookScreen));
  if (bottomGotoBookBtn) bottomGotoBookBtn.addEventListener("click", () => switchScreen(mainScreen, bookScreen));

  // Screen 4 -> Screen 1 (Home)
  if (homeBtn) homeBtn.addEventListener("click", () => switchScreen(bookScreen, welcomeScreen));
  if (bottomHomeBtn) bottomHomeBtn.addEventListener("click", () => switchScreen(bookScreen, welcomeScreen));

  // Screen 4 -> Screen 3 (Letter)
  if (backLetterBtn) backLetterBtn.addEventListener("click", () => switchScreen(bookScreen, mainScreen));

  // Theme Toggle
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeIcon.innerText = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
  });

  // Password Input Animation
  passInput.addEventListener("input", () => {
    const len = passInput.value.length;
    pinDots.forEach((dot, idx) => {
      if (idx < len) dot.classList.add("filled");
      else dot.classList.remove("filled");
    });
  });

  // Password Check
  function checkPassword() {
    const entered = passInput.value.trim().toUpperCase();

    if (entered === SECRET_PASSCODE) {
      errorBox.style.display = "none";
      passInput.blur();
      if (typeof confetti === "function") confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      switchScreen(passwordScreen, mainScreen);
    } else {
      const currentData = wrongAttemptsData[attemptIndex];
      dynamicEmoji.innerText = currentData.emoji;
      attitudeText.innerText = `"${currentData.quote}"`;
      errorEmoji.innerText = currentData.emoji;
      errorMsgText.innerText = currentData.error;
      errorBox.style.display = "flex";

      passInput.classList.add("shake");
      setTimeout(() => passInput.classList.remove("shake"), 500);

      passInput.value = "";
      pinDots.forEach(dot => dot.classList.remove("filled"));
      
      setTimeout(() => {
        passInput.focus();
      }, 100);

      attemptIndex = (attemptIndex + 1) % wrongAttemptsData.length;
    }
  }

  unlockBtn.addEventListener("click", checkPassword);
  passInput.addEventListener("keypress", (e) => { 
    if (e.key === "Enter") {
      e.preventDefault();
      checkPassword(); 
    }
  });

  hintBtn.addEventListener("click", () => { 
    hintMsg.style.display = hintMsg.style.display === "block" ? "none" : "block"; 
  });

  // --- 5 GIFTS LOGIC ---
  const giftsData = {
    "1": {
      locked: true,
      title: "🔒 Deep Vault Hamper #1",
      quote: "My intention is always right to protect you and make you happy. I honestly don't know why you behave like this or why OCD triggers around me, but my care will never falter!"
    },
    "2": {
      locked: true,
      title: "🔒 Deep Vault Hamper #2",
      quote: "No matter how much distance you create or how 'dirty' you think I am in those moments, my soul is clean and my loyalty to you as your best brother is forever unbreakable!"
    },
    "3": {
      locked: false,
      title: "🎁 Gift Hamper #3: Hand Sanitizer Pass",
      quote: "Unlimited free hand sanitizers for life! Wash away the germs, but keep our friendship safe inside your heart."
    },
    "4": {
      locked: false,
      title: "🎁 Gift Hamper #4: Patience Trophy",
      quote: "Awarded to Nidhu for having the highest attitude, and awarded to me for having the infinite patience to handle it!"
    },
    "5": {
      locked: false,
      title: "🎁 Gift Hamper #5: Best Brother Promise",
      quote: "A lifetime voucher promising that no matter how bad an argument gets, I will always reach out first to fix things."
    }
  };

  const giftCards = document.querySelectorAll(".gift-card");
  const giftModal = document.getElementById("gift-modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementById("close-modal");

  giftCards.forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-gift-id");
      const gift = giftsData[id];

      if (gift.locked) {
        modalBody.innerHTML = `
          <h2>${gift.title}</h2>
          <p style="margin: 15px 0; font-size: 0.9rem;">This hamper contains a deep secret message! Enter passcode to unlock:</p>
          <input type="password" id="gift-pass-input" placeholder="Enter Code (OCD)..." style="padding: 12px; width: 85%; border-radius: 8px; border: 1px solid var(--accent-pink); background: rgba(0,0,0,0.4); color:#fff; font-size: 16px;">
          <button id="unlock-gift-btn" style="margin-top: 15px; padding: 12px 20px; border-radius: 8px; border:none; background: var(--accent-pink); color:#fff; font-weight:600; cursor:pointer;">Unlock Hamper</button>
          <p id="gift-err" style="color:#ef4444; font-size:0.8rem; display:none; margin-top:10px;">Incorrect Code! Think OCD.</p>
        `;
        giftModal.style.display = "flex";

        const giftInput = document.getElementById("gift-pass-input");
        setTimeout(() => giftInput.focus(), 300);

        document.getElementById("unlock-gift-btn").addEventListener("click", () => {
          const val = giftInput.value.trim().toUpperCase();
          if (val === SECRET_PASSCODE) {
            if (typeof confetti === "function") confetti({ particleCount: 70, spread: 50 });
            modalBody.innerHTML = `
              <h2 style="color: var(--accent-pink);">${gift.title.replace("🔒", "🔓")}</h2>
              <p style="margin-top: 15px; line-height: 1.8; font-size: 1rem; color: var(--text-color);">${gift.quote}</p>
            `;
          } else {
            document.getElementById("gift-err").style.display = "block";
            giftInput.value = "";
            giftInput.focus();
          }
        });
      } else {
        if (typeof confetti === "function") confetti({ particleCount: 50, spread: 40 });
        modalBody.innerHTML = `
          <h2 style="color: var(--accent-pink);">${gift.title}</h2>
          <p style="margin-top: 15px; line-height: 1.8; font-size: 1rem; color: var(--text-color);">${gift.quote}</p>
        `;
        giftModal.style.display = "flex";
      }
    });
  });

  if (closeModal) closeModal.addEventListener("click", () => giftModal.style.display = "none");

  // --- 5 EMOJIS LOGIC ---
  const emojiQuotes = [
    "😒 **The 'Stay Away' Stare**: You act like I'm made of germs, but underneath that cold look, I know you still care about our friendship!",
    "😤 **The 'Fiery Mood'**: You get angry easily when things aren't clean or organized, but I'll always be the calm water to your fire.",
    "🙄 **The 'High Attitude'**: Roll your eyes all you want! Your attitude just makes our bond more iconic.",
    "🧼 **The 'Clean Freak'**: Your OCD might make you keep distance, but distance only proves how strong my loyalty really is.",
    "👑 **The 'Queen Complex'**: You like things done your way. Rule #1: Nidhu is always right, and I'm totally fine with that!"
  ];

  const emojiCards = document.querySelectorAll(".emoji-card");
  const emojiQuoteText = document.getElementById("emoji-quote-text");

  emojiCards.forEach(card => {
    card.addEventListener("click", () => {
      const idx = card.getAttribute("data-index");
      emojiQuoteText.innerHTML = emojiQuotes[idx];
    });
  });

  // Speech Read Aloud & Stop
  const readBtn = document.getElementById("read-aloud-btn");
  const stopBtn = document.getElementById("stop-read-btn");

  if (readBtn && stopBtn) {
    readBtn.addEventListener("click", () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = document.getElementById("letter-text-content").innerText;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.onstart = () => { readBtn.style.display = "none"; stopBtn.style.display = "inline-block"; };
        utterance.onend = () => { readBtn.style.display = "inline-block"; stopBtn.style.display = "none"; };
        window.speechSynthesis.speak(utterance);
      }
    });

    stopBtn.addEventListener("click", () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        readBtn.style.display = "inline-block";
        stopBtn.style.display = "none";
      }
    });
  }

  // Confetti Button
  const confettiBtn = document.getElementById("confetti-btn");
  if (confettiBtn) {
    confettiBtn.addEventListener("click", () => confetti({ particleCount: 80, spread: 60 }));
  }

  // Accordion Logic
  const accordions = document.querySelectorAll(".accordion-header");
  accordions.forEach(acc => {
    acc.addEventListener("click", function() { this.parentElement.classList.toggle("active"); });
  });
});

