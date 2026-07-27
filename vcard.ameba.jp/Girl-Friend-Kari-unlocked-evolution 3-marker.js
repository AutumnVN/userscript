// ==UserScript==
// @name        Girl Friend Kari unlocked evolution 3 marker
// @version     1.0
// @description Mark cards already have their evolution 3 unlocked with ✅
// @author      AutumnVN
// @match       https://vcard.ameba.jp/*
// @homepageURL https://github.com/AutumnVN/userscript
// @downloadURL https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-unlocked-evolution-3-marker.js
// @updateURL   https://github.com/AutumnVN/userscript/raw/main/vcard.ameba.jp/Girl-Friend-Kari-unlocked-evolution-3-marker.js
// ==/UserScript==

const evo3GroupIds = new Set();
const hashToGroupId = new Map();

async function fetchCollection(page = 1) {
    const payload = [
        {
            key: "collectionData",
            api: "collection/cards",
            data: {
                name: "",
                actorName: "",
                sphere: "ALL",
                rarity: "",
                evolutionStage: "",
                grade: "",
                club: "",
                status: "1",
                voice: "0",
                sortDesc: true,
                page: page
            }
        }
    ];

    const response = await fetch("https://vcard.ameba.jp/s/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: "apis=" + encodeURIComponent(JSON.stringify(payload))
    });

    return await response.json();
}

function extractHashFromUrl(url) {
    return url.match(/([a-f0-9]{32})\.jpg/i)?.[1];
}

async function loadCollection() {
    let currentPage = 1, maxPage = 1;

    while (currentPage <= maxPage) {
        const res = await fetchCollection(currentPage);
        const collectionData = res.collectionData;
        maxPage = collectionData.maxPage;

        for (const item of collectionData.list) {
            const groupId = item.card_group_id;
            const hash = extractHashFromUrl(item.card_image_url);
            hashToGroupId.set(hash, groupId);

            if (item.evolution_stage === 3) {
                evo3GroupIds.add(groupId);
            }
        }

        currentPage++;
    }
}

function checkAndMarkImage(img) {
    const hash = extractHashFromUrl(img.src);
    if (!hash) return;

    const groupId = hashToGroupId.get(hash);
    if (groupId && evo3GroupIds.has(groupId) && !img.dataset.evo3Marked) {
        img.dataset.evo3Marked = "true";

        const parent = img.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            const badge = document.createElement('div');
            badge.textContent = '✅';
            badge.style.cssText = `
                    position: absolute;
                    top: 3px;
                    left: 0;
                    font-size: 16px;
                    pointer-events: none;
                `;
            parent.appendChild(badge);
        }
    }
}

function processDOMCards() {
    document.querySelectorAll('img').forEach((img) => {
        if (!img.dataset.evo3Observed) {
            img.dataset.evo3Observed = "true";
            img.addEventListener('load', () => checkAndMarkImage(img));
            checkAndMarkImage(img);
        }
    });
}

async function init() {
    await loadCollection();
    processDOMCards();
    let timer = null;
    const observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(processDOMCards, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
