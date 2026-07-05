const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const http = require('http');

// ⚠️ ඔයාගේ ඇත්තම Bot Token එක මේ උඩුකමා ඇතුළට දාන්න
const token = '8602389613:AAG1xO0ruP996URKCEu5kWYZpAnRsB9bxHI';
const bot = new TelegramBot(token, { polling: true });

// Render එකේ බොට් එක Live තියාගන්න හදන පොඩි සර්වර් එක
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
        // 🚀 මෙන්න මේක තමයි EPORNER එකේ කෙලින්ම වැඩ කරන API ලින්ක් එක
        const response = await axios.get(`https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(queryText)}&per_page=5&thumbsize=big`);
        const videos = response.data.videos || [];

        const results = videos.map((video, index) => {
            return {
                type: 'article',
                id: String(index),
                title: video.title,
                input_message_content: {
                    message_text: `🎥 **${video.title}**\n\n🍿 **කාම යහන™ — Official Channel**\n━━━━━━━━━━━━━━━━━━\n📥 **වීඩියෝ එක බලන්න මෙතනින් යන්න:**\n🔗 ${video.url}`,
                    parse_mode: 'Markdown'
                },
                thumb_url: video.default_thumb.src,
                description: `Duration: ${video.length_min} min | HD: ${video.hd ? 'Yes' : 'No'}`
            };
        });

        await bot.answerInlineQuery(query.id, results);
    } catch (error) {
        console.error('Error fetching videos:', error.message);
    }
});

console.log('Search Bot එක සාර්ථකව Run වුණා...');
