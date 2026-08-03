// ==UserScript==
// @name        Girl Friend Kari speedup animation
// @description Speed up animation to reduce waiting time
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      AutumnVN
// @match       https://vcard.ameba.jp/*
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-speedup-animation.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-speedup-animation.js
// ==/UserScript==

const SPEED_MULTIPLIER = 16;
const originalSetTimeout = window.setTimeout;
const originalSetInterval = window.setInterval;
const originalRequestAnimationFrame = window.requestAnimationFrame;

window.setTimeout = function (callback, delay, ...args) {
    if (document.querySelector('body>canvas, body>div>canvas')) {
        delay = delay / SPEED_MULTIPLIER;
    }
    return originalSetTimeout(callback, delay, ...args);
}

window.setInterval = function (callback, delay, ...args) {
    if (document.querySelector('body>canvas, body>div>canvas')) {
        delay = delay / SPEED_MULTIPLIER;
    }
    return originalSetInterval(callback, delay, ...args);
}

window.requestAnimationFrame = function (callback) {
    return originalRequestAnimationFrame(function (timestamp) {
        if (document.querySelector('body>canvas, body>div>canvas')) {
            timestamp = timestamp * SPEED_MULTIPLIER;
        }
        callback(timestamp);
    });
};
