import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import List from "./List";
import Spinner from "./Spinner";

export default function Main() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loader, setLoader] = useState(false);

  const generateResponse = async () => {
    if (!question.trim()) return;
    try {
      setLoader(true);
      setMessages([...messages, { text: question, type: "user" }]);

      const res = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCe1ae__rgmXVdeEGM54DlK23cn7-Qyyr0`,
        method: "post",
        data: { contents: [{ parts: [{ text: question }] }] },
      });

      let data = res.data.candidates[0].content.parts[0].text;
      const htmlData = marked(data);
      setLoader(false);
      setMessages([
        ...messages,
        { text: question, type: "user" },
        { text: htmlData, type: "response" },
      ]);

      setQuestion("");
    } catch (error) {
      console.log("Error:", error);
      window.alert("Something went wrong");
    } finally {
      setLoader(false);
      setQuestion("");
    }
  };

  return (
    <>
      
      <div className="container">
        {loader && <Spinner />}
        <div className="chat-header">
          <h1>Areeb's GPT</h1>
        </div>
        <div className="chat-parts">
          <div className="question-part">
            <div className="chat-header">
              <h3>Enter Your Question Here</h3>
            </div>
            <textarea
              cols="85"
              rows="10"
              placeholder="Ask me anything ?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></textarea>
            <button onClick={generateResponse}>Generate Response</button>
          </div>
          <div className="answer-part">
            <div className="chat-header">
              <h3>Your Response</h3>
            </div>
            <ul>
              {messages.map((msg, index) => (
                <List key={index} response={msg.text} type={msg.type} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
