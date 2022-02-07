const sequelize = require('../utils/database')
const articles = require('../models/article');

const FeedMe = require('feedme');
const https = require('https');
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
const Seq = require('sequelize');
const source = require('../models/source');

const Op = Seq.Op;

exports.gatherInformation = () => {
    try {

        source.findAll()
            .then((items) => {
                items.forEach(element => {
                    https.get(element.link, (res) => {
                        if (res.statusCode != 200) {
                            console.error(new Error(`status code ${res.statusCode}`));
                            return;
                        }
                        let parser = new FeedMe();
                        parser.on('title', (title) => {
                            console.log('title of feed is', title);
                        });
                        parser.on('item', (item) => {
                            articles.findAll({
                                where: {
                                    link: item.link
                                }
                            })
                                .then((results) => {
                                    if (results.length == 0) {
                                        articles.create({
                                            link: item.link,
                                            description: item.description,
                                            publicationDate: item.pubdate,
                                            title: item.title,
                                            published: false,
                                            source: element.link
                                        })
                                        console.log('Created results')
                                    }
                                })
                                .catch((err) => {
                                    client.channels.cache.get(process.env.ERROR_CHANNEL).send('[ERROR]:' + err);
                                });
                        });
                        res.pipe(parser);
                    });


                });
            }).catch(err => {
                console.log('[ERROR]:' + err)
            })

    } catch (error) {
        console.log('[ERROR]:' + error)
    }
}

exports.setPublishedAll = (msg) => {
    articles.update({ published: true }, { where: { published: false } })
    console.log('done')
}

exports.updateSources = (msg) => {
    let newSource = msg.content.split(' ')[1];
    try {
        https.get(newSource, (response) => {
            if (response.statusCode != 200) {
                msg.reply('Site could not be reached. Status Code:' + response.statusCode)
                return
            }

            const feeder = new FeedMe();
            feeder.on('item', item => {
                console.log(item)
            })

            source.findAll({ where: { link: newSource } })
                .then((results) => {
                    if (results.length == 0) {
                        source.create({
                            link: newSource
                        })
                        msg.reply(newSource + ` was added Successfully.`)
                    } else {
                        msg.reply(newSource + ` already exists.`)
                    }
                }).catch(err => {
                    msg.reply(newSource + ' could not be added at this time')
                    client.channels.cache.get(process.env.ERROR_CHANNEL).send('[ERROR]: Adding new source Unsuccessfull:' + err);
                })

        })
    } catch (error) {
        console.log(error);
        if (error.code == 'ERR_INVALID_URL') {
            msg.reply('[ERROR]:invalid url');
        }
    }
}
