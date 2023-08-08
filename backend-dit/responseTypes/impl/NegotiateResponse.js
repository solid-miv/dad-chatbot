const BaseResponse = require("../BaseResponse")
const KeywordsFileReader = require("../../service/KeywordsFileReader");

class NegotiateResponse extends BaseResponse {
    getKeywords() {
        const reader = new KeywordsFileReader('responseTypes/keywords/NegotiateKeywords.txt');
        return reader.getKeywords();
    }

    getAnswer(userResponse) {
        return `NEGOTIATE`;
    }
}

module.exports = NegotiateResponse;
