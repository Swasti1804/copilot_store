"use client"

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { useEffect } from "react"

export default function VoiceAssistant() {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition()

  useEffect(() => {
    if (!listening && transcript.trim()) {
      sendCommandToBackend(transcript.trim().toLowerCase())
      resetTranscript()
    }
  }, [listening]) // ✅ you can optionally add [listening, transcript]

  const sendCommandToBackend = async (cmd: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/voice/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: cmd })
      })

      const data = await res.json()
      console.log("Reply from backend:", data.reply)

      // ✅ Speak the reply
      const utterance = new SpeechSynthesisUtterance(data.reply)
      speechSynthesis.speak(utterance)
    } catch (err) {
      console.error("Error sending voice command:", err)
    }
  }

  if (!browserSupportsSpeechRecognition) {
    return <div className="fixed bottom-6 right-6 p-4 bg-red-100 rounded">Voice not supported</div>
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-2">
      <button
        onClick={() => {
          resetTranscript()
          SpeechRecognition.startListening({ continuous: false })
        }}
        className="p-4 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition"
      >
        🎤
      </button>
      {listening && (
        <span className="text-sm text-purple-800 animate-pulse">Listening...</span>
      )}
    </div>
  )
}
