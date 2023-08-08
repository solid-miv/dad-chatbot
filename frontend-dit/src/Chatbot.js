import React, {useEffect, useState} from "react";
import './Chatbot.css';

import {Header} from "./Header";
import {UserInput} from "./UserInput";
import {MessageArea} from "./MessageArea";
import {TitleBlock} from "./TitleBlock";

import {io} from "socket.io-client";
const socket = io();

function Chatbot() {

    const [messages, setMessages] = useState([{
        text: "Hello there, I am the Dungeons & Dragons bot." +
            "You will be given a few quests from various creatures and characters. Your task is to react to them." +
            "You can fight, hide, negotiate, escape and just be idle. But remember that doing nothing kills you. " +
            "You are able either to quit or continue each time you finish the quest." +
            "If you want to finish, then type in 'quit' or 'finish'."+
            "Writing something like 'go on', 'continue' or 'restart' generates a new quest."+
            "Are you ready for some challenges? Then write something to me to kick off.",
        position: "left"
    }]);

    useEffect(() => {
        //if last message is a non-empty question, ask the server
        let lastMessage = messages[messages.length - 1]
        if (lastMessage.text !== "" && lastMessage.position === "right") {
            socket.emit('question', lastMessage.text);
        }

        //handle server responses
        socket.on("answer", (data) => {
            setMessages([...messages, {text: data, position: "left"}])
        });

    }, [messages]);

    function onSubmitMessage(inputText) {
        setMessages([...messages, {text: inputText, position: "right"}])
    }

    return (
        <div className="chat">
            <TitleBlock />
            <Header />
            <MessageArea messages={messages} />
            <UserInput onSubmitMessage={onSubmitMessage} />
        </div>
    );
}

export default Chatbot;
