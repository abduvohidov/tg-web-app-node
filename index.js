const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '6730420971:AAF8O-GR3R9Kq2mimFL41Bzjb0tJHNDoIqk';
const webAppUrl = 'https://telegram-web-app-react.netlify.app';

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
        await bot.sendMessage(chatId, 'Welcome to my online shop', {
            reply_markup: {
                keyboard: [
                    [{
                        text: 'Enter form',
                        web_app: { url: webAppUrl + '/form' }
                    }]
                ]
            }
        });
        await bot.sendMessage(chatId, 'Enter to online shop', {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Order',
                        web_app: { url: webAppUrl }
                    }]
                ]
            }
        });
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Your country: ' + data?.country);
            }, 1000)
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Your street: ' + data?.street);
            }, 1500)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Your street: ' + data?.subject);
            }, 2000)

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Enter to online shop', {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Order',
                                web_app: { url: webAppUrl }
                            }]
                        ]
                    }
                });
            }, 2500)

        } catch (e) {
            console.log(e)
        }
    }
});

app.post('/web-data', async (req, res) => {
    const { queryId, prosucts, totalPrice } = req.body;

    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Success',
            input_message_content: {
                message_text: 'Ordered Price: ' + totalPrice
            }
        });
        return res.status(500).json({});
    } catch (error) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'unsuccess',
            input_message_content: {
                message_text: 'unsuccess'
            }
        });
    }
    return res.status(200).json({});
})

const PORT = 8080;

app.listen(PORT,
    () => console.log('server started on PORT ' + PORT)
)