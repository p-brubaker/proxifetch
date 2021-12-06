module.exports = function getByName(characters, name) {
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].name === name) {
            return characters[i].url;
        }
    }
    return false;
};
