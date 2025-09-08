import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import {init, close} from "./realtime"
import {instructions} from "./instructions"
import "./App.css";

const buttonLabelDict = {
  inactive: "Start",
  initializing: "Initializing...",
  listening: "Stop"
}



function App() {
  const [thursdayState, setThursdayState] = useState("inactive");
  const [realtime, setRealtime] = useState(null)
  const [convoLength, setConvoLength] = useState(1)
  const [conversations, setConversations] = useState(["system: begin"])
  const [buffer, setBuffer] = useState("")
  const appendConvo = (convo) => {
    setConversations(prevConvos => [convo, ...prevConvos])
  }

  const oaiEventListenerMap = {
    message: (e, dc) => {
      const msg = JSON.parse(event.data)
      console.log(msg)
      if (msg.type === "response.audio_transcript.done") {
        appendConvo("assistant: " + msg.transcript)
        setBuffer("")
      } else if (msg.type === "response.audio_transcript.delta") {
        setBuffer(prevBuffer => prevBuffer + msg.delta)
      } else if (msg.type === "conversation.item.input_audio_transcription.completed") {
        appendConvo("user: " + msg.transcript)
      } else if (msg.type === "session.created") {
        dc.send(JSON.stringify({
          type: "session.update",
          session: {
            input_audio_transcription: {model: "gpt-4o-mini-transcribe"},
            instructions
          }
        }))
      } else if (msg.type === "session.updated") {
        setThursdayState("listening")
      }
    }
  }

  

  return (
    <main className="container">
      <h1>Welcome to Thursday</h1>
      <button onClick={async() => {
        if (thursdayState === "inactive") {
          setThursdayState("initializing")
          console.log("initializing...")
          try {
            const realtime = init(oaiEventListenerMap)
            if (realtime === "PermissionDenied") {
              setThursdayState("Mic Permission Denied")
            }
            setRealtime(realtime)
          } catch(error) {
            console.error("Unable to init realtime", error)
          }
        } else if (thursdayState === "listening") {
          close(realtime)
          setThursdayState("inactive")
        }
      }}>
        {buttonLabelDict[thursdayState]}
      </button>
      <div>
        <p>{buffer}</p>
      </div>
      <div>
        {conversations.map((dialogue, index) => <p key={index}>{dialogue}</p>)}
      </div>
    </main>
  );
}

export default App;
