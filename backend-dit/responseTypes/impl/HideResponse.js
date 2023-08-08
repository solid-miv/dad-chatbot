const BaseResponse = require("../BaseResponse")
const KeywordsFileReader = require("../../service/KeywordsFileReader");

class HideResponse extends BaseResponse {
    getKeywords() {
        const reader = new KeywordsFileReader('responseTypes/keywords/HideKeywords.txt');
        return reader.getKeywords();
    }

    getAnswer(userResponse) {
        return `HIDE`;
    }
}

module.exports = HideResponse;
