# CapK's Twitch Bot

Hi everybody! I am [CapK999](https://www.twitch.tv/capk999), a Splatoon 2 Salmon Run streamer on Twitch. If you have watched my stream, I am sure you would know I have a quite annoying Text-to-Speech spam machine and viewer would rather play Hangman instead of chatting with me! If you ever wondered what I used to make my stream like so, this repository is the source code of my Twitch Bot that I use.. 

I have decided to make my bot open source because I know many people are interested in some features I have on my bot. I do hope some of my fellow streamers in the community will use my bot and/or make contributions towards improving or even adding new features to my bot! 

## Description

I created this Twitch Bot because I wanted some features that were unavailable to me through other public Twitch bots like Stream Elements. I always turn my bot on whenever I stream to make my streams more interesting and engaging for my viewers.

As of right now my bot has these main functions:
1. **Text-to-speech:** I have text to speech enabled on my bot. Viewers can type a Twitch message in my chat and my computer will read the message out loud. Text-to-speech is also enabled with a custom message in certain events such as subscriptions, bit cheers, raids, gift subscriptions, etc. 
2. **Hangman:** I have a working Hangman game that viewers can play. The bot picks a random word and viewers in my chat have 6 shared lives to correctly guess the word by guessing letters or guessing the word. Users have a 30 second cooldown for guessing letters and a 90 second cooldown for guessing words. There is also a scoreboard to see who the best players are. To read about the rules of the game, [click here](https://en.wikipedia.org/wiki/Hangman_(game)).  
3. **Custom Lurk:** Custom lurk command that tells users how long they were lurking! 

There may be more features added in the future, so make sure to keep an eye out on this repository for those!

## Installation

1. Download [node.js](https://nodejs.org/en/). You can do either the recommended for most users version or latest version, I do not believe it matters. 
2. Create a folder somewhere on your computer. You can name it anything you want, but I do not suggest using spaces in the name. 
   - In my example, I will just create a folder called `TwitchBot` on my Desktop. 
3. If you are on a Mac, open Terminal. If you are on Windows, open the Command Prompt by searching cmd. 
4. Go inside the folder you just created on step two on your command line prompt. In my case, I typed `cd Desktop/TwitchBot` inside the command prompt and clicked enter.  
5. Once you are inside your Twitch Bot inside your command prompt, type the following and press enter:
   - `npm install node.js`
   - `npm install say`
6. Get the contents of this repository into your TwitchBot folder. 
   - **For git users/programmers:** This only works if you have `git` already installed on your computer. If you would like to install git, [click here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). To do so, just type `git clone https://github.com/ys8672/capk-twitch-bot.git` in your terminal/command prompt and press enter. Of course, as a programmer, I will assume you know the commands afterwards to actually get into the folder of content, so make sure to do some `cd capk-twitch-bot-main` if you need to until you actually get to a folder with the contents as listed above. If you get to a folder that has `bot.js`, you are there! However, in later parts of the steps, I will assume all the files on this repository will be in the `TwitchBot` folder to simplify the steps for non-programmers, so please make adjustments accordingly. 
   - **For non-git/non-programmers users:** You can always just click on the green button on this page named `CODE` and click `DOWNLOAD ZIP`. After the download is finished, unzip the file inside your TwitchBot folder. Of course, it is entire possible everything will be inside a new folder like `capk-twitch-bot-main`. In that case, I want you to keep going into these folders until you reach a folder containing 3 folders like `commands`, `data`, `util`, and some text files like `bot.js`, `botOptions.js`, `dictionary.txt`, and `README`. Move everything there into the TwitchBot folder. (Just CTRL + A -> CTRL + X and go back into folder TwitchBot and CTRL + V for the shortcut version!) You can just delete all the empty `capk-twitch-bot-main` folders afterwards. This step is just to reduce the number of unneeded folders. If done successfully, your TwitchBot folder should have 7 files: `commands`, `data`, `util`, `bot.js`, `botOptions.js`, `dictionary.txt`, and `README`.
7. Decide whether your your bot to share your own Twitch channel or create a Twitch channel just for the bot. Once you have made up your mind, log onto Twitch using that account then go to [this website](https://twitchapps.com/tmi/) to get your an authentication token. Click `CONNECT` on that website. 
**PLEASE NOTE: THE TOKEN IS THE PASSWORD THE BOT USES TO CONNECT TO TWITCH. TREAT IT AS A PASSWORD AND DO NOT GIVE IT TO ANYBODY!**
8. Open up the file `botOptions.js`. If you can't open it, open up Notepad or any word editor and open the file from there. 
9. Inside the file, replace three lines:
      1. Change line `username: 'USERNAME-HERE',` to the username of your Twitch Bot, case      sensitive. In my case, it would be `username: 'CapKTwitchBot',`
      2. Change line `password: 'oauth:PASSWORD-HERE',` to the key you have gotten from that website in step 7. PASSWORD-HERE should be some random gibberish of alphanumeric characters. Keep the `oauth:` part at the beginning.
      3. Change line `channels: ['CHANNEL-HERE'],` to the Twitch channel(s) you want the bot to work on, case sensitive. In my case, it would be `channels: ['CapK999'],`.

   In the end, it should look something like this:
      ```javascript
      const options = {
         options: {
             debug: true,
         },
         connection: {
             cluster: 'aws',
             reconnect: true,
         },
         identity: {
             username: 'CapKTwitchBot',
             password: 'oauth:whatevertherandomgibberishcharactershere',
         },
         channels: ['CapK999'],
     };
   ```
10. Save the file and exit Notepad or whatever word editor was used.
11. Go into the command line, make sure you are on the TwitchBot folder, and type `node bot.js`.
12. Congratulations. If everything is done correctly, the bot should be working. 
13. If you want to close your bot, just press CTRL + C or close the command line.

Use the [official Twitch guide](https://dev.twitch.tv/docs/irc) to learn more about how to make Twitch Bots in general.

## Usage

If you have just followed the installation part of this README, you should have the bot working by step 12. The unfortunate thing about using this bot locally is that you have to manually turn it on and off every time for it to work instead of a bot working 24/7 on your channel. Turn on the bot when you want to use it, and turn it off when you are done with it. 

If you close the bot, shut down your computer, and want to open the bot again from a blank slate, here are the steps:

1. Assuming all the file are in TwitchBot folder in your Desktop as the Installation steps above, open your Command Line (cmd) and type `cd Desktop/TwitchBot` and press enter.
2. Type `node bot.js` in your command line and prses enter to start the bot.
3. Your bot should be live. If you want to close the bot, press CONTROL+C or CONTROL+Z. If you closed your bot and want to re-open it, just retype `node bot.js`. If you closed your command line prompt, you will have to start over from step 1 instead.
4. Go to the Twitch account the bot is live in and start typing some commands as listed in the next sections! Play around with it!

## Custom Lurk

I know there are many other public Twitch bots that have a `!lurk` and `!unlurk` command, but this command here does something I wished those bots do. After a user has typed `!lurk` in chat, the bot will record how long the user has been lurking. Next time that same user types anything in chat, the bot will notify them how long they had been lurking! 

**Commands:**
- `!lurk` Tells the broadcaster and chat you will be lurking. However, beneath the hood, the bot will record the time you began lurking. Next time you type anything in chat, the bot will tell you how long you had been lurking! Very self explanatory. 

## Text-to-Speech

Text-to-Speech is one of the essential features of my bot. VIPs and subscribers can use text-to-speech to have their message read out loud on stream! If more than one viewer uses text-to-speech at around the same time, the messages will be read out loud in the order it was received. The broadcaster and moderators on the channel has more commands written below. 

If you are curious how the text-to-speech works behind the scenes, it uses the [say.js](https://www.npmjs.com/package/say) module!

**Commands:**

- `!tts <message>` Main command of the text-to-speech feature. VIPs and subscribers can use this command to have their <message> read out loud by their computer.  
**Example:** VIP viewer CapK999 typing `!tts Hi chat!` has your computer read out `CapK999 says: Hi chat!`.
- `!skip` Skips to the end of the current text-to-speech message. Does nothing if nothing is being read. Only available to the broadcaster and moderators.
- `!clear` Stops reading the current text-to-speech messages and remove any upcoming text-to-speech messages from being read. Does nothing otherwise. Only available to the broadcaster and moderators.
- `!ban <user>` Bans someone from using text-to-speech. Only available to the broadcaster and moderators. If a user is banned, their messages will not be read out loud when the `!tts` command was used. Keep in mind the <user> is case sensitive! Also, banned users will be saved and loaded every time the bot is closed, so they do not have to be re-banned each time the bot is re-opened.  
**Example:** `!ban @CapK999` (The @ symbol is not required, but makes it easier to find users in chat though.)
- `!unban <user>` Un-bans someone so they can use text-to-speech again. Only available to broadcasters and moderators. All other notes from the `!ban` command still applies.  
**Example:** `!unban @CapK999`
- `!off` Turns off the text-to-speech so nobody can use it. If this command is used while there are still messages reading or to be read, those messages will be lost and will not be re-loaded when `!on` is used. Only available to the broadcaster and moderators.
- `!on` Turns on the text-to-speech. Only available to the broadcaster and moderators.

## Hangman

Hangman is a game that can be played by a 2+ people. I will not be explaining the rules of the game, but if you are unsure, be sure to check out the [Wikipedia entry for Hangman](https://en.wikipedia.org/wiki/Hangman_(game)).

However, there are some differences for Hangman for my bot. 
1. Only the broadcaster or moderator can start a Hangman game.
2. Hangman is open to everybody in chat, and anybody is welcome to make a guess.
3. After guessing a letter, there is a 30 second cool down before another letter can be guessed.
4. After guessing a word, there is a 90 second cool down before another word can be guessed. 

Possible words will be stored in the dictionary.txt file. Each line in the text file will be one of the many possible words the bot will random choose.  

**WARNING:** IF YOU PLAN ON CHANGING THE dictionary.txt FILE TO WHATEVER WORDS YOU WANT, MAKE SURE YOU ONLY USE LETTERS FROM A-Z ONLY. DO NOT USE WORDS WITH SPACES, SPECIAL CHARACTERS, NUMBERS, SYMBOLS, OTHER LANGUAGE ALPHABETS, ETC! GUESSING LETTERS WILL ONLY WORK FOR LETTERS BETWEEN A-Z AND IF THE BOT PICKS A WORD WITH THESE SPECIAL CHARACTERISTICS, THE WORD WILL NEVER BE CORRECTLY GUESSED LEGITIMATELY. YOU HAVE BEEN WARNED!  
**TL:DR**- Only use word with letters from a-z.

**OK:** salmon, computer, develop, destination 

**NOT OK:** l0ve, pre-date, Mädchen, ke$ha, 爱 , 🤑, компьютер  



**Commands:**
- `!start` Starts a new Hangman game! Only available to the broadcaster and moderators. Cannot be used if a game is already in progress. If a game has not been started, guessing will do nothing.
- `!end` Manually ends a Hangman game if one is in progress. A game will normally end when the word has been guessed or not guessed, but this command can end a game at anytime. A note of caution, ending the game means all current progress on the Hangman will be lost. Only available to the broadcaster and moderators. 
- `!guess <letter>` Command used to guess letters. Will not work if there is no game, a user is on the 30 second cool down, or a letter from a-z was guessed. Uppercase and lowercase letters both work. After the guess, the bot will tell you if the letter is in the word or not and the game will continue accordingly. Command available to everybody.  
**Example:** `!guess a`
- `!guessword <word>` Command used to guess the word. Will not work if there is no game, on the 90 second cool down, or more than one word was guessed. Uppercase and lower letters in the word all work. After the guess, the bot will tell you if the word is the actualy word and the game will continue accordingly. Command available to everybody.  
**Example:** `!guessword squid`
- `!stats` Tells the person using the command how many Hangman wins they have.
- `!leaderboard` Gives the current top 10 players of Hangman, sorted from top to bottom by the number of wins.

## Miscellaneous

- The file `saved-data.json` inside the data folder contains a list of saved information. **DO NOT ALTER THIS FILE! DOING SO CAN CORRUPT THE BOT! AND DEFINITIVELY NEVER CHANGE THE FILE WHILE THE BOT IS ON!**
- The `dictionary.txt` contains all the possible word for the Hangman that the bot chooses from random. I found a random text file of all the words online from [here](https://github.com/hugsy/stuff/blob/main/random-word/english-nouns.txt). However, you are welcome to replace it with words of your choice. 

## Versions

#### Version 1.0.0 (Released December 15, 2021)
- Official release: This repository is made public. 

## Frequently Asked Questions

**Question: I can't turn on my bot, I am stuck on an instruction, etc.**

**Answer:** Check out the CONTACT ME part of the README further below and ask! Please tell me what steps you are doing, and or what your terminal says to make me try to figure out the problem without too much trouble!

**Question: I want to change a certain minor features of the bot (like changing the number of lives in Hangman to 3 lives instead of 6). How do I do that?**

**Answer:** If you are confident in your programming abilities, you can manually look at the code and change it manually. There are comments that that signify what all the variables and functions do. However, if you have zero clue how to code, you can contact me and I will be happen to make some minor adjustments to your code to fit your wishes.  

**Question: The Text-to-Speech cannot read certain non alphanumeric characters, like German umlauts, Japanese characters, etc. How can I fix this?**

**Answer:** The text-to-speech by default only supports unicode. However, if you want to be able to read things like German umlauts or emojis or anything UTF8 compatible, you can follow the steps below:  

1. Go to a folder called node_modules. Just search it.
2. Go to file say.
3. Go to file platform.
4. Open win32 in a word editor like Notepad.
5. At line 19 you should see a line that starts with `let psCommand = Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer;` Add to the last part of the file this line: `[Console]::InputEncoding = [System.Text.Encoding]::UTF8;`
6. So line 19 should become `let psCommand = Add-Type -AssemblyName System.speech;$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; [Console]::InputEncoding = [System.Text.Encoding]::UTF8;`
7. Save the file and re-open the bot.

Unfortunately, this fix does not support non-Latin letter languages like Chinese, Japanese, Arabic, Russian, etc.

**Question: I see many other features on your Twitch Bot when you stream that do not exist here. Where are those?**

**Answer:** This repository is just what I feel like are the most important features of my bot. Some features do not make sense to bring over here (like an inside joke where it tells how late one of my viewers are to my stream but would not make sense on other streams). Others features could just be in testing on my stream before I make it available here. I either will or will not make these features on this repository sooner or later depending on how I feel about it. 

**Question: I am trying to cheat... I mean get help when you start a Hangman game, but the dictionary.txt file does not have that word. Where am I getting my words on my stream?**

**Answer:** It's a secret to everybody! I simply found a random text file of words online to act as a sample dictionary.txt file for my example. The real word file will most likely never be revealed.

**Question: I only want one feature (e.g. I only want Hangman no TTS!) Is there a way to delete the part I don't want and only have what I want?**

**Answer:** Unfortunately, as of right now, you will just have to type `!off` every time you start the bot to turn off TTS, or never have you or your mods type `!start` to start Hangman games. `!lurk` isn't something I can turn off right now unless you are proficiently in the code and manually delete the correct code. I will definitely be working on something in the future where you can save settings on whether to turn on or off TTS, Hangman, or lurking. 

## Future Plans

This is a list of things I hope to implement on my Twitch Bot in the future. I do not have a date these will be available, nor can I guarantee any of these will be made. Please do not overhype these possible new features.

1. Hard Hangman difficulty.
2. Speed for text-to-speech.
3. Another game, maybe Battleship? 
4. TTS for other languages?
5. Log file for TTS.
6. Hangman and TTS integration.
7. TTS/Hangman other languages support.
8. JSON file with settings saved. 

## Contact Me

If you have any questions/feedback/complaints/praise/love notes/literally anything you want to tell me, you can either talk to me when I am live on [Twitch](https://www.twitch.tv/capk999). You can also contact me via Discord The easiest way to find me is probably to join the [Salmon Run Discord server](https://discord.com/invite/EY3JZqk) and message someone named CapK#5880. 


## Authors and Acknowledgement
- Author: Me of course
- Code Review Buddy: [ProtectedVoid](https://github.com/ProtectedVoid)

## Contributing
If you like to help contribute to helping me improve this repository, feel free to clone my repository and make a pull request! Even if you do not have any programming experience, you are free to suggest new features and they may be added into a future version! 

For major changes, please talk to me directly and make sure you can explain what you are doing and why it is needed.

## License
[MIT](https://choosealicense.com/licenses/mit/)