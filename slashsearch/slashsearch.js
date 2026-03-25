// ==UserScript==
// @name         Slash to Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press / to focus the search bar, Escape to unfocus.
// @author       You
// @match        *://*/*
// @grant        none
// @icon         https://i.imgur.com/i2bCI8P.png
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        document.activeElement?.isContentEditable;
      if (isEditable) document.activeElement.blur();
      return;
    }

    // Only trigger on bare "/" key, not with modifiers
    if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;

    // Don't hijack "/" if the user is already typing in an input/textarea/etc.
    const tag = document.activeElement?.tagName?.toLowerCase();
    const isEditable =
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      document.activeElement?.isContentEditable;

    if (isEditable) return;

    const searchInput = findSearchInput();
    if (!searchInput) return;

    e.preventDefault();
    searchInput.focus();
    if (typeof searchInput.selectionStart === "number") {
      const len = searchInput.value.length;
      searchInput.setSelectionRange(len, len);
    }
  });

  function findSearchInput() {
    // 1. <input type="search">
    const typeSearch = document.querySelector('input[type="search"]');
    if (typeSearch && isVisible(typeSearch)) return typeSearch;

    // 2. role="searchbox" or role="search" containing an input
    const roleSearchbox = document.querySelector('[role="searchbox"]');
    if (roleSearchbox && isVisible(roleSearchbox)) return roleSearchbox;

    const roleSearch = document.querySelector('[role="search"] input');
    if (roleSearch && isVisible(roleSearch)) return roleSearch;

    // 3. Common name/id/placeholder heuristics
    const heuristicSelectors = [
      'input[name*="search" i]',
      'input[id*="search" i]',
      'input[placeholder*="search" i]',
      'input[aria-label*="search" i]',
      'input[name="q"]',
      'input[name="query"]',
    ];
    for (const sel of heuristicSelectors) {
      const el = document.querySelector(sel);
      if (el && isVisible(el)) return el;
    }

    // 4. Site-specific overrides
    const siteRules = {
      "makerworld.com":
        "#__next > div > div.mw-css-4dxx6y > div.side-menu-expanded.side-menu-layout.mw-css-1i4b4hj > main > header > div.mw-css-1acs3iu > div > div > div.mw-css-9wd6o5 > input[type=text]",
    };
    for (const [domain, selector] of Object.entries(siteRules)) {
      if (location.hostname.includes(domain)) {
        const el = document.querySelector(selector);
        if (el && isVisible(el)) return el;
      }
    }

    // 5. Fallback: any visible text input inside a <header> or <nav>
    const containerSelectors = [
      "header",
      "nav",
      '[class*="header" i]',
      '[class*="navbar" i]',
      '[class*="topbar" i]',
    ];
    for (const container of containerSelectors) {
      const el = document.querySelector(
        `${container} input[type="text"], ${container} input:not([type])`,
      );
      if (el && isVisible(el)) return el;
    }

    // 6. Last resort: first visible text input on the page
    const allInputs = document.querySelectorAll(
      'input[type="text"], input:not([type])',
    );
    for (const el of allInputs) {
      if (isVisible(el)) return el;
    }

    return null;
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    const style = getComputedStyle(el);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0"
    );
  }
})();
