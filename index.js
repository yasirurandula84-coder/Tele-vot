const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ඔයාගේ Bot Token එක මෙතනට දාන්න (උඩුකමා ඇතුළට)
const token = '8602389613:AAG1xO0ruP996URKCEu5kWYZpAnRsB9bxHI';
const bot = new TelegramBot(token, { polling: true });

bot.on('inline_query', async (query) => {
    const queryText = query.query.trim();
    if (!queryText) return;

    try {
        // Pornhub Web API එකෙන් සර්ච් කිරීම
        const response = await axios.get(`https://www.pornhub.com/webapi/search?search=${encodeURIComponent(queryText)}`);
        const videos = response.data.items || [];

        // මුල් වීඩියෝ 5ක් පමණක් තෝරාගැනීම
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
                description: `දන්නා කාලය: ${video.duration || 'N/A'}`
            };
        });

        await bot.answerInlineQuery(query.id, results);
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
});

console.log('Search Bot එක සාර්ථකව Run වුණා...');
