const BaseResponse = require("../BaseResponse")
const KeywordsFileReader = require("../../service/KeywordsFileReader");

class NothingResponse extends BaseResponse {
    getKeywords() {
        const reader = new KeywordsFileReader('responseTypes/keywords/NothingKeywords.txt');
        return reader.getKeywords();
    }

    getAnswer(userResponse) {
        return `NOTHING`;
    }
}

module.exports = NothingResponse;
