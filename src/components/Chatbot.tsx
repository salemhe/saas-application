import { useState } from "react";
import {GoogleGenerativeAI} from "@google/generative-ai";
import FormattedAdCopy from "./FormattedAdCopy";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button";
import {FaArrowUp} from "react-icons/fa"


// Define types for your component
type Industry = "General" | "Tech" | "Health" | "Education";
type Tone = "Professional" | "Casual" | "Persuasive";
type ContentType = "Ad Copy" | "Funnel Copy";

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
};

const AiGenerator = () => {
  const [industry, setIndustry] = useState<Industry>("General");
  const [tone, setTone] = useState<Tone>("Professional");
  const [contentType, setContentType] = useState<ContentType>("Ad Copy");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulated content generation function
  const generateResponseFromGemini = async (customPrompt: string): Promise<string> => {
    const baseContext = `Generate a ${contentType} for the ${industry} industry in a ${tone} tone.`;
    const fullPrompt = customPrompt 
      ? `${baseContext} Additional context: ${customPrompt}` 
      : baseContext;
  
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      console.log(response.text());
      return response.text();
    
    } catch (error) {
      console.error("Error fetching response from Gemini:", error);
      return "An error occurred while generating content. Please try again.";
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
  
    const newMessages: Message[] = [...messages, { 
      id: Date.now(), 
      text: inputMessage, 
      sender: 'user' 
    }];
    setMessages(newMessages);
    setInputMessage("");
  
    setIsLoading(true);
    try {
      const aiResponse = await generateResponseFromGemini(inputMessage);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: aiResponse, 
        sender: 'ai' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col w-[90%] max-w-4xl mx-auto h-[90vh] bg-white border border-gray-200 rounded-lg shadow-lg md:w-full">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">AI Content Generator</h1>
        <p className="text-sm text-gray-600">Generate tailored content through an interactive chat experience.</p>
      </div>

      {/* Configuration Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <Select value={industry} onValueChange={(value: Industry) => setIndustry(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="General">General</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tone} onValueChange={(value: Tone) => setTone(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ad Copy">Ad Copy</SelectItem>
              <SelectItem value="Funnel Copy">Funnel Copy</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-[131px] h-[48px] rounded-[100px] py-[12px] pr-[10px] pl-[20px] bg-[#EFF1F6] hover:bg-[#EFF1F6] flex gap-[12px]">
                <span className="font-semibold text-base -tracking-[0.4px] text-[#131316]">History</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="rounded-[20px] mt- mr- mb-1 w-[600px] h-[876px] max-w-[100vw] overflow-hidden" style={{ width: '456px', maxWidth: '100vw' }}>
              <SheetHeader>
                <SheetTitle className="w-[107px] h-[48px] rounded-[100px]">History</SheetTitle>  
              </SheetHeader>
              <div className="flex text-center justify-center items-center gap-4">
                No history
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    
{/* create an ad for my new startup that priortizes baby food over breast milk for infants */}
      {/* Chat Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
       
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div 
                className={`
                  max-w-[80%] p-4 rounded-lg shadow-md
                  ${message.sender === 'user' 
                    ? 'bg-[#d7e0ff] text-[#5a5acb]' 
                    : 'bg-gray-100 text-gray-800'}
                `}
              >
                {message.sender === 'ai' && message.text.includes('Ad Copy Options') ? (
                  <FormattedAdCopy content={message.text} />
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400">
            Start by typing a query below and selecting your preferences!
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md animate-pulse">
              Generating content...
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type additional context or details..."
          className="flex-grow p-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading}
          className="px-4 py-4 animate-puls  bg-gray-100 text-[#5a5acb] text-sm rounded-full hover:bg-[#d7e0ff]  focus:outline-none"
        >
          <FaArrowUp className="w-6 h-6 " />
        </button>
      </div>
    </div>
  );
};

export default AiGenerator;