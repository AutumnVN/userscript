// ==UserScript==
// @name        Girl Friend Kari redirect
// @description Redirect various vcard.ameba.jp urls to reduce click
// @version     1.0
// @author      AutumnVN
// @match       https://vcard.ameba.jp/*
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-redirect.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-redirect.js
// ==/UserScript==

if (location.href === 'https://vcard.ameba.jp/card/sell-card-list#/index') {
    location.replace('https://vcard.ameba.jp/card/sell-card-list#/point/index');
}

if (location.href === 'https://vcard.ameba.jp/cupid') {
    const cupidTab = document.querySelector('#js_ticketCupidTab');
    cupidTab.click();
}
