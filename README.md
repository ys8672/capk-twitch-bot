# CapK's Twitch Bot

Hi everybody! I am [CapK999](https://www.twitch.tv/capk999), a Splatoon 2 Salmon Run streamer on Twitch. I have a custom Twitch Bot that I use when I am live, and this repository is the source code of my Twitch Bot that I use on my [Twitch channel](https://www.twitch.tv/capk999). 

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
   - `npm install say.js`
6. Clone this repository. To do so, just type `git clone https://github.com/ys8672/capk-twitch-bot.git` in your terminal/command prompt and press enter.
7. Decide whether your your bot to share your own Twitch channel or create a Twitch channel just for the bot. Once you have made up your mind, log onto Twitch using that account then go to [this website](https://twitchapps.com/tmi/) to get your an authentication token. Click `CONNECT` on that website. 
**PLEASE NOTE: THE TOKEN IS THE PASSWORD THE BOT USES TO CONNECT TO TWITCH. TREAT IT AS A PASSWORD AND DO NOT GIVE IT TO ANYBODY!**
8. Open up the file `botOptions.js`. If you can't open it, open up Notepad or any word editor and open the file from there. 
9. Inside the file, you will see a line that looks like this: 
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
           username: 'USERNAME-HERE',
           password: 'oauth:PASSWORD-HERE',
       },
       channels: ['CHANNEL-HERE'],
   };
   ```
   What you want to do is replace three lines:
      1. Change `username: 'USERNAME-HERE'` to the username of your Twitch Bot, case      sensitive. In my case, it would be `username: 'CapKTwitchBot'`
      2. Change `password: 'oauth:PASSWORD-HERE'` to the key you have gotten from that website in step 7. PASSWORD-HERE should be some random gibberish of alphanumeric characters. Keep the `oauth:` part at the beginning.
      3. Change `channels: ['CHANNEL-HERE']` to the Twitch channel(s) you want the bot to work on, case sensitive. In my case, it would be `channels: ['CapK999']`.

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
             password: 'oauth:s2uehd9dcbaos03u1nhd812',
         },
         channels: ['CapK999'],
     };
   ```
10. Save the file and exit Notepad or whatever word editor was used.
11. Go into the command line, make sure you are on the TwitchBot folder, and type `node bot.js`.
12. Congratulations. If everything is done correctly, the bot should be working. 

Use the [official Twitch guide](https://dev.twitch.tv/docs/irc) to learn more about how to make Twitch Bots in general.

## Usage

```bash
pip install foobar
```

```python
import foobar

# returns 'words'
foobar.pluralize('word')

# returns 'geese'
foobar.pluralize('goose')

# returns 'phenomenon'
foobar.singularize('phenomena')
```

## Versions

#### Version 1.0.0 (December 25, 2021):
1. 


## FAQs


## Future Plans

1. Hard Hangman difficulty.
2. Speed for text-to-speech.
3. Another game, maybe Battleship? 

## Support



## Authors and Acknowledgement

## Contributing
If you like to help contribute to helping me improve this repository, feel free to clone my repository and make a pull request! Even if you do not have any programming experience, you are free to suggest new features and they may be added into a future version! 

For major changes, please talk to me directly .

## License
[MIT](https://choosealicense.com/licenses/mit/)