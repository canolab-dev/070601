'use strict';

/**
 * Furna V1
 * Common UI
 */

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
});

function renderHeader() {
  const target = document.querySelector('[data-common-header]');

  if (!target) return;

  target.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-header__brand" href="./" aria-label="Furna ホーム">
          Furna
        </a>

        <nav class="site-header__nav" aria-label="メインナビゲーション">
          <a href="./">Home</a>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const target = document.querySelector('[data-common-footer]');

  if (!target) return;

  target.innerHTML = `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <p class="site-footer__brand">Furna</p>
        <p class="site-footer__copyright">
          &copy; ${new Date().getFullYear()} Furna
        </p>
      </div>
    </footer>
  `;
}
