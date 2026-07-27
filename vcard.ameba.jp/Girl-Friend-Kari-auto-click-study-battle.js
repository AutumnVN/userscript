// ==UserScript==
// @name        Girl Friend Kari auto click study battle
// @description Auto click the big pink button for study battle
// @version     1.0
// @author      AutumnVN
// @match       https://vcard.ameba.jp/study/battle*
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-auto-click-study-battle.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-auto-click-study-battle.js
// ==/UserScript==

const offsetX = 100;
const offsetY = 100;

function click() {
    const x = (window.innerWidth / 2) + offsetX;
    const y = (window.innerHeight / 2) + offsetY;
    const targetElement = document.elementFromPoint(x, y);

    if (targetElement) {
        targetElement.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
        targetElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
        targetElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
        targetElement.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    }
}

setInterval(click, 100);
