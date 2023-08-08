const BaseResponse = require("../BaseResponse")
const KeywordsFileReader = require("../../service/KeywordsFileReader");

class FightResponse extends BaseResponse {
    getKeywords() {
        const reader = new KeywordsFileReader('responseTypes/keywords/FightKeywords.txt');
        return reader.getKeywords();
    }

    getAnswer(userResponse) {
        return `FIGHT`;
    }
}

module.exports = FightResponse;
