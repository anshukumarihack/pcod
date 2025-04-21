import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicOff, Volume2, Copy } from 'lucide-react';
import useClipboard from 'react-use-clipboard';
import toast from 'react-hot-toast';

interface VoiceAssistantProps {
  onTranscriptComplete?: (transcript: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onTranscriptComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [copyText, setCopyText] = useState('');
  const [isCopied, setCopied] = useClipboard(copyText, {
    successDuration: 1000,
  });

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  useEffect(() => {
    setCopyText(transcript);
  }, [transcript]);

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    if (onTranscriptComplete) {
      onTranscriptComplete(transcript);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        Browser doesn't support speech recognition.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Volume2 className="w-6 h-6 text-purple-600 mr-2" />
          Voice Assistant
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`p-2 rounded-full ${
              isListening 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button
            onClick={() => {
              setCopied();
              toast.success('Text copied to clipboard!');
            }}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Copy className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="min-h-[100px] p-4 bg-gray-50 rounded-lg">
          {transcript || 'Start speaking...'}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={resetTranscript}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear
          </button>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-600">
              {isListening ? 'Listening...' : 'Not listening'}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Try saying: "Tell me about PCOD symptoms" or "What are the treatments for PCOD?"
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;