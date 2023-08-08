const fs = require('fs');
const path = require('path');

class QuestManager {
    constructor() {
        this.availableQuests = this.instantiateQuests();
        this.currentQuest = null;
    }


    instantiateQuests() {
        let availableQuests = []
        const strategiesFolderPath = path.join("/Users/utilisateur/WebstormProjects/chatbot-dit/backend-dit/quests");
        fs.readdirSync(strategiesFolderPath)
            .forEach((file) => {
                availableQuests.push(path.join(strategiesFolderPath, file));
            });
        return availableQuests
    }

    getRandomQuest() {
        let randomQuest = this.availableQuests[Math.floor(Math.random() * this.availableQuests.length)];
        this.availableQuests = this.availableQuests.filter((quest) => quest !== randomQuest);
        return randomQuest;
    }

    getQuestIntro(questPath) {
        let fileContent = fs.readFileSync(questPath, 'utf8');
        let jsonData = JSON.parse(fileContent);
        return jsonData["INTRO"];
    }

    getQuestAction(questPath, action) {
        let fileContent = fs.readFileSync(questPath, 'utf8');
        let jsonData = JSON.parse(fileContent);
        return jsonData[action];
    }

    setCurrentQuest(quest) {
        this.currentQuest = quest;
    }

    getCurrentQuest() {
        return this.currentQuest;
    }

    resetCurrentQuest() {
        this.currentQuest = null;
    }
}

module.exports = QuestManager;
