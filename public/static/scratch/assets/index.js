const backdrops = require("../../../src/lib/libraries/backdrops.json");
const costumes = require("../../../src/lib/libraries/costumes.json");
const sounds = require("../../../src/lib/libraries/sounds.json");
const sprites = require("../../../src/lib/libraries/sprites.json");

const fs = require("fs");
const https = require("https");

const url = "https://res-cdn.makeblock.com/mblock/static/assets/scratch";

const download = (md5ext) => {
    fs.open(md5ext, (err) => {
        if (err) {
            https
                .get(`${url}/${md5ext}`, (response) => {
                    console.log(console.log(`downloading: ${md5ext}`));
                    response.pipe(fs.createWriteStream(md5ext));
                    console.log(console.log(`downloaded: ${md5ext}`));
                })
                .on("error", (err) => {
                    console.error(`cannot download ${md5ext}: ${err}`);
                });
            return;
        }
        console.log(console.log(`downloaded: ${md5ext}`));
    });
};

backdrops.forEach((backdrop) => {
    console.log("Download Backdrop");
    if (!backdrop.assetId && !backdrop.dataFormat) download(backdrop.md5ext);
    else download(`${backdrop.assetId}.${backdrop.dataFormat}`);
});

costumes.forEach((costume) => {
    console.log("Download Costume");
    if (!costume.assetId && !costume.dataFormat) download(costume.md5ext);
    else download(`${costume.assetId}.${costume.dataFormat}`);
});

sounds.forEach((sound) => {
    console.log("Download Sound");
    if (!sound.assetId && (!sound.dataFormat || sound.dataFormat === ""))
        download(sound.md5ext);
    else download(`${sound.assetId}.${sound.dataFormat}`);
});

sprites.forEach((sprite) => {
    console.log("Download Sprite");
    if (!sprite.assetId && !sprite.dataFormat) download(sprite.md5ext);
    else download(`${sprite.assetId}.${sprite.dataFormat}`);

    sprite.sounds.forEach((sound) => {
        if (!sound.assetId && !sound.dataFormat) download(sound.md5ext);
        else download(`${sound.assetId}.${sound.dataFormat}`);
    });
    sprite.costumes.forEach((costume) => {
        if (!costume.assetId && !costume.dataFormat) download(costume.md5ext);
        else download(`${costume.assetId}.${costume.dataFormat}`);
    });
});

console.log("done");
