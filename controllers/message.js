const sequelize = require('../utils/database')
const articles = require('../models/article');

const Seq = require('sequelize')
const Op = Seq.Op;


exports.getHTBlinks = (msg) => {
    articles.findAll({
        where: {
            link: {
                [Op.like]: '%htb%'
            }
        }
    }).
        then(results => {
            results.forEach(element => {
                msg.reply(element.link);
            });
        }).
        catch(err => {
            client.channels.cache.get(process.env.ERROR_CHANNEL).send('[ERROR]:' + err);
        })
}

exports.getUnpublished = (msg) =>{
    articles.findAll({ where: { published: false } }).
            then(results => {
                results.forEach(element => {
                    msg.reply(element.link);
                    articles.update({
                        published: true
                    },
                        { where: { link: element.link } })
                });
            }).
            catch(err => {
                client.channels.cache.get(process.env.ERROR_CHANNEL).send('[ERROR]:' + err);
            })
}
