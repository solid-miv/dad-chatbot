const fs = require('fs');
const path = require('path');
const BaseResponse = require('../responseTypes/BaseResponse')

class ResponseStrategy {
    constructor() {
        this.registry = new Map();
        this.instantiateResponseTypes();
    }

    getKeywordsFromResponseTypes() {
        const keywords = [];

        const strategiesFolderPath = path.join("/Users/utilisateur/WebstormProjects/chatbot-dit/backend-dit/responseTypes/impl");

        fs.readdirSync(strategiesFolderPath).forEach((file) => {
            const strategyFilePath = path.join(strategiesFolderPath, file);
            const StrategyClass = require(strategyFilePath);
            const strategyInstance = new StrategyClass();
            const strategyKeywords = strategyInstance.getKeywords();
            keywords.push(...strategyKeywords);
        });

        return keywords;
    }

    instantiateResponseTypes() {
        const strategiesFolderPath = path.join("/Users/utilisateur/WebstormProjects/chatbot-dit/backend-dit/responseTypes/impl");

        fs.readdirSync(strategiesFolderPath)
            .forEach((file) => {
                const strategyFilePath = path.join(strategiesFolderPath, file);
                const StrategyClass = require(strategyFilePath);
                const strategyInstance = new StrategyClass();
                const keywords = strategyInstance.getKeywords();
                keywords.forEach((keyword) => {
                    this.registry.set(keyword, strategyInstance);
                });
            });
    }

    getResponseType(userInput) {
        if (!this.registry.has(userInput)) {
            return new BaseResponse();
        }
        return this.registry.get(userInput);
    }
}

module.exports = ResponseStrategy;
