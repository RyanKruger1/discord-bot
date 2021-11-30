require('dotenv').config()
const FeedMe = require('feedme');
const { link } = require('fs');
const https = require('https');
const Discord = require('discord.js')
const client = new Discord.Client()
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
let location = "global"
let articles = [];

function read() {
    let counter = 0;
    https.get('https://www.secjuice.com/rss/', (res) => {
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
                t: item.title, l: item.link, d: item.description, p: item.pubdate
            }
            articles[counter] = newsItem;
            counter++;

        });
        res.pipe(parser);
    });
}

function controller(msg) {
    if (msg.content.startsWith("!hello")) {
        readCSV()
        msg.reply("world!")
    }
    if (msg.content.startsWith("!display")) {
        display(msg)
    }
}

function display(msg) {
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
                    msg.reply("News\n:"+ item.title +"\n" + item.link+"\n"+item.pubdate)

                });
                res.pipe(parser);
            });
        });
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
    controller(msg)
})

client.login(process.env.DISCORD_BOT_TOKEN)


