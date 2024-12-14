import { useState, useRef, useEffect} from "react";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { FaArrowUp, FaRegStopCircle } from "react-icons/fa";
import { Textarea } from "./ui/textarea";
import { Upload, Copy, Clock } from "lucide-react";
import { auth, db } from "../../firebase";
import { serverTimestamp, addDoc, collection, orderBy, query, where, getDocs } from 'firebase/firestore';
import { TwitterMock } from "./social-mocks/TwitterMock";
import { InstagramMock } from "./social-mocks/InstagramMock";
type Industry = "General" | "Tech" | "Health" | "Education";
type Tone = "Professional" | "Casual" | "Persuasive";
type ContentType = "Ad Copy" | "Twitter Post" | "Instagram Caption" | "Facebook Post" | "LinkedIn Post";

// type Message = {
//   id: number;
//   text: string;
//   sender: "user" | "ai";
//   image?: string; // Optional image property
// };

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const MAX_TWEET_LENGTH = 280;

const contentTypes = [
  { label: "Ad Copy", value: "Ad Copy" },
  { value: "twitter", label: "Twitter Thread" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "facebook", label: "Facebook Post" },
  { value: "linkedin", label: "LinkedIn Post" },
];

interface HistoryItem {
  id: string;
  contentType: any;
  prompt: any;
  content: any;
  user: any;
  tone?: any;
  industry?: any;
  createdAt: any;
}


const AiGenerator = () => {
  const [industry, setIndustry] = useState<Industry>("General");
  const [tone, setTone] = useState<Tone>("Professional");
  const [contentType, setContentType] =  useState(contentTypes[0].value);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!apiKey) {
      console.error("Gemini API key is not set");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Reference to the generatedContent collection
        const contentCollectionRef = collection(db, "generatedContent");

        // Query documents where `user` field matches the current user's UID
        const userContentQuery = query(
          contentCollectionRef,
          where("user", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        // Fetch documents
        const querySnapshot = await getDocs(userContentQuery);
        const historyItems = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            contentType: data.contentType || "Unknown",
            prompt: data.prompt || "N/A",
            content: data.content || "",
            user: data.user,
            tone: data.tone || "N/A", // Add tone field
            industry: data.industry || "N/A", // Add industry field
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          };
        });
          console.log(historyItems)
        setHistory(historyItems);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const handleSendMessage = async () => {
    const user = auth.currentUser;

    if (!genAI) {
      console.error("Missing Gemini API Key");
      alert("API Key is missing. Please configure your environment.");
      setIsLoading(false);
      return;
    }
    
    if (!user) {
      alert("You must be logged in to generate content");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try{
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      console.log({
        user: user.uid,
        contentType,
        industry,
        tone,
        inputMessage,
        hasImage: !!selectedImage
      });
      let promptText = `Generate ${contentType} content for the ${industry} industry in a ${tone} tone. about "${inputMessage}".`;
      if (contentType === "twitter") {
        promptText +=
          " Provide a thread of 5 tweets, each under 280 characters.";
      }

      let imagePart: Part | null = null;
      if (selectedImage) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              resolve(e.target.result);
            } else {
              resolve("");
            }
          };
          reader.readAsDataURL(selectedImage);
        });

        const base64Data = imageData.split(",")[1];
        if (base64Data) {
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: selectedImage.type,
            },
          };
        }
        promptText +=
          " Describe the image and incorporate it into the caption.";
      }

      const parts: (string | Part)[] = [promptText];
      if (imagePart) parts.push(imagePart);

      const result = await model.generateContent(parts);
      const generatedText = result.response.text();

      let content: string[];
      if (contentType === "twitter") {
        content = generatedText
          .split("\n\n")
          .filter((tweet) => tweet.trim() !== "");
      } else {
        content = [generatedText];
      }

      setMessages(content);

      // Save generated content
      // Save generated content to Firestore
      const newContentRef = await addDoc(collection(db, "generatedContent"), {
        user: user.uid,
        content: content.join("\n\n"),
        prompt: inputMessage,
        contentType: contentType,
        tone: tone,
        industry: industry,
        createdAt: serverTimestamp()
      });

      // Update local history state
      setHistory(prevHistory => [
        {
          id: newContentRef.id,
          user: user.uid,
          content: content.join("\n\n"),
          prompt: inputMessage,
          contentType: contentType,
          tone: tone,
          industry: industry,
          createdAt: new Date()
        },
        ...prevHistory
      ]);

      setInputMessage("");

    } catch (error) {
      console.error("Generation Error Details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        inputs: {
          contentType,
          industry,
          tone,
          inputMessageLength: inputMessage.length
        }
      })
      alert(`Error generating content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setMessages(["An error occurred while generating content."]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleHistoryItemClick = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setContentType(item.contentType);
    setInputMessage(item.prompt);
    setMessages(
      item.contentType === "twitter"
        ? item.content.split("\n\n")
        : [item.content]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderContentMock = () => {
    if (messages.length === 0) return null;

    switch (contentType) {
      case "twitter":
        return <TwitterMock content={messages} />;
      case "instagram":
        return <InstagramMock content={messages[0]} />;
      default:
        return null;
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      setIsLoading(false);
    }
  };
  

  return (
    <div className="lg:col-span-2 space-y-6 mx-auto h-[90vh] bg-white/8 rounded-lg shadow-md w-full">
      
  {/* Configuration Filters */}
  {/* Chat Messages Area */}

  <div className="bg-gray-800 p-6 rounded-2xl space-y-6">
    <div className="bg-gray-800 w-full p-6 space-y-4 gap-4 lg:space-y-0 rounded-2xl inline-flex flex-col-reverse lg:flex-row lg:flex lg:items-center lg:justify-between">
        <div className="lg:flex gap-4 space-y-4 w-full lg:space-y-0 items-center">
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
              {contentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* History Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="px-4 py-4 flex bg-[#eff1f6] text-[#5a5acb] text-sm rounded-full hover:bg-[#d7e0ff] focus:outline-none">
              <span className="font-semibold text-base text-[#131316]">History</span> <Clock className="w-[24px] h-[24px] text-[#5a5acb]"/>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[456px] max-w-[100vw] overflow-hidden">
            <SheetHeader>
              <SheetTitle className="w-[107px] h-[48px] rounded-[100px]">History</SheetTitle>
            </SheetHeader>
            <div className="flex text-center justify-center items-center gap-4">
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 w-full bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => handleHistoryItemClick(item)}
                  >
                    {/* <div className="flex items-center mb-2">
                      {item.contentType === "twitter" && (
                        <Twitter className="mr-2 h-5 w-5 text-blue-400" />
                      )}
                      {item.contentType === "instagram" && (
                        <Instagram className="mr-2 h-5 w-5 text-pink-400" />
                      )}
                      {item.contentType === "linkedin" && (
                        <Linkedin className="mr-2 h-5 w-5 text-blue-600" />
                      )}
                      <span className="text-sm font-medium">
                        {item.contentType}
                      </span>
                    </div> */}
                    <p className="text-sm text-gray-300 truncate">
                      {item.prompt}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet> 
      </div>
    
    <div>
      <label
        htmlFor="prompt"
        className="block text-left text-sm font-medium mb-2 text-gray-300"
      >
        Prompt
      </label>
      <Textarea
        id="prompt"
        placeholder="Enter your prompt here..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        rows={4}
        className="w-full bg-gray-700 border-none rounded-xl resize-none"
      />
    </div>
    <div>
      <label className="block text-left text-sm font-medium mb-2 text-gray-300">
        Upload Image
      </label>
      <div className="flex items-center space-x-3">
       <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center px-4 py-2 bg-gray-700 rounded-xl text-sm font-medium hover:bg-gray-600 transition-colors"
        >
          <Upload className="mr-2 h-5 w-5" />
          <span>Upload Image</span>
        </label>
        {selectedImage && (
          <span className="text-sm text-gray-400">
            {selectedImage.name}
          </span>
        )}
      </div>
    </div>
    {!isLoading ? (
        <Button
          onClick={handleSendMessage}
          className="px-4 py-4 flex w-full bg-[#eff1f6] text-[#5a5acb] text-sm rounded-full hover:bg-[#d7e0ff] focus:outline-none"
        >
          <span>Generate Content</span> <FaArrowUp className="w-8 h-8 text-sm font-thin" />
        </Button>
      ) : (
        <Button
          onClick={handleCancel}
          className="px-4 py-4 flex w-full bg-transparent  text-red-500 text-sm hover:text-red-600 focus:outline-none"
        >
         <span> Stop Generating Content</span> <FaRegStopCircle className="w-8 h-8" />
        </Button>
      )}
    
  </div>

  {(selectedHistoryItem || messages.length > 0) && (
    <div className="bg-gray-800 p-6 rounded-2xl space-y-4">
      <h2 className="text-2xl font-semibold text-blue-400">
        {selectedHistoryItem ? "History Item" : "Generated Content"}
      </h2>
      {contentType === "twitter" ? (
        <div className="space-y-4">
          {(selectedHistoryItem
            ? selectedHistoryItem.content.split("\n\n")
            : messages
          ).map((tweet: any, index: any) => (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded-xl relative"
            >
              <ReactMarkdown className="prose prose-invert max-w-none mb-2 text-sm">
                {tweet}
              </ReactMarkdown>
              <div className="flex justify-between items-center text-gray-400 text-xs mt-2">
                <span>
                  {tweet.length}/{MAX_TWEET_LENGTH}
                </span>
                <Button
                  onClick={() => copyToClipboard(tweet)}
                  className="bg-gray-600 hover:bg-gray-500 text-white rounded-full p-2 transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-700 p-4 rounded-xl">
          <ReactMarkdown className="prose prose-invert max-w-none text-sm">
            {selectedHistoryItem
              ? selectedHistoryItem.content
              : messages[0]}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )}

{/* Content preview */}
{messages.length > 0 && (
  <div className="bg-gray-800 p-6 rounded-2xl">
    <h2 className="text-2xl font-semibold mb-4 text-blue-400">
      Preview
    </h2>
    {renderContentMock()}
  </div>
)}

  {/* <div className="flex-grow overflow-y-auto p-4 space-y-4">
    {messages.length > 0 ? (
      messages.map((message) => (
        <div
        key={message}
        className={`flex ${
          message.sender === "user" ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`max-w-[80%] p-4 rounded-lg shadow-md ${
            message.sender === "user"
              ? "bg-[#d7e0ff] text-[#5a5acb]"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.image && (
            <Image
            width={100}
            height={100}
              src={message.image}
              alt="User Uploaded"
              className="mb-2 w-full h-auto rounded"
            />
          )}
          <FormattedAdCopy content={message.text} />
        </div>
      </div>
      ))
    ) : (
      <div className="flex flex-col justify-center items-center h-full text-gray-400">
        <p className="text-sm">Generate tailored content through an interactive chat experience.</p>
        <p>What can I help with?</p>
      </div>
    )}

    {isLoading && (
      <div className="flex justify-start mb-4">
        <div className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md animate-pulse">
          Generating content...
        </div>
      </div>
    )}
  </div> */}

  
</div>
  );
};

export default AiGenerator;



// const generateResponseFromGemini = async (
//   customPrompt: string,
//   image?: string
// ): Promise<string> => {
//   const baseContext = `Generate a ${contentType} for the ${industry} industry in a ${tone} tone.`;
//   const imageContext = image ? `Image attached: ${image}` : "";
//   const fullPrompt = customPrompt
//     ? `${baseContext} ${imageContext} Additional context: ${customPrompt}`
//     : baseContext;

//   abortController.current = new AbortController();

//   try {
//     const genAI = new GoogleGenerativeAI(
//       process.env.NEXT_PUBLIC_API_KEY || ""
//     );
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(fullPrompt, {
//       signal: abortController.current.signal,
//     });
//     const response = result.response;
//     return response.text();
//   } catch (error: any) {
//     if (error.name === "AbortError") {
//       console.error("Request aborted");
//       return "Content generation was canceled.";
//     }
//     console.error("Error fetching response from Gemini:", error);
//     return "An error occurred while generating content. Please try again.";
//   } finally {
//     abortController.current = null;
//   }
// };

// const convertToBase64 = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
// };

// const handleSendMessage = async () => {
  


//   if (!inputMessage.trim() && !selectedImage) return;

//   let base64Image = "";
//   if (selectedImage) {
//     base64Image = await convertToBase64(selectedImage);
//   }

//   // Add user message
//   setMessages((prev) => [
//     ...prev,
//     {
//       id: Date.now(),
//       text: inputMessage,
//       sender: "user",
//       image: base64Image || undefined,
//     },
//   ]);

//   setInputMessage("");
//   setSelectedImage(null);

//   setIsLoading(true);
//   try {
//     const aiResponse = await generateResponseFromGemini(inputMessage, base64Image);
//     // Add AI response
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: Date.now() + 1,
//         text: aiResponse,
//         sender: "ai",
//       },
//     ]);
//   } finally {
//     setIsLoading(false);
//   }
// };