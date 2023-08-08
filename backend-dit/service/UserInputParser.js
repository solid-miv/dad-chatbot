const ResponseStrategy = require("../service/ResponseStrategy");
let responseStrategy = new ResponseStrategy();


class UserInputParser {
    parseUserInput(userInput) {
        const keywords = responseStrategy.getKeywordsFromResponseTypes();
        const matchingKeywords = keywords.filter((keyword) =>
            userInput.toUpperCase().includes(keyword.toUpperCase())
        );
        return matchingKeywords[Math.floor(Math.random() * matchingKeywords.length)];
    }
}

module.exports = UserInputParser;
