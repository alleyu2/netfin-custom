(() => {
  // Avoid duplicate listeners if the injector runs again.
  if (window.__netfinTop10CarouselFix) return;
  window.__netfinTop10CarouselFix = true;

  const top10Ids = new Set([
    "custom-1792455350614",
    "custom-1792463008640"
  ]);

  document.addEventListener("click", event => {
    if (!document.documentElement.classList.contains("layout-desktop")) {
      return;
    }

    const button = event.target.closest?.(
      '.emby-scrollbuttons button[data-direction="left"]'
    );
    if (!button || button.disabled) return;

    const section = button.closest("[data-section-id]");
    if (!section || !top10Ids.has(section.dataset.sectionId)) return;

    const scroller = section.querySelector(".emby-scroller");
    const track = scroller?.querySelector(".itemsContainer");
    const builder = window.cardBuilder;

    if (
      !scroller || !track ||
      track.dataset.layout === "grid" ||
      scroller.classList.contains("scrollX") ||
      typeof builder?.setScrollerPosition !== "function"
    ) return;

    const cards = [...track.children].filter(card =>
      card.classList.contains("card") &&
      !card.classList.contains("skeleton-card")
    );
    if (!cards.length) return;

    // Match the existing carousel's visible-card calculation.
    const frameStyle = getComputedStyle(scroller);
    const cardStyle = getComputedStyle(cards[0]);
    const frame = scroller.getBoundingClientRect();

    const padLeft = parseFloat(frameStyle.paddingLeft) || 0;
    const padRight = parseFloat(frameStyle.paddingRight) || 0;
    const cardPadLeft = parseFloat(cardStyle.paddingLeft) || 0;
    const cardPadRight = parseFloat(cardStyle.paddingRight) || 0;

    const visibleLeft = frame.left + padLeft;
    const visibleRight = visibleLeft +
      Math.max(0, scroller.clientWidth - padLeft - padRight);

    const visible = [];
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (
        rect.width > 0 &&
        rect.left + cardPadLeft >= visibleLeft - 1 &&
        rect.right - cardPadRight <= visibleRight + 1
      ) visible.push(index);
    });

    const firstVisible = visible.length ? visible[0] : 0;
    const step = Math.max(1, visible.length);

    // Only override a Previous click that returns to the first card.
    if (firstVisible - step > 0) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    builder.setScrollerPosition(scroller, 0, true);
  }, true);
})();