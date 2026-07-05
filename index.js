const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// ඔයාගේ Bot Token එක මෙතනට දාන්න
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// 💡 Render එකේ බොට් එක Sleep වෙන්නේ නැති වෙන්න හදන පොඩි සර්වර් එකක්
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running smoothly!\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});

// Inline සර්ච් එක වැඩ කරන කොටස
bot.on('inline_query', async (query) => {
    const queryText = query.query.trim();
    if (!queryText) return;

    try {
        const response = await axios.get(`https://www.pornhub.com/webapi/search?search=${encodeURIComponent(queryText)}`);
        const videos = response.data.items || [];

        const results = videos.slice(0, 5).map((video, index) => {
            return {
                type: 'article',
                id: String(index),
                title: video.title,
                input_message_content: {
                    message_text: `🎥 **${video.title}**\n\n🍿 **කාම යහන™ — Official Channel**\n━━━━━━━━━━━━━━━━━━\n📥 **වීඩියෝ එක බලන්න මෙතනින් යන්න:**\n🔗 ${video.url}`,
                    parse_mode: 'Markdown'
                },
                thumb_url: video.thumb,
                description: `Duration: ${video.duration || 'N/A'}`
            };
        });

        await bot.answerInlineQuery(query.id, results);
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
});

console.log('Search Bot එක සාර්ථකව Run වුණා...');
