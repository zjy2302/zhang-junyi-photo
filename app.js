(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const loader = document.getElementById("loader");
  const loaderCount = document.getElementById("loader-count");
  const loaderLine = document.querySelector(".loader-line i");
  const scrollProgress = document.querySelector(".scroll-progress i");
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.querySelector(".theme-label");
  const localTime = document.getElementById("local-time");
  const cursor = document.getElementById("cursor");
  const heroPhoto = document.querySelector(".hero-photo");
  const heroTitle = document.querySelector(".hero-title");
  const worksSection = document.querySelector(".works-pin");
  const worksTrack = document.getElementById("works-track");
  const worksCurrent = document.getElementById("works-current");
  const worksProgressBar = document.getElementById("works-progress-bar");
  const workCards = Array.from(document.querySelectorAll(".work-card"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (error) { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (error) { /* Ignore storage errors. */ }
  }

  function setTheme(theme, persist = true) {
    const isLight = theme === "light";
    root.dataset.theme = isLight ? "light" : "dark";
    if (themeLabel) themeLabel.textContent = isLight ? "NIGHT" : "PAPER";
    if (themeToggle) themeToggle.setAttribute("aria-label", isLight ? "切换到暗色主题" : "切换到明亮主题");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isLight ? "#ebe7df" : "#0a0b0b");
    if (persist) safeStorageSet("linyu-v2-theme", root.dataset.theme);
  }

  const savedTheme = safeStorageGet("linyu-v2-theme");
  setTheme(savedTheme === "light" ? "light" : "dark", false);
  themeToggle?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  function updateClock() {
    if (!localTime) return;
    const time = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
    localTime.textContent = `SH ${time}`;
  }
  updateClock();
  window.setInterval(updateClock, 1000);

  function finishLoading() {
    if (body.classList.contains("is-ready")) return;
    body.classList.add("is-ready");
    body.classList.remove("is-loading");
    if (loaderCount) loaderCount.textContent = "100";
    if (loaderLine) loaderLine.style.width = "100%";
  }

  if (reduceMotion.matches) {
    finishLoading();
  } else {
    const start = performance.now();
    const duration = 1350;
    function animateLoader(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const progress = Math.min(99, Math.round(eased * 100));
      if (loaderCount) loaderCount.textContent = String(progress).padStart(2, "0");
      if (loaderLine) loaderLine.style.width = `${progress}%`;
      if (elapsed < 1) requestAnimationFrame(animateLoader);
      else window.setTimeout(finishLoading, 180);
    }
    requestAnimationFrame(animateLoader);
    window.addEventListener("load", () => window.setTimeout(finishLoading, 1250), { once: true });
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "关闭菜单" : "打开菜单");
  });

  primaryNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "打开菜单");
    });
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("menu-open")) return;
    if (primaryNav?.contains(event.target) || menuToggle?.contains(event.target)) return;
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });

  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const observedSections = Array.from(document.querySelectorAll("main section[id]"));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  observedSections.forEach((section) => navObserver.observe(section));

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  if (finePointer.matches) {
    body.classList.add("has-cursor");
    window.addEventListener("pointermove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }, { passive: true });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener("pointerover", (event) => {
      body.classList.toggle("cursor-view", Boolean(event.target.closest(".work-card")));
    });

    document.addEventListener("pointerout", (event) => {
      if (!event.relatedTarget?.closest?.(".work-card")) body.classList.remove("cursor-view");
    });
  }

  const tiltCard = document.querySelector("[data-tilt]");
  if (tiltCard && finePointer.matches && !reduceMotion.matches) {
    tiltCard.addEventListener("pointermove", (event) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tiltCard.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(0)`;
    });
    tiltCard.addEventListener("pointerleave", () => {
      tiltCard.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    });
  }
  let scrollTicking = false;

  function updateWorksTrack() {
    if (!worksSection || !worksTrack) return;
    const isDesktop = window.innerWidth > 900 && !reduceMotion.matches;
    if (!isDesktop) {
      worksTrack.style.transform = "";
      return;
    }

    const sectionTop = worksSection.offsetTop;
    const scrollDistance = Math.max(worksSection.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((window.scrollY - sectionTop) / scrollDistance, 0), 1);
    const paddingRight = parseFloat(getComputedStyle(worksTrack).paddingRight || "0");
    const travel = Math.max(worksTrack.scrollWidth - window.innerWidth + paddingRight, 0);

    worksTrack.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
    if (worksProgressBar) worksProgressBar.style.width = `${progress * 100}%`;
    if (worksCurrent) {
      const index = Math.min(workCards.length, Math.max(1, Math.round(progress * (workCards.length - 1)) + 1));
      worksCurrent.textContent = String(index).padStart(2, "0");
    }
  }

  function updateScrollScene() {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const pageProgress = Math.min(scrollY / maxScroll, 1);

    header?.classList.toggle("is-scrolled", scrollY > 24);
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${pageProgress})`;

    if (heroPhoto && !reduceMotion.matches) {
      const heroOffset = Math.min(scrollY, window.innerHeight);
      heroPhoto.style.transform = `translate3d(0, ${heroOffset * 0.13}px, 0) scale(${1.02 + heroOffset / window.innerHeight * 0.025})`;
    }

    if (heroTitle && !reduceMotion.matches) {
      const heroOffset = Math.min(scrollY / window.innerHeight, 1);
      heroTitle.style.opacity = String(1 - heroOffset * 0.75);
      heroTitle.style.transform = `translateY(${-48 - heroOffset * 8}%)`;
    }

    updateWorksTrack();
    scrollTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollScene);
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollScene, { passive: true });
  updateScrollScene();

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxIndex = document.getElementById("lightbox-index");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxMeta = document.getElementById("lightbox-meta");
  const lightboxDescription = document.getElementById("lightbox-description");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const lightboxClose = document.querySelector(".lightbox-close");
  let activeWork = 0;

  function updateLightbox(index) {
    if (!workCards.length) return;
    activeWork = (index + workCards.length) % workCards.length;
    const card = workCards[activeWork];
    lightboxImage.src = card.dataset.src;
    lightboxImage.alt = card.dataset.title;
    lightboxTitle.textContent = card.dataset.title;
    lightboxMeta.textContent = card.dataset.meta;
    lightboxDescription.textContent = card.dataset.description;
    lightboxIndex.textContent = `${String(activeWork + 1).padStart(2, "0")} / ${String(workCards.length).padStart(2, "0")}`;
  }

  function openLightbox(index) {
    updateLightbox(index);
    lightbox.showModal();
    body.classList.add("modal-open");
  }

  workCards.forEach((card, index) => {
    card.addEventListener("click", () => openLightbox(index));
  });

  lightboxPrev?.addEventListener("click", () => updateLightbox(activeWork - 1));
  lightboxNext?.addEventListener("click", () => updateLightbox(activeWork + 1));
  lightboxClose?.addEventListener("click", () => lightbox.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener("close", () => body.classList.remove("modal-open"));
  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") updateLightbox(activeWork - 1);
    if (event.key === "ArrowRight") updateLightbox(activeWork + 1);
  });

  const journalPreview = document.getElementById("journal-preview");
  const journalPreviewImage = journalPreview?.querySelector("img");
  document.querySelectorAll(".journal-row").forEach((row) => {
    row.addEventListener("pointerenter", () => {
      if (!finePointer.matches) return;
      if (journalPreviewImage) journalPreviewImage.src = row.dataset.preview;
      journalPreview?.classList.add("is-visible");
    });
    row.addEventListener("pointermove", (event) => {
      if (!finePointer.matches || !journalPreview) return;
      journalPreview.style.left = `${event.clientX + 24}px`;
      journalPreview.style.top = `${event.clientY - 30}px`;
    });
    row.addEventListener("pointerleave", () => journalPreview?.classList.remove("is-visible"));
  });
  // posts appended next
  const posts = {
    "city-4am": {
      title: "凌晨四点的城市，比白天更诚实",
      meta: "城市观察 · 2026.08.14 · 6 min",
      body: `
        <p>四点十七分，便利店是这条街上唯一还醒着的东西。自动门每打开一次，冷气就短暂地逃到街面上。店员靠在收银台后面，耳机线从制服领口绕出来，像一条很细的河。</p>
        <p>我坐在马路对面的台阶上，没有急着拿出相机。白天的城市总在要求人做出反应：快一点，再快一点；靠近一点，再靠近一点。凌晨不一样。红绿灯仍然认真工作，但已经很少有人需要它。</p>
        <blockquote>凌晨把城市还给了它自己，也把城市里的人还给了各自。</blockquote>
        <p>后来，一个穿橙色工作服的人推着车经过。他停下来买了瓶水，没有看手机，也没有看时间，只是抬头看了一眼还没有亮的天。我按下快门，声音在空街里显得很突兀。</p>
        <p>那张照片后来有点虚焦。但我一直记得那一刻：我们都在等待天亮，却谁也不确定天亮以后要去哪里。</p>`
    },
    "seaside-wait": {
      title: "关于等待：在海边坐了三个小时",
      meta: "拍摄手记 · 2026.06.02 · 4 min",
      body: `
        <p>天气预报说日落时间是十八点四十三分。我提前两个小时到达海边，找了一块还算干燥的礁石，把相机放在膝盖上。风从右侧吹来，带着盐和一点金属味。</p>
        <p>一个小时以后，云层开始变厚。两个小时以后，原本金色的海面变成了灰色。真正到了十八点四十三分，太阳只是从云后面露出很淡的一小块光，很快又消失。</p>
        <blockquote>我本来想拍日落，最后却只拍下三张模糊的海。也许等待本身，就已经是出行的一部分。</blockquote>
        <p>回程的公交车上，我翻看相机里的照片，几乎没有一张值得留下。可奇怪的是，我并不觉得这次出门是浪费。那三个小时里，我听见了七次潮水靠近，看到一群鸟贴着海面飞过，还和一个钓鱼的人聊了十分钟。</p>
        <p>他没问我在拍什么，只说今天不会有大鱼。我说今天可能也没有日落。他笑了一下，说，那也挺好，海又不用交作业。</p>`
    },
    "twelve-frames": {
      title: "一卷胶片只拍了十二张",
      meta: "日常片段 · 2026.03.19 · 5 min",
      body: `
        <p>我最近常常带一台旧相机出门。它的计数器坏了，只能在心里记着，自己已经拍了几张。不知道为什么，这种不确定反而让按下快门变得郑重。</p>
        <p>数码相机很好，它允许我不断尝试、修正、比较。可是胶片只剩有限的机会时，我开始问自己一个更慢的问题：这一幕真的值得被记住吗？</p>
        <blockquote>限制并没有让记录变少，反而让每一次记录更接近记忆。</blockquote>
        <p>一个下午过去，我只拍了十二张。有人从树下经过，有风吹动晾在阳台上的床单，有一辆自行车靠在红色的墙边。没有一张是宏大的风景，但洗出来以后，我记得每一张照片前后发生了什么。</p>
        <p>也许摄影真正保存的，不只是一个画面。它是按下快门前那一秒的犹豫，是镜头以外没有出现的人，也是很久以后，看见照片时忽然回来的风。</p>`
    }
  };

  const postDialog = document.getElementById("post-dialog");
  const postTitle = document.getElementById("post-title");
  const postMeta = document.getElementById("post-meta");
  const postContent = document.getElementById("post-content");
  const postClose = document.querySelector(".post-close");
  const closePostButtons = document.querySelectorAll("[data-close-post]");

  document.querySelectorAll("[data-post]").forEach((button) => {
    button.addEventListener("click", () => {
      const post = posts[button.dataset.post];
      if (!post || !postDialog) return;
      postTitle.textContent = post.title;
      postMeta.textContent = post.meta;
      postContent.innerHTML = post.body;
      postDialog.showModal();
      body.classList.add("modal-open");
      postDialog.querySelector(".post-sheet").scrollTop = 0;
    });
  });

  function closePost() {
    if (postDialog?.open) postDialog.close();
  }

  postClose?.addEventListener("click", closePost);
  closePostButtons.forEach((button) => button.addEventListener("click", closePost));
  postDialog?.addEventListener("click", (event) => {
    if (event.target === postDialog) closePost();
  });
  postDialog?.addEventListener("close", () => body.classList.remove("modal-open"));

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2100);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const input = document.createElement("textarea");
      input.value = text;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
  }

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      await copyText(button.dataset.copy);
      showToast("Email copied");
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();


