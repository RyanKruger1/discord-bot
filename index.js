
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
        postedInTheLastDay("Thu, 25 Nov 2021 16:02:38 +0000");
        msg.reply("world!")
    }
    if (msg.content.startsWith("!display")) {
        display(msg)
    }
    if (msg.content.startsWith("!test")) {
        display(msg)
    }
}

function postedInTheLastDay(pubdate) {
    const dates = pubdate.split(',')[1].split(' ')
    let day = dates[1].trim()

    let diffrence = now.getUTCDate(now) - day;
    if (diffrence < 1) {
        return true;
    }
    else {
        return false;
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
    controller(msg)
})

client.login(process.env.DISCORD_BOT_TOKEN)

setInterval(function (){let counter = 0;
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
                    if (postedInTheLastDay(item.pubdate)) {
                        client.channels.cache.get(process.env.CHANNEL).send("News\n:" + item.title + "\n" + item.link + "\n" + item.pubdate)
                    }
                });
                res.pipe(parser);
            });
        });
    
},86400000);


