const express = require('express');
const app = express();

const bodyParser = require("body-parser");
const ResponseStrategy = require("./service/ResponseStrategy");
const Conversation = require("./model/Conversation");
const UserInputParser = require("./service/UserInputParser")
const QuestManager = require("./service/QuestManager")
const conversation = new Conversation();
const questManager = new QuestManager();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

const port = process.env.PORT || 5000;

server.listen(port, function () {
    console.log("server started at port " + port);
});

app.use(express.static('public'));  // keeps the frontend part

/*user's choices and stats*/
let choices = []; // stores the user's choices
let hideNum = 0;
let fightNum = 0;
let negotiateNum = 0;
let escapeNum = 0;
let deathNum = 0;

/*flags*/
let startQuest = 0; // monitors the start of a quest
let badResponse = 0; // monitors the number of unknown responses

io.on("connection", (socket) => {
    console.log(`connect ${socket.id}`);

    socket.on("disconnect", (reason) => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
    });

    socket.on("question", (data) => {
        console.log("Question received: " + data)
        const userResponse = data.toLowerCase();


        let responseStrategy = new ResponseStrategy();
        let userInputParser = new UserInputParser();
        let responseKeywords = userInputParser.parseUserInput(userResponse);
        let botResponse;
        let randomQuestPath;

        if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "FINISH") {
            conversation.requestCount = 0;

            socket.emit("answer", "Bye-bye!"+" Enemies down: "+fightNum+". Deaths: "+deathNum+". Escapes: "+escapeNum+". Negotiations: "+negotiateNum+". Hidings: "+hideNum+". Type in something to start a new round.");

            /*reset the stats*/
            hideNum = 0;
            fightNum = 0;
            negotiateNum = 0;
            escapeNum = 0;
            deathNum = 0;

            startQuest = 1;
            badResponse = 0;
        } else if (conversation.requestCount === 0  || (conversation.requestCount === 1 && startQuest===1)) {
            startQuest = 0;
            badResponse = 0;
            conversation.requestCount = 0;
            let randomQuestPath = questManager.getRandomQuest();
            questManager.setCurrentQuest(randomQuestPath);
            botResponse = questManager.getQuestIntro(randomQuestPath);
            socket.emit("answer", botResponse);

        } else if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "UNKNOWN" && conversation.requestCount>0 ) {
            startQuest = 0;

            if(badResponse>=2) {
                socket.emit("answer", "You are dead! Read the manual again and type in something to continue.");
                deathNum += 1;
                conversation.requestCount = 0;
                startQuest = 1;
                badResponse = 0;
            } else {
                socket.emit("answer", "Please, rephrase your intention.");
            }

            badResponse += 1;
        } else if (conversation.requestCount >= 1) {
            let response = responseStrategy.getResponseType(responseKeywords);
            let action = response.getAnswer(responseKeywords);
            botResponse = questManager.getQuestAction(questManager.getCurrentQuest(), action);
            socket.emit("answer", botResponse);
        }

        choices.push(responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords)); // add user's choice
        conversation.requestCount++;

        /*code below is just for convenience*/
        console.log(responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords)); // supplementary info about the user's decision
        console.log(choices); // shows the previous choices
        console.log("requestCount: "+conversation.requestCount); // shows the supplementary info about the counter
        console.log("flag: "+startQuest); // shows flag variable

        /*fight choice processing*/
        if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "FIGHT" && conversation.requestCount>1) {
            conversation.requestCount = 0;
            fightNum += 1;
        }

        /*hide choice processing*/
        if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "HIDE" && conversation.requestCount>1) {
            conversation.requestCount = 0;
            hideNum += 1;
        }

        /*negotiate choice processing*/
        if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "NEGOTIATE" && conversation.requestCount>1) {
            conversation.requestCount = 0;
            negotiateNum += 1;
        }

        /*escape choice processing*/
        if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "ESCAPE" && conversation.requestCount>1) {
            conversation.requestCount = 0;
            escapeNum += 1;
        }

        /*nothing choice processing*/
        if (responseStrategy.getResponseType(responseKeywords).getAnswer(responseKeywords) === "NOTHING" && conversation.requestCount>1) {
            conversation.requestCount = 0;
            deathNum += 1;
        }
    });
});
