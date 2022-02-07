const Discord = require('discord.js')
const client = new Discord.Client()
require('dotenv').config()

const sequelize = require('./utils/database')
const messageController = require('./controllers/message')
const databseController = require('./controllers/database-controller')

sequelize.sync()
    .then((result) => {
        console.log('Success DB was loaded')
    })
    .catch((err) => {
        console.log(err)
    });

function controller(msg) {
    if (msg.content.startsWith("!hello")) {
        msg.reply("world!")
    }

    if (msg.content.startsWith("!display")) {
        msg.reply("nothing to display")
    }

    if (msg.content.startsWith("!view-tutorials")) {
        messageController.getHTBlinks(msg)
    }

    if (msg.content.startsWith("!view-new")) {
        messageController.getUnpublished(msg)
    }

    if (msg.content.startsWith("!add-new-source")) {
        databseController.updateSources(msg)
    }
    if (msg.content.startsWith("!set-published")) {
        databseController.setPublishedAll()
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
    controller(msg)
})

client.login(process.env.DISCORD_BOT_TOKEN)

setInterval(function () {
    databseController.gatherInformation()
}, 5000);


