const fs = require('fs');

const dataPath = './data/saved-data.json';

/**
 * Data that can be saved and loaded next time bot is opened.
 * @param {Array} ttsBanList Users banned from using TTS.
 * @param {Number} wins Number of Hangman wins.
 * @param {Number} total Number of total Hangman games played.
 * @param {Object} leaderboard Current users who have the highest correct Hangman guesses.
 */
let savedData = {
    ttsBanList: [],
    wins: 0,
    total: 0,
    leaderboard: {}
}

/**
 *
 * @param {Object} newData
 * @param {Boolean} replace
 * - If true, savedData will be replaced with the newData object.
 * - If false, only keys of the same name will be updated with values from newData. Otherwise, key/value pairs
 *   in newData will be added to the savedData object.
 */
const updateSavedData = (newData, replace = false) => {
    if(replace){
        savedData = newData;
    } else {
        savedData = {
            ...savedData,
            ...newData
        };
    }
};

/*
 * Saves the savedData object into a text file to load up next time.
 */
function save() {
    fs.writeFile('saved-data.json', JSON.stringify(savedData), (err) => {
        if (err){
            console.log("saved-data.json save failed.");
        }
    });
}

module.exports = {
    dataPath,
    save,
    savedData,
    updateSavedData
};