// ==UserScript==
// @name        Girl Friend Kari auto study battle loop
// @description Automates navigation and clicking from study battle result to new study battle (use together with Girl-Friend-Kari-auto-click-study-battle.js)
// @version     1.0
// @author      AutumnVN
// @match       https://vcard.ameba.jp/*
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-auto-study-battle-loop.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-auto-study-battle-loop.js
// ==/UserScript==

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);
    });
}

async function handleNavigation() {
    const hash = window.location.hash;

    if (hash.includes('#study/battle/result')) {
        await waitForElement('[href="#study/quest/select"]');
        window.location.hash = '#study/partner/select';
    }

    if (hash.includes('#study/partner/select')) {
        const orangeArrow = await waitForElement('.arrowOrange');
        if (orangeArrow) {
            orangeArrow.click();
        }
    }

    if (hash.includes('#study/deck/select')) {
        const battleLink = await waitForElement('[href^="/study/battle?stageId"]');
        if (battleLink) {
            battleLink.click();
        }
    }
}

handleNavigation();
window.addEventListener('hashchange', handleNavigation);
