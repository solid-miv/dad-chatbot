const BaseResponse = require("../BaseResponse")
const KeywordsFileReader = require("../../service/KeywordsFileReader");

class FinishResponse extends BaseResponse {
    getKeywords() {
        const reader = new KeywordsFileReader('responseTypes/keywords/FinishKeywords.txt');
        return reader.getKeywords();
    }

    getAnswer(userResponse) {
        return `FINISH`;
    }
}

module.exports = FinishResponse;