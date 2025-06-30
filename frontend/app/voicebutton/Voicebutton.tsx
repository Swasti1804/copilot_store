"use client"

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { useEffect } from "react"

export default function VoiceAssistant({ onCommand }: { onCommand: (cmd: string) => void }) {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition()

  useEffect(() => {
    if (!listening && transcript) {
      onCommand(transcript.toLowerCase())
      resetTranscript()
    }
  }, [listening])

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support speech recognition.</span>
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-2">
      <button
        onClick={() => {
          resetTranscript()
          SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })

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
