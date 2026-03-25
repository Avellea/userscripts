# Slash to Search

A userscript for Tampermonkey or Violentmonkey that lets you press `/` to jump to the search bar on any page, and `Escape` to unfocus it.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Click **Dashboard → Utilities → Import from file** and select `slash-to-search.user.js`
3. Click **Install** when prompted

## Usage

| Key | Action |
|-----|--------|
| `/` | Focus the search bar |
| `Escape` | Unfocus the search bar |

The `/` shortcut only fires when you're not already typing in a field.

## Excluding a Site

Open the script in the editor and add the domain to the `excludedSites` list near the top:

```js
const excludedSites = [
  "example.com",
];
```

## Adding a Site-Specific Selector

If the script doesn't find the search bar on a particular site, you can add a custom CSS selector to the `siteRules` object:

```js
const siteRules = {
  "example.com": "input#search",
};
```
