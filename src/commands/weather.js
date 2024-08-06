const { SlashCommandBuilder } = require("discord.js");
const openai = require("../utils/openAi");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Get weather from Chat-GPT")
        .addStringOption((option) =>
            option
                .setName("location")
                .setDescription("The weather of specified location.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const location = interaction.options.getString("location");
        const createChatCompletion = async () => {
            try {
                const chatCompletion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are a chatbot that tells the current weather of given location. Give response in 2 sentences." },
                        { role: "user", content: location },
                    ],
                });
                console.log(chatCompletion.choices[0].message);
                await interaction.editReply(chatCompletion.choices[0].message);
            } catch (error) {
                console.error('Error creating chat completion:', error);
            }
        };

        createChatCompletion()
    },
};
