// ==UserScript==
// @name        GTNH wiki.gtnewhorizons.com redirect
// @description Redirect gtnh.miraheze.org to wiki.gtnewhorizons.com
// @match       *://gtnh.miraheze.org/*
// @run-at      document-start
// @version     1.0
// @author      AutumnVN
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/gtnh.miraheze.org/GTNH-wiki.gtnewhorizons.com-redirect.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/gtnh.miraheze.org/GTNH-wiki.gtnewhorizons.com-redirect.js
// ==/UserScript==

if (location.hostname === 'gtnh.miraheze.org') {
    const newUrl = `https://wiki.gtnewhorizons.com${location.pathname}${location.search}${location.hash}`;
    location.replace(newUrl);
}
