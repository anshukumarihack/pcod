import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Search, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import VoiceAssistant from '../components/VoiceAssistant';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  { question: "What is PCOD/PCOS?", answer: "PCOD (Polycystic Ovarian Disease) is a hormonal disorder causing enlarged ovaries with small cysts. It affects women's fertility, menstrual cycle, hormones, and physical appearance.", category: "Basic Information" },
  { question: "What are the common symptoms of PCOD?", answer: "Common symptoms include irregular periods, weight gain, acne, excessive hair growth, hair loss, and difficulty conceiving.", category: "Symptoms" },
  { question: "How is PCOD diagnosed?", answer: "PCOD is diagnosed through physical examination, medical history, blood tests to check hormone levels, and ultrasound to examine the ovaries.", category: "Diagnosis" },
  { question: "What lifestyle changes can help manage PCOD?", answer: "Regular exercise, maintaining a healthy diet, stress management, adequate sleep, and weight management can help control PCOD symptoms.", category: "Treatment" },
  { question: "Can PCOD affect fertility?", answer: "Yes, PCOD can affect fertility by interfering with regular ovulation. However, with proper treatment and management, many women with PCOD can conceive.", category: "Fertility" },
  { question: "What foods should I avoid with PCOD?", answer: "Avoid processed foods, refined sugars, white flour products, and excessive caffeine. These can worsen insulin resistance and hormonal imbalances.", category: "Diet" },
  { question: "Is PCOD curable?", answer: "While PCOD cannot be cured completely, its symptoms can be effectively managed through lifestyle changes, medication, and proper medical supervision.", category: "Treatment" },
  { question: "How does stress affect PCOD?", answer: "Stress can worsen PCOD symptoms by affecting hormone levels and insulin resistance. Stress management techniques like yoga and meditation can help.", category: "Lifestyle" }
];

const OPENROUTER_API_KEY = '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';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your PCOD Care assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: "You are a helpful assistant providing information about PCOD and women's health." },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return aiResponse;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response from OpenRouter.');
      return "I'm having trouble fetching the answer right now. Please try again.";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    setLoading(true);

    const aiResponse = await fetchAIResponse(userMessage);
    
    setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    setLoading(false);
  };

  const handleVoiceTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: transcript }]);
    setLoading(true);

    const aiResponse = await fetchAIResponse(transcript);
    
    setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
    setLoading(false);

    // Read out the response
    const utterance = new SpeechSynthesisUtterance(aiResponse);
    window.speechSynthesis.speak(utterance);
  };

  const toggleFAQ = (question: string) => {
    setExpandedFAQs((prev) =>
      prev.includes(question) ? prev.filter((q) => q !== question) : [...prev, question]
    );
  };

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* FAQ Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {filteredFAQs.map((faq) => (
                  <div key={faq.question} className="border rounded-lg p-4">
                    <button
                      onClick={() => toggleFAQ(faq.question)}
                      className="w-full text-left flex justify-between items-center"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {expandedFAQs.includes(faq.question) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQs.includes(faq.question) && (
                      <div className="mt-2 text-gray-600">
                        <div className="text-sm text-purple-600 mb-1">{faq.category}</div>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2 space-y-6">
            <VoiceAssistant onTranscriptComplete={handleVoiceTranscript} />
            
            <div className="bg-white rounded-lg shadow-md h-[700px] flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageCircle className="w-6 h-6 text-purple-600 mr-2" />
                  AI Health Assistant
                </h2>
              </div>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}