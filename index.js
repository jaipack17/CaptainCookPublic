//botvariables

const Discord = require("discord.js");
const client = new Discord.Client();
const mongoose = require('mongoose');
const botconfig = require("./botconfig.json");
const token = botconfig.token;

//api

const Fs = require("fs");
const DBL = require("dblapi.js");
const dbl = new DBL(token, client);

//commandprefix

const prefix = "chef ";


//database

mongoose.connect(botconfig.mongoPass, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 

//database setup

const Data = require("./models/data.js");
const { disconnect } = require("process");
const { waitForDebugger } = require("inspector");

//api events

client.on("ready", () => {
    console.log("Chef is online");
    client.user.setActivity('chefs cook | chef help', { type: 'WATCHING' })
    setInterval(() => {
        dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
    }, 1800000);
});

dbl.on('posted', () => {
    console.log('Server count posted!');
})

dbl.on('error', e => {
    console.log(`Oops! ${e}`);
})


//commands

client.on("message", async (message) => {
    if (message.content.startsWith(prefix)) {
        var args = message.content.substr(prefix.length)
            .toLowerCase()
            .split(" ");
            
            if(args[0] == "userinfo"){
                let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        
        
                const embed = new Discord.MessageEmbed()
                    .setTitle(`${user.user.username}`)
                    .setColor(`BLUE`)
                    .setThumbnail(user.user.displayAvatarURL({dynamic : true}))
                    .addFields(
                        {
                            name: "Name: ",
                            value: user.user.username,
                            inline: true
                        },
                        {
                            name: "#️⃣ Discriminator: ",
                            value: `#${user.user.discriminator}`,
                            inline: true
                        },
                        {
                            name: " ID: ",
                            value: user.user.id,
                        },
                        {
                            name: "Activity: ",
                            value: user.presence.activities[0] ? user.presence.activities[0].name : `User isn't playing, listening or streaming!`,
                            inline: true
                        },
                        {
                            name: 'Creation Date: ',
                            value: user.user.createdAt.toLocaleDateString("en-us"),
                            inline: true
                        },
                        {
                            name: 'Joined Date: ',
                            value: user.joinedAt.toLocaleDateString("en-us"),
                            inline: true
                        },
                        {
                            name: 'User Roles: ',
                            value: user.roles.cache.map(role => role.toString()).join(" ,"),
                            inline: true
                        }
                    )
        
                 message.channel.send(embed)
                }
            if(args[0] == "poll"){
                let pollChannel = message.mentions.channels.first();
                let pollDescription = args.slice(1).join(' ');
        
                let embedPoll = new Discord.MessageEmbed()
                .setTitle(`${message.author.username}'s Poll`)
                .setDescription(pollDescription)
                .setColor('ORANGE')
                .setFooter(`${message.author.username} created a poll. React with any of the emojis below`)
                message.channel.send({embed: embedPoll}).then(embedMessage => {
                    embedMessage.react("👍");
                    embedMessage.react("👎");
                });

                
            }    
            if(args[0] == "generate"){
                let num = args.slice(1).join(' ');
                let check = Math.floor(Math.random() * num);
                let embedPoll = new Discord.MessageEmbed()
                .setTitle(`${message.author.username}'s Number`)
                .setDescription(`The generated number between 0 and ${num} is ${check}!`)
                .setColor('ORANGE')
                message.channel.send(embedPoll);
            }
            if(args[0] == "captain"){
                let WarningEmbed = new Discord.MessageEmbed();
                    var botIcon = client.user.displayAvatarURL();
                    WarningEmbed.setThumbnail(botIcon);
                    WarningEmbed.setTitle("**HELLO THANKS FOR INVITING ME TO YOUR SERVER!**");
                    WarningEmbed.setColor("GREEN");
                    WarningEmbed.setDescription(`I am CaptainCook (Gordon Ramsay) and my prefix is "chef ". Captain cook is a fun bot. Cook different and delicious foods, work at restaurants, earn money and live a life as a chef! SETUP: type "chef start"`);
                    WarningEmbed.addField("To know about my commands type: ", "chef help");
                message.channel.send(WarningEmbed);    
            }
            if(args[0] == "rolldice"){
                let check = Math.floor(Math.random() * 6);
                check = check + 1;
                let messagee = new Discord.MessageEmbed();
                messagee.setColor("ORANGE");
                if(check == 6){
                    messagee.setDescription(`${message.author.username} rolled a dice and it landed on a ${check}. ${message.author.username} gets to roll again!`)
                    message.channel.send(messagee);
                    let a = Math.floor(Math.random() * 6);
                    a = a + 1
                    if(a == 6){
                        message.channel.send("Well you rolled a 6 again. But this time you dont get to roll it again.")
                    }
                    else{
                        messagee.setDescription(`${message.author.username} rolled a dice again and it landed on a ${a}.`)
                        message.channel.send(messagee);
                    }

                }
                else{
                    messagee.setDescription(`${message.author.username} rolled a dice and it landed on a ${check}`)
                    message.channel.send(messagee)
                }
            }
        if(args[0] == "help"){
            var botIcon = client.user.displayAvatarURL();
            let success = new Discord.MessageEmbed();
            success.setColor("ORANGE");
            success.setTitle("Command Catergories");
            success.setThumbnail(botIcon);
            success.addField("🔨Utility commands:", `Type "chef helputility"`);
            success.addField("🎮Captain Cook Game commands:", `Type "chef helpgame"`);
            success.addField("✅Captain Cook Christmas Themed Moderation:", `Type "chef helpmod (COMING SOON)"`);
            success.setFooter("Don't worry, more commands and categories like moderation, fun, game etc are been developed. They will be added soon!");
            message.channel.send(success);
        }

        if(args == "helputility"){
            let success = new Discord.MessageEmbed();
            success.setTitle("🔨Utility Commands");
            success.setColor("ORANGE");
            success.addField("chef updates", "Displays latest updates of Captain Cook");
            success.addField("chef serverinfo", "Displays server information");
            success.addField("chef userinfo <@user>", "Displays user's information" )
            success.addField(`chef poll your question`, "Creates a yes or no poll for you!" )
            success.addField(`chef generate number`, "Generates a random number between 0 to given number" )
            success.addField("chef rolldice", "Rolls a dice for you. Best for board games!")
            message.channel.send(success);
        }
        if(args == "helpgame"){

            let WarningEmbed = new Discord.MessageEmbed();
                WarningEmbed.setTitle("**🎮Captain Cook Game Commands**");
                WarningEmbed.setColor("GREEN");
                WarningEmbed.addField("Prefix", "chef. Example: chef power");
                WarningEmbed.addField("chef start", "Begin your journey as a chef");
                WarningEmbed.addField("chef daily", "Claim your daily reward");
                WarningEmbed.addField("chef bal (mention player(optional))", "Check the amount of money you have");
                WarningEmbed.addField("chef profile (mention player(optional))", "Check your rank and salary");
                WarningEmbed.addField("chef stroll", "Go for a stroll and have a 50% chance of getting money upto $100");
                WarningEmbed.addField("chef fridge", "View your cooked dishes");
                WarningEmbed.addField("chef fight (mention user)", "Fight with a user, either lose, get caught or get payed");
                WarningEmbed.addField("chef cook", "Learn how to cook");
                WarningEmbed.addField("chef ing", "View all ingredients available");
                WarningEmbed.addField("chef recbook", "View recipes of all dishes");
                WarningEmbed.addField("chef bonus", "Check for available promotions");
                WarningEmbed.addField("chef clean", "Clean the kitchen and get upto 25$");
                WarningEmbed.addField("chef work", "Work and earn money. Complete Orders");
                WarningEmbed.addField("chef joke", "Crack a joke and get upto 50$");
                WarningEmbed.addField("chef ranks", "View all available ranks and perks");
                message.channel.send(WarningEmbed);
        }
        if(args[0] == "updates"){
            let m = new Discord.MessageEmbed()
            .setColor("YELLOW")
            .setThumbnail(client.user.displayAvatarURL({dynamic : true}))
            .setTitle("Captain Cook's Latest Updates!")
            .setDescription("These are the latest captain cook updates and teasers. Stay tuned for more.")
            .addField("Christmas Themed Moderation Commands (COMING SOON)", "Type chef helpmod")
            .setFooter("Updated on 13th December 2020")
            message.channel.send(m);
        }
        if (args[0] == "start") {
            if(!args[0]){
                var user = message.author;
            } 
            Data.findOne({
                userID: message.author.id

            }, (err, data) => {
                if(err) console.log(err);
                if(!data){
                    const newData = new Data({
                        name: message.author.username,
                        userID: message.author.id,
                        bal: 0,
                        lastclaim: 0,
                        goldenknife: 0,
                        rank: "Junior Chef",
                        salary: 400,
                        worked: 0,
                        failed: 0,
                        wellingtons: 0,
                        salmons: 0,
                        steaks: 0,
                        scallops: 0,
                        risottos: 0,
                        pizzas: 0,
                        burgers: 0,
                        chickendinners: 0
                    })
                    newData.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setColor("GREEN")
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setDescription("You have successfullly started your carrier as a chef!");
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**OOPS**");
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You are already a chef!");
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if (args[0] == "daily") {
            Data.findOne({
                userID: message.author.id

            }, (err, data) => {
                if(err) console.log(err);
                if(!data){
                    message.channel.send("You can't run that command. Type chef start")
                }
                else{
                    if (Math.floor(new Date().getTime() - data.lastclaim) / (1000 * 60 * 60 * 24) < 1) {
                        let WarningEmbed = new Discord.MessageEmbed()
                        WarningEmbed.setTitle("**OOPS**");
                        WarningEmbed.setColor("RED");
                        WarningEmbed.setDescription("The 24 hour cooldown is yet to be completed to claim another daily reward.");
                        message.channel.send(WarningEmbed);
                        return;
                    } else {
                        data.bal += 500;
                        data.lastclaim = new Date().getTime();
                        data.save().catch(err => console.log(err));
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setTitle("**BINGO**");
                        SuccessEmbed.setColor("GREEN");
                        SuccessEmbed.setDescription("You have claimed your daily reward of 500 Cash!");
                        message.channel.send(SuccessEmbed);
                        return;
                    }
                }
                
            })
        }

        if (args[0] == "bal") {
            let mentioned = message.mentions.members.first();
            if(mentioned){
                
                Data.findOne({
                    userID: mentioned.id
    
                }, (err, data) => {
                    if(err) console.log(err);
                    if(!data){
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setColor("RED")
                        SuccessEmbed.setTitle("**OOPS**");
                        SuccessEmbed.setDescription("The person is not a chef");
                        message.channel.send(SuccessEmbed);
                        return;
                    } else {
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setTitle(`${data.name}'s BALANCE`);
                        SuccessEmbed.setColor("ORANGE")
                        SuccessEmbed.setDescription(`Cash: $${data.bal}`);
                        message.channel.send(SuccessEmbed);
                        return;
                    }
                    return;
                })
            }
            else{
                Data.findOne({
                    userID: message.author.id
    
                }, (err, data) => {
                    if(err) console.log(err);
                    if(!data){
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setColor("RED")
                        SuccessEmbed.setTitle("**OOPS**");
                        SuccessEmbed.setDescription("You need to be a chef in order to check your balance. (chef start)");
                        message.channel.send(SuccessEmbed);
                        return;
                    } else {
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setTitle(`${message.author.username}'s BALANCE`);
                        SuccessEmbed.setColor("ORANGE")
                        SuccessEmbed.setDescription(`Cash: $${data.bal}`);
                        message.channel.send(SuccessEmbed);
                        return;
                    }
                })
            }
            

        }
        if (args[0] == "profile") {
            let mentioned = message.mentions.members.first();

            if(mentioned){
                Data.findOne({
                    userID: mentioned.id
    
                }, (err, data) => {
                    if(err) console.log(err);
                    if (!data) {
                        let WarningEmbed = new Discord.MessageEmbed()
                        WarningEmbed.setTitle("**HEY!**");
                        WarningEmbed.setColor("RED");
                        WarningEmbed.setDescription("That person is not a chef.");
                        message.channel.send(WarningEmbed);
                        return;
                    } else {
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setTitle(`${mentioned.username}'s PROFILE`);
                        SuccessEmbed.setColor("ORANGE")
                        SuccessEmbed.addField(`Rank:`, `${data.rank}`);
                        SuccessEmbed.addField("Salary:", `${data.salary}`);
                        SuccessEmbed.addField("Orders Completed:", `${data.worked}`);
                        message.channel.send(SuccessEmbed);
                        return;
                    }
                })
            }
            else{
                Data.findOne({
                    userID: message.author.id
    
                }, (err, data) => {
                    if(err) console.log(err);
                    if (!data) {
                        let WarningEmbed = new Discord.MessageEmbed()
                        WarningEmbed.setTitle("**OOPS**");
                        WarningEmbed.setColor("RED");
                        WarningEmbed.setDescription("You need to be a chef in order to check your profile.");
                        message.channel.send(WarningEmbed);
                        return;
                    } else {
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setTitle(`${message.author.username}'s PROFILE`);
                        SuccessEmbed.setColor("ORANGE")
                        SuccessEmbed.addField(`Rank:`, `${data.rank}`);
                        SuccessEmbed.addField("Salary:", `${data.salary}`);
                        SuccessEmbed.addField("Orders Completed:", `${data.worked}`);
                        message.channel.send(SuccessEmbed);
                        return;
                    }
                })
    
            }
            
        }
        }
        if(args == "stroll"){
            Data.findOne({
                userID: message.author.id

            }, (err, data) => {
                if(err) console.log(err);
                if (!data) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    let check = Math.floor(Math.random() * 3);
                    let money = Math.floor(Math.random() * 100 + -50);
                    if(check == 1){
                        money = money * -1;
                    }
                    if(money < 0){
                        money = 0;
                    }
                    data.bal += money;
                    data.save().catch(err => console.log(err));
                    if(money > 0){
                            message.channel.send(`${message.author.username} went outside for a stroll and found ${money} dollars on the floor.`)
                        }
                        else{
                            message.channel.send(`${message.author.username} went outside for a stroll and found a bottle cap on the floor.`)
                        }
                   
                }
            })
 
        }
        if(args == "fridge"){
            Data.findOne({
                userID: message.author.id

            }, (err, data) => {
                if(err) console.log(err);
                if (!data) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You need to be a chef in order to view your fridge (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`${message.author.username}'s **FRIDGE**`);
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("All your cooked dishes are stored here excluding orders");
                    SuccessEmbed.addField("Wellingtons:", data.wellingtons);
                    SuccessEmbed.addField("Salmons: ",data.salmons);
                    SuccessEmbed.addField("Scallops:", data.scallops);
                    SuccessEmbed.addField("Steaks: ", data.steaks);
                    SuccessEmbed.addField("Risottos: ", data.risottos);
                    SuccessEmbed.addField("Pizzas: ", data.pizzas);
                    SuccessEmbed.addField("Burgers: ", data.burgers);
                    SuccessEmbed.addField("Chicken Dinners: ", data.chickendinners);
                    message.channel.send(SuccessEmbed);
                }
            })
 
        }
        if(args == "cook"){
            let SuccessEmbed = new Discord.MessageEmbed();
            SuccessEmbed.setTitle("**COOK COMMANDS**");
            SuccessEmbed.setDescription("**HERE IS HOW YOU CAN COOK FOR YOURSELF.**")
            SuccessEmbed.setColor("BLUE");
            SuccessEmbed.setFooter(`Use the prefix "chef". And then continue adding ingredients using "+" in alphabetical order. If you dont know about the ingredients, type "chef ing" You can also look for recipes, type "chef recbook". All dishes excluding that of orders are added in the fridge.`)
            SuccessEmbed.addField("How to cook food during orders?", `"Use the recipes or type "fridge" if you have the food stored in the fridge. If you use recipes, do not type "chef" before the ingredients.`)
            message.channel.send(SuccessEmbed);
        }
        if(args == "ing"){
            let SuccessEmbed = new Discord.MessageEmbed();
            SuccessEmbed.setTitle("**INGREDIENTS**");
            SuccessEmbed.setColor("BLUE");
            SuccessEmbed.setFooter(`All ingredients: salt, rawbeef, butter, rawsalmon, rawscallops, rawdough, rice, red sauce, pepperoni, buns, tomato, lettuce, rawchicken`)
            message.channel.send(SuccessEmbed);
        }
        if(args == "butter+rawbeef+rawdough+salt"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.wellingtons += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked a wellington! 1 wellington has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })


        }
        if(args == "rawsalmon+salt"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.salmons += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked a salmon! 1 salmon has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if(args == "rawscallops+salt"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.scallops += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked scallops! 1 plate of scallops has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if(args == "butter+rawbeef+salt"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.steaks += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked a steak! 1 steak has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if(args == "butter+rice+salt"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.risottos += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked a risotto! 1 risotto has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if(args == "pepperoni+rawdough+redsauce"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.pizzas += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully baked a pizza! 1 pizza has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if(args == "buns+lettuce+rawbeef+redsauce+tomato"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.burgers += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked a burger! 1 burger has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }
        if(args == "butter+rawchicken+salt"){
            Data.findOne({
                userID: message.author.id

            }, (err, fridge) => {
                if(err) console.log(err);
                if (!fridge) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    fridge.chickendinners += 1;
                    fridge.save().catch(err => console.log(err));
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle("**BINGO**");
                    SuccessEmbed.setColor("GREEN");
                    SuccessEmbed.setDescription("You have succesfully cooked a chicken dinner! A chicken dinner has been added to your Fridge!")
                    message.channel.send(SuccessEmbed);
                    return;
                }
            })
        }         
        if(args == "clean"){              
                Data.findOne({
                    userID: message.author.id
    
                }, (err, data) => {
                    if(err) console.log(err);
                    if (!data) {
                        let SuccessEmbed = new Discord.MessageEmbed();
                        SuccessEmbed.setTitle(`OOPS`);
                        SuccessEmbed.setColor("RED")
                        SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                        message.channel.send(SuccessEmbed);
                        return;
                    } else {
                        let check = Math.floor(Math.random() * 3);
                        let money = Math.floor(Math.random() * 25 + 1);
                        if(check == 1){
                            money = money * -1;
                        }
                        if(money < 0){
                            money = 0;
                        }
                        data.bal += money;
                        data.save().catch(err => console.log(err));
                        if(money > 0){
                                message.channel.send(`${message.author.username} cleaned the whole kitchen and got $${money} as a tip from Chef Gordon`)
                            }
                            else{
                                message.channel.send(`${message.author.username} made the whole kitchen hell, Chef Gordon made you an idiot sandwich LOL.`)
                            }
                       
                    }
                })
           
        }

        if(args == "recbook"){
            let SuccessEmbed = new Discord.MessageEmbed();
            SuccessEmbed.setColor("GREEN");
            SuccessEmbed.setTitle("**RECIPE BOOK**");
            SuccessEmbed.setDescription("Find all recipes here");
            SuccessEmbed.addField("Wellington: ", "<prefix> butter+rawbeef+rawdough+salt");
            SuccessEmbed.addField("Salmon: ", "<prefix> rawsalmon+salt");
            SuccessEmbed.addField("Scallops: ", "<prefix> rawscallops+salt");
            SuccessEmbed.addField("Steak: ", "<prefix> butter+rawbeef+salt");
            SuccessEmbed.addField("Risotto: ", "<prefix> butter+rice+salt");
            SuccessEmbed.addField("Pizza:", "<prefix> pepperoni+rawdough+redsauce");
            SuccessEmbed.addField("Burger:", "<prefix> buns+lettuce+rawbeef+redsauce+tomato");
            SuccessEmbed.addField("Chicken Dinner:", "<prefix> butter+rawchicken+salt");
            message.channel.send(SuccessEmbed);
        }
        if(args == "bonus"){
            Data.findOne({
                userID: message.author.id

            }, (err, data) => {
                if(err) console.log(err);
                if (!data) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    let message2 = new Discord.MessageEmbed();
                    message2.setColor("BLUE")
                    message2.setTitle(`The promotions will only be available in some cases. Type "chef ranks" to check when promotions are available!`)
                    message.channel.send(message2);
                    
                    if(data.rank == "Executive Chef"){
                        if(data.worked >= 240){
                            data.rank = "Head Chef";
                            data.salary = 3000;
                            let promote = new Discord.MessageEmbed();
                            promote.setColor("GREEN");
                            promote.setTitle(`${message.author.username} has been promoted!`);
                            message.channel.send(promote);
                            data.save().catch(err => console.log(err));
                        }
                   }
                   else if(data.rank == "Sous Chef"){
                    if(data.worked >= 180){
                        data.rank = "Executive Chef";
                        data.salary = 2400;
                        let promote = new Discord.MessageEmbed();
                        promote.setColor("GREEN");
                        promote.setTitle(`${message.author.username} has been promoted!`);
                        message.channel.send(promote);
                        data.save().catch(err => console.log(err));
                    }
                    }
                    else if(data.rank == "Senior Chef"){
                        if(data.worked >= 120){
                            data.rank = "Sous Chef";
                            data.salary = 1800;
                            let promote = new Discord.MessageEmbed();
                            promote.setColor("GREEN");
                            promote.setTitle(`${message.author.username} has been promoted!`);
                            message.channel.send(promote);
                            data.save().catch(err => console.log(err));
                        }
                        }
                    else if(data.rank == "Junior Chef"){
                            if(data.worked >= 60){
                                data.rank = "Senior Chef";
                                data.salary = 1000;
                                let promote = new Discord.MessageEmbed();
                                promote.setColor("GREEN");
                                promote.setTitle(`${message.author.username} has been promoted!`);
                                message.channel.send(promote);
                                data.save().catch(err => console.log(err));
                            }
                    }
                }
                
            })
            
        }
        if(args == "ranks"){
            let ranks = new Discord.MessageEmbed();
            ranks.setColor("BLUE");
            ranks.setTitle("ALL AVAILABLE RANKS");
            ranks.addField("Junior Chef. Salary: 400$ per work task", "Requirement: Default Rank");
            ranks.addField("Senior Chef. Salary: 1000$ per work task", "Requirement: Complete 60 orders");
            ranks.addField("Sous Chef. Salary: 1800$ per work task", "Requirement: Complete 120 orders");
            ranks.addField("Executive Chef. Salary: 2400$ per work task", "Requirement: Complete 180 orders");
            ranks.addField("Head Chef. Salary: 3000$ per work task", "Requirement: Complete 240 orders");
            ranks.addField("More ranks will be added in future updates", "Stay tuned!");
            message.channel.send(ranks);
        }
        if(args == "joke"){
            Data.findOne({
                userID: message.author.id

            }, (err, data) => {
                if(err) console.log(err);
                if (!data) {
                    let SuccessEmbed = new Discord.MessageEmbed();
                    SuccessEmbed.setTitle(`OOPS`);
                    SuccessEmbed.setColor("RED")
                    SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                    message.channel.send(SuccessEmbed);
                    return;
                } else {
                    let money = Math.floor(Math.random() * 50 - 25 );
                    if(money < 0){
                        money = 0;
                    }
                    data.bal += money;
                    data.save().catch(err => console.log(err));
                    if(money > 0){
                        message.channel.send(`${message.author.username} made a really funny joke about Chef Gordon and recieved ${money} dollars from the fellow cooks`)                        }
                        else{
                            message.channel.send(`${message.author.username} made a really good joke about Chef Gordon but unfortunately got caught LOL`);                        }
                   
                }
            })
        }
    });

    //work 

    client.on("message", async (message) => {
        if(message.content.startsWith(prefix)) {
            var args = message.content.substr(prefix.length)
                .toLowerCase()
                .split(" ");
                if(args == "work"){
                    Data.findOne({
                        userID: message.author.id
        
                    }, (err, data) => {
                        if(err) console.log(err);
                        if (!data) {
                            let SuccessEmbed = new Discord.MessageEmbed();
                            SuccessEmbed.setTitle(`OOPS`);
                            SuccessEmbed.setColor("RED")
                            SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                            message.channel.send(SuccessEmbed);
                            return;
                        } else {
                            if(data.rank == "Unemployed"){
                                data.rank = "Junior Chef";
                                data.salary = 400;
                                let success = new Discord.MessageEmbed();
                                success.setColor("GREEN");
                                success.setTitle(`${message.author.username} had a tough time being unemployed but now is back with us in the kitchen! You took rest this time. Take another order.`);
                                message.channel.send(success);
                                data.save().catch(err => console.log(err));
                           }
                           if(data.failed >= 8){
                            data.failed = 0
       
                               if(data.rank == "Junior Chef"){
                                data.bal = 0;
                                data.salary = 0;
                                data.rank = "Unemployed";
                                data.worked = 0;
                                data.save().catch(err => console.log(err));
                                   let fire = new Discord.MessageEmbed();
                                   fire.setColor("RED");
                                   fire.setTitle(`YOU HAVE BEEN FIRED BECAUSE OF FAILING TOO MANY ORDERS! YOUR ORDER WAS ALSO CANCELLED`);
                                   message.channel.send(fire);
                               }
                               else if(data.rank == "Senior Chef"){
                                data.salary = 400
                                data.rank = "Junior Chef";
                                data.worked = 0;
                                data.save().catch(err => console.log(err));
                                   let demote = new Discord.MessageEmbed();
                                   demote.setColor("RED");
                                   demote.setTitle(`You have been demoted because of failing too many orders in the past! Your order was also cancelled`);
                                   message.channel.send(demote);
                                   
                               }
                               else if(data.rank == "Sous Chef"){
                                data.salary = 1000
                                data.rank = "Senior Chef";
                                data.worked = 60;
                                data.save().catch(err => console.log(err));
                                   let demote = new Discord.MessageEmbed();
                                   demote.setColor("RED");
                                   demote.setTitle(`You have been demoted because of failing too many orders in the past! Your order was also cancelled`);
                                   message.channel.send(demote);
                                   
                               }
                               else if(data.rank == "Executive Chef"){
                                   let demote = new Discord.MessageEmbed();
                                   demote.setColor("RED");
                                   demote.setTitle(`You have been demoted because of failing too many orders in the past! Your order was also cancelled`);
                                   message.channel.send(demote);
                                   data.salary = 1800
                                   data.rank = "Sous Chef";
                                   data.worked = 120;
                                   data.save().catch(err => console.log(err));
                                   
                               }
                               else if(data.rank == "Head Chef"){
                                data.salary = 2400
                                data.rank = "Executive Chef";
                                data.worked = 180;
                                   let demote = new Discord.MessageEmbed();
                                   demote.setColor("RED");
                                   demote.setTitle(`You have been demoted because of failing too many orders in the Past! Your order was also cancelled`);
                                   message.channel.send(demote);
                                   data.save().catch(err => console.log(err));
                                   
                               }
                               
                               
                           }                            
                        }
                        return;
                       
                    })
                    
                    
                    let check = Math.floor(Math.random() * 8);
                    if(check == 0){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a wellington without the prefix or use the command "fridge" if you have already cooked a wellington. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    if (!data) {
                                        let SuccessEmbed = new Discord.MessageEmbed();
                                        SuccessEmbed.setTitle(`OOPS`);
                                        SuccessEmbed.setColor("RED")
                                        SuccessEmbed.setDescription("You cannot run that command because you are not a chef (chef start)")
                                        message.channel.send(SuccessEmbed);
                                        return;
                                    } if(data.wellingtons == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY WELLINGTONS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.wellingtons > 0){
                                        message.channel.send("Oh thank god you could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.wellingtons -= 1;
                                            
                                            if(data.wellingtons <= 0){
                                                data.wellingtons = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "butter+rawbeef+rawdough+salt"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Oh thank god you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "butter+rawbeef+rawdough+salt" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook a litte wellington can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
                        
                                
                        
                    }
                    if(check == 1){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a salmon without the prefix or use the command "fridge" if you have already cooked a salmon. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.salmons == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY SALMONS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.salmons > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.salmons -= 1;
                                            
                                            if(data.salmons <= 0){
                                                data.salmons = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "rawsalmon+salt"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "rawsalmon+salt" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook a litte salmon can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
                        
                                
                        
                    }
                    if(check == 2){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a plate of scallops without the prefix or use the command "fridge" if you have already cooked scallops. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.scallops == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY SCALLOPS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.scallops > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.scallops -= 1;
                                            
                                            if(data.scallops <= 0){
                                                data.scallops = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "rawscallops+salt"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "rawscallops+salt" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook litte scallops can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
                        
                    }
                    if(check == 3){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a steak without the prefix or use the command "fridge" if you have already cooked a steak. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.steaks == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY STEAKS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.steaks > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.steaks -= 1;
                                            
                                            if(data.steaks <= 0){
                                                data.steaks = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "butter+rawbeef+salt"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "butter+rawbeef+salt" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook a little steak can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
            
                    }
                    if(check == 4){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a risotto without the prefix or use the command "fridge" if you have already cooked a risotto. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.risottos == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY RISOTTOS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.risottos > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.risottos -= 1;
                                            
                                            if(data.risottos <= 0){
                                                data.risottos = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "butter+rice+salt"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "butter+rice+salt" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook a little risotto can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
            
                    }
                    if(check == 5){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Bake a pizza without the prefix or use the command "fridge" if you have already baked a pizza. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.pizzas == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY PIZZAS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.pizzas > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.pizzas -= 1;
                                            
                                            if(data.pizzas <= 0){
                                                data.pizzas = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "pepperoni+rawdough+redsauce"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "pepperoni+rawdough+redsauce" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't bake a little pizza can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
            
                    }
                    if(check == 6){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a burger without the prefix or use the command "fridge" if you have already cooked a burger. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.burgers == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY BURGERS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.burgers > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.burgers -= 1;
                                            
                                            if(data.burgers <= 0){
                                                data.burgers = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "buns+lettuce+rawbeef+redsauce+tomato"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "buns+lettuce+rawbeef+redsauce+tomato" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook a little burger can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
            
                    }
                    if(check == 7){
                        let order = new Discord.MessageEmbed();
                        order.setColor("BLUE");
                        order.setTitle(`${message.author.username}'s ORDER`);
                        order.setDescription(`Cook a chicken dinner without the prefix or use the command "fridge" if you have already cooked a chicken dinner. Within 30 seconds!`);
                        message.channel.send(order);
                        try{
                            let msgs = await message.channel.awaitMessages(u2=>u2.author.id === message.author.id, {time: 30000, max: 1});
                            if(msgs.first().content == "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                     if(data.chickendinners == 0) {
                                        let error = new Discord.MessageEmbed();
                                        error.setColor("RED");
                                        error.setTitle("COMMAND FAILED. YOU DONT HAVE ANY CHICKEN DINNERS IN YOUR FRIDGE. ORDER COULD NOT BE COMPLETED");
                                        message.channel.send(error);
                                        return;
                                    }
                                    else if(data.chickendinners > 0){
                                        message.channel.send("Yes! You could complete the order. Good that you were already prepared with the dish. Well done. Here's your salary");
                                        let success = new Discord.MessageEmbed();
                                        data.worked += 1
                                        data.failed = 0
                                        success.setColor("GREEN");
                                        success.setTitle("**PAY OUT SUCCESSFUL!**");
                                        const salary = data.salary;
                                        data.bal += salary;
                                       
                                            data.chickendinners -= 1;
                                            
                                            if(data.chickendinners <= 0){
                                                data.chickendinners = 0;
                                            }
                                            data.save().catch(err => console.log(err));
                                        return message.channel.send(success);;
                                    }
                                })

                            }
                            else if(msgs.first().content == "butter+rawchicken+salt"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                message.channel.send("Nice, you could complete the order. Well done. Here's your salary");
                                let success = new Discord.MessageEmbed();
                                data.worked += 1
                                data.failed = 0
                                success.setColor("GREEN");
                                success.setTitle("**PAY OUT SUCCESSFUL!**");
                                const salary = data.salary;
                                data.bal += salary;
                                data.save().catch(err => console.log(err));
                                message.channel.send(success);
                            }) 
                                return;
                            }
                            else if(msgs.first().content != "butter+rawchicken+salt" && msgs.first().content != "fridge"){
                                Data.findOne({
                                    userID: message.author.id
                    
                                }, (err, data) => {
                                    if(err) console.log(err);
                                    data.failed += 1
                                    data.save().catch(err => console.log(err));
                                })    

                                
                                return message.channel.send("HEY YOU! You can't cook a chicken dinner can you? Get out! You did not get the salary for not completing the order");
                                
                                
                            }


                        }catch(e){
                        }
                    
                }

        }        
    }  
    });
     
    //utility

    client.on("message", async (message) => {
        if (message.content.startsWith(prefix)) {
            var args = message.content.substr(prefix.length)
                .toLowerCase()
                .split(" ");  
            if(args == "serverinfo"){
                let owner = message.guild.owner;
                let membercount = message.guild.memberCount
                const embed = new Discord.MessageEmbed()
                    .setThumbnail(message.guild.iconURL({dynamic : true}))
                    .setColor('BLUE')
                    .setTitle(`${message.guild.name}`)
                    .addFields(
                        {
                            name: "Owner: ",
                            value: owner,
                            inline: true
                        },
                        {
                            name: "Member-Count: ",
                            value: `${membercount} members! Keep Growing!`,
                            inline: true
                        },
                        {
                            name: "Date Created At: ",
                            value: message.guild.createdAt,
                            inline: true
                        },
                        {
                            name: "Roles Count: ",
                            value: `${message.guild.roles.cache.size} roles`,
                            inline: true,
                        },
                        {
                            name: `Verified: `,
                            value: message.guild.verified ? 'Server is verified!' : `Server isn't verified yet`,
                            inline: true
                        },
                        {
                            name: 'Server Boosters: ',
                            value: message.guild.premiumSubscriptionCount >= 1 ? `${message.guild.premiumSubscriptionCount} Boosters. POG` : `There are no boosters`,
                            inline: true
                        },
                        {
                            name: "Emojis: ",
                            value: message.guild.emojis.cache.size >= 1 ? `There are ${message.guild.emojis.cache.size} emojis!` : 'There are no emojis' ,
                            inline: true
                        }
                    )
                message.channel.send(embed)
            }
            if(args[0] == "fight"){
                let mentioned = message.mentions.members.first();
                
            if(mentioned){
                if(mentioned.id != message.author.id){
                    Data.findOne({
                        userID: message.author.id
                    }, (err, data) => {


                            const check = Math.floor(Math.random() * 3 + 1);
                            if(check == 2){
                               
                                let money = Math.floor(Math.random() * 500 + 1);
                                data.bal -= money;
                                if(data.bal < 0){
                                    data.bal = 0
                                }
                                data.save().catch(err => console.log(err));
                                message.channel.send(`Chef caught ${message.author.username} fighting with ${mentioned.user.username}. ${message.author.username} had to pay $${money} to Chef LOL`)
                            }
                            if(check == 3){
    
                                const c = Math.floor(Math.random() * 6);
                                const lose = require("./lose.json");
                                const x = lose.reason[c];
                                const money = Math.floor(Math.random() * 500);
                                data.bal -= money;
                                if(data.bal < 0){
                                    data.bal = 0;
                                }
                                data.save().catch(err => console.log(err));
                                message.channel.send(`${message.author.username} ${x} ${mentioned.user.username}. ${message.author.username} lost $${money} to ${mentioned.user.username} `)
                            }
                            if(check == 1){
    
                                const money = Math.floor(Math.random() * 500);
                                data.bal += money;
                                data.save().catch(err => console.log(err));
                                message.channel.send(`${message.author.username} landed a great hit on ${mentioned.user.username}. ${message.author.username} got $${money}!`)
                            
                        }
                        
                    })
                }
                else if (mentioned.id == message.author.id){
                    Data.findOne({
                        userID: message.author.id
        
                    }, (err, data) => {
                        if(err) console.log(err);
                            let SuccessEmbed = new Discord.MessageEmbed();
                            SuccessEmbed.setTitle(`HEY!`);
                            SuccessEmbed.setColor("RED")
                            SuccessEmbed.setDescription(`Why are you so interested in punching yourself in the face. Mention a different user to fight!`);
                            message.channel.send(SuccessEmbed);
                            return;
                        
                    })
                }
                
            }
            
            }


        }
        
    
    });

client.login(token);
