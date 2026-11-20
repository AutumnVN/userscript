// ==UserScript==
// @name        MangaDex canary.mangadex.org redirect
// @description Redirect mangadex.org to canary.mangadex.org
// @match       *://mangadex.org/*
// @run-at      document-start
// @version     1.0
// @author      AutumnVN
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/mangadex.org/MangaDex-canary.mangadex.org-redirect.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/mangadex.org/MangaDex-canary.mangadex.org-redirect.js
// ==/UserScript==

if (location.hostname === 'mangadex.org') {
    const newUrl = `https://canary.mangadex.org${location.pathname}${location.search}${location.hash}`;
    location.replace(newUrl);
}
