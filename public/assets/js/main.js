/**
 * ポートフォリオの最小限のふるまい。
 * 1. モバイルのメニュー開閉
 * 2. スクロールに追従するナビの現在地表示
 * 3. Projects のしぼりこみ
 * 4. マーキーの複製（ループを途切れさせないため）
 */
(() => {
  'use strict';

  /* ---------- 1. モバイルメニュー ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setNav = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => {
      setNav(!nav.classList.contains('is-open'));
    });

    /* リンクを押したら閉じる */
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') setNav(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 2. 現在地の表示 ---------- */
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    /* 見えている割合をセクションごとに覚えておき、いちばん大きいものを現在地とする */
    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let currentId = null;
        let best = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > best) {
            best = ratio;
            currentId = id;
          }
        }

        for (const link of navLinks) {
          link.classList.toggle('is-current', link.getAttribute('href') === `#${currentId}`);
        }
      },
      /* 上端の 72px は追従ヘッダーのぶん（CSS の --head-h と同じ値） */
      { rootMargin: '-72px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    for (const section of sections) observer.observe(section);
  }

  /* ---------- 3. Projects のしぼりこみ ---------- */
  const chips = [...document.querySelectorAll('.filters .chip')];
  const list = document.getElementById('project-list');

  if (chips.length && list) {
    const count = document.getElementById('project-count');
    const items = [...list.querySelectorAll('.card[data-kind]')];
    /* 3の倍数でない並びになるので、罫線のつじつま合わせに使う空セル */
    const empty = list.querySelector('.card--empty');

    const apply = (filter) => {
      let shown = 0;
      for (const item of items) {
        const match = filter === 'all' || item.dataset.kind === filter;
        item.hidden = !match;
        if (match) shown += 1;
      }

      if (count) count.textContent = String(shown);
      if (empty) empty.hidden = filter !== 'all';
    };

    for (const chip of chips) {
      chip.addEventListener('click', () => {
        for (const other of chips) {
          const on = other === chip;
          other.classList.toggle('is-active', on);
          other.setAttribute('aria-pressed', String(on));
        }

        apply(chip.dataset.filter);
      });
    }
  }

  /* ---------- 4. マーキーの複製 ---------- */
  const track = document.querySelector('.marquee__track');
  if (track && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* 半分ぶんずらすアニメーション（translateX(-50%)）と対にして、切れ目なくループさせる */
    for (const item of [...track.children]) {
      track.append(item.cloneNode(true));
    }
  }
})();
