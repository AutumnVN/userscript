// ==UserScript==
// @name        osu! beatmap source info
// @description add anime/visual novel info to beatmap page so i dont have to look it up manually
// @match       *://osu.ppy.sh/*
// @grant       GM_addStyle
// @version     1.0
// @author      AutumnVN
// ==/UserScript==

onUrlChange();

let u = location.pathname;
new MutationObserver(() => u !== (u = location.pathname) && onUrlChange()).observe(document, { subtree: true, childList: true });

function onUrlChange() {
    if (!location.pathname.match(/^\/beatmapsets\/\d+$/)) return;

    waitUntil(() => document.querySelector('#json-beatmapset') && document.querySelector('.osu-page--generic-compact'), onReady);
}

function waitUntil(condition, callback) {
    if (condition()) callback();
    else setTimeout(() => waitUntil(condition, callback), 100);
}

function onReady() {
    const jsonBeatmapset = JSON.parse(document.querySelector('#json-beatmapset').textContent);

    if (!jsonBeatmapset || !jsonBeatmapset.source) return;

    if (['anime', 'tv size'].some(t => jsonBeatmapset.tags.includes(t)) || jsonBeatmapset.genre.name === 'Anime') {
        const query = `query {
            Media(search: "${jsonBeatmapset.source}", type: ANIME) {
                coverImage {
                    large
                }
                title {
                    english
                    romaji
                }
                startDate {
                    year
                    month
                    day
                }
                siteUrl
                description
            }
        }`;

        fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        }).then(res => res.json()).then(json => {
            const anime = json.data.Media;
            if (!anime) return;

            const div = document.createElement('div');
            div.innerHTML = `
                <div class="osu-bsi-container">
                    <a href="${anime.siteUrl}" target="_blank">
                        <img class="osu-bsi-image" src="${anime.coverImage.large}">
                    </a>
                    <div class="osu-bsi-content">
                        <a class="osu-bsi-title" href="${anime.siteUrl}" target="_blank">${anime.title.english || anime.title.romaji}</a>
                        <p>${anime.startDate.year}${anime.startDate.month ? `-${anime.startDate.month}` : ''}${anime.startDate.day ? `-${anime.startDate.day}` : ''}</p>
                        <p>${anime.description.replace(/<br>(<br>)+/g, '<br><br>')}</p>
                    </div>
                </div>
            `;

            document.querySelector('.osu-page--generic-compact').insertBefore(div, document.querySelector('.osu-page--generic-compact').childNodes[2]);
        });
    }

    if (['visual novel', 'vn', 'eroge'].some(t => jsonBeatmapset.tags.includes(t))) {
        fetch('https://api.vndb.org/kana/vn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filters: ['search', '=', jsonBeatmapset.source],
                fields: 'id, title, released, image.url, image.sexual, image.violence, description'
            })
        }).then(res => res.json()).then(json => {
            const vn = json.results[0];
            if (!vn) return;

            const div = document.createElement('div');
            div.innerHTML = `
                <div class="osu-bsi-container">
                    <a href="https://vndb.org/${vn.id}" target="_blank">
                        <img class="osu-bsi-image${vn.image.sexual > 0.5 || vn.image.violence > 0.5 ? ' osu-bsi-blur' : ''}" src="${vn.image.url}">
                    </a>
                    <div class="osu-bsi-content">
                        <a class="osu-bsi-title" href="https://vndb.org/${vn.id}" target="_blank">${vn.title}</a>
                        ${vn.released ? `<p>${vn.released}</p>` : ''}
                        ${vn.description ? `<p>${vn.description.replace(/\n\n+/g, "\n\n").replace(/\n/g, '<br>').replace(/\[url=(.+?)\](.+?)\[\/url\]/g, '<a href="$1" target="_blank">$2</a>').replace(/\[b\](.+?)\[\/b\]/g, '<b>$1</b>').replace(/\[i\](.+?)\[\/i\]/g, '<i>$1</i>').replace(/\[s\](.+?)\[\/s\]/g, '<s>$1</s>').replace(/\[u\](.+?)\[\/u\]/g, '<u>$1</u>')}</p>` : ''}
                    </div>
                </div>
            `;

            document.querySelector('.osu-page--generic-compact').insertBefore(div, document.querySelector('.osu-page--generic-compact').childNodes[2]);
        });
    }
}

GM_addStyle(`
    .osu-bsi-container {
        display: flex;
        padding: 20px;
    }

    .osu-bsi-image {
        width: 150px;
        height: 210px;
        object-fit: cover;
    }

    .osu-bsi-blur {
        filter: blur(5px) brightness(0.5);
    }

    .osu-bsi-blur:hover {
        filter: blur(0) brightness(1);
    }

    .osu-bsi-content {
        margin-left: 20px;
    }

    .osu-bsi-title {
        font-size: 25px;
        font-weight: bold;
        text-decoration: none !important;
        color: white !important;
        display: block;
        margin-bottom: 10px !important;
    }
`);
