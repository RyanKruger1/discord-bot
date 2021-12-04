
require('dotenv').config()
const FeedMe = require('feedme');
const { link } = require('fs');
const https = require('https');
const Discord = require('discord.js')
const client = new Discord.Client()
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const now = new Date();


function controller(msg) {
    if (msg.content.startsWith("!hello")) {

        msg.reply("world!")
    }
    if (msg.content.startsWith("!display")) {
        msg.reply("nothing to display")
    }
    if (msg.content.startsWith("!test")) {
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:20:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:19:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:18:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:17:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:16:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:15:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:14:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:13:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:12:07 +0000"));
        console.log(postsInTheLastMinute("Fri, 04 Dec 2021 23:11:07 +0000"));
    }
}

function postedInLast15Minutes(pubdate) {

    let dates = new Date(pubdate.split(',')[1].trim())
    let monthDiff = now.getUTCMonth() - dates.getUTCMonth();
    let dayDiff = now.getUTCDate() - dates.getUTCDate()
    let hourDiff = now.getUTCHours() - dates.getUTCHours()
    let minuteDiff = now.getUTCMinutes() - dates.getUTCMinutes();

    if (monthDiff == 0 || monthDiff < 1) {

        if (dayDiff == 0 || dayDiff < 1) {

            if (hourDiff == 0 || hourDiff < 1) {

                if (minuteDiff < 15 || minuteDiff < -15) {
                    return true
                }
            }
        }
    }

    return false;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
    controller(msg)
})

client.login(process.env.DISCORD_BOT_TOKEN)

setInterval(function () {
    let counter = 0;
    let inputStream = Fs.createReadStream('rsslinks.csv', 'utf8');
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            console.log(row[0]);
            https.get(row[0], (res) => {
                if (res.statusCode != 200) {
                    console.error(new Error(`status code ${res.statusCode}`));
                    return;
                }
                let parser = new FeedMe();
                parser.on('title', (title) => {
                    console.log('title of feed is', title);
                });
                parser.on('item', (item) => {
                    let newsItem = {
                        t: item.title, l: item.link, p: item.pubdate
                    }
                    console.log(newsItem);
                    if (postedInLast15Minutes(item.pubdate)) {
                        client.channels.cache.get(process.env.CHANNEL).send("News\n:" + item.title + "\n" + item.link + "\n" + item.pubdate)
                    }
                });
                res.pipe(parser);
            });
        });

}, 900000);


