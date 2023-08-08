const fs = require('fs');
const path = require('path');

class KeywordsFileReader {
    constructor(filePath) {
        this.filePath = filePath;
    }

    getKeywords() {
        const keywords = fs.readFileSync(path.resolve(this.filePath), 'utf-8')
            .split(/[\n,]+/)
            .map(word => word.trim());
        return keywords;
    }
}

module.exports = KeywordsFileReader;
