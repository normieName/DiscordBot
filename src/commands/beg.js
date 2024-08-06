const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2"); // clock
const profileModel = require("../models/profileSchema"); // user data

module.exports = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for money"),
    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { lastUsed } = profileData;

        // Cooldown: 5min = 300000
        const cooldown = 300000;
        const timeLeft = cooldown - (Date.now() - lastUsed);

        // Display cooldown
        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            await interaction.reply({
                content: `Claim your next beg in ${hours} hrs ${minutes} min ${seconds} sec`,
                ephemeral: true,
            });
            return;
        }
        //console.log(timeLeft);

        await interaction.deferReply();

        // Determine the amount to increment the balance by
        // A random int between 0-4
        const randomCase = Math.floor(Math.random() * 11);
        let amountToAdd = 0;
        let response = "test";

        switch (randomCase) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                amountToAdd = 5;
                response = "You robbed a tip jar from McDonalds! +$5";
                break;
            case 5:
            case 6:
            case 7:
                amountToAdd = 10
                response = "You get tipped for your lv10 GYATT! +$10";
                break;
            case 8:
            case 9:
                amountToAdd = -10;
                response = "While asleep, Freddy Fazbear fanum TAXED your money! -$10"
                break;
            case 10:
                amountToAdd = 50;
                response = "A sigma male GOONED all over you! +$50"
                break;
            default:
                amountToAdd = 0;
                break;
        }
        console.log(randomCase);


        // Update balance and lastUsed time
        try {
            await profileModel.findOneAndUpdate(
                { userID: id },
                {
                    $set: {
                        lastUsed: Date.now(),
                    },
                    $inc: {
                        balance: amountToAdd,
                    },
                }
            );
        } catch (err) {
            console.log(err);
            await interaction.editReply('There was an error processing your request.');
            return;
        }

        // Display results
        await interaction.editReply(response);
    },
};
