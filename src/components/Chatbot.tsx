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
import {  Copy, Clock, SendHorizontal, CircleStop, ImageIcon } from "lucide-react";
import { auth, db } from "../../firebase";
import { serverTimestamp, addDoc, collection, orderBy, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Image from "next/image";
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
  generatedImageBase64?: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
            generatedImageBase64: data.generatedImageBase64 || null,
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
  
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Generate a preview URL
      setImagePreview(previewUrl); // Save the preview URL for rendering
    } else {
      setImagePreview(null); // Clear the preview if no file is selected
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
  };

  const handleGenerateImage = async (prompt: string) => {
    try {
      setIsLoading(true);
      console.log("Generating image with prompt:", prompt);
  
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
  
      console.log("Response status:", response.status);
  
      // Parse the response JSON
      const data = await response.json();
  
      // Check for errors in the response
      if (!response.ok) {
        console.error("Image generation error:", data);
        throw new Error(data.error || "Image generation failed");
      }
  
      // Validate the image URL
      if (!data.imageUrl) {
        throw new Error("No image URL returned");
      }
  
      // Add the image to messages
      setMessages((prev) => [...prev, data.imageUrl]);
      
      return data.imageUrl;
    } catch (error) {
      console.error("Detailed error generating image:", error);
      
      // More informative error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to generate image";
      
      // Optional: show a user-friendly error
      alert(errorMessage);
      
      return null;
    } finally {
      setIsLoading(false);
    }
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
  
    // Initialize the AbortController
    const controller = new AbortController();
    abortController.current = controller;
  
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      console.log(Object.keys(genAI.getGenerativeModel({ model: "gemini-1.5-flash" })));

      console.log({
        user: user.uid,
        contentType,
        industry,
        tone,
        inputMessage,
        hasImage: !!selectedImage,
      });
  
      let promptText = `Generate ${contentType} content in the ${industry} industry, using a ${tone} tone, based on: "${inputMessage}".`;
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
  
      // Pass the abort signal to the API call
      const result = await model.generateContent(parts, {
        signal: controller.signal,
      });
      const generatedText = result.response.text();

       // Optionally generate an image
      let generatedImageBase64 = null;
      if (selectedImage || contentType === "Ad Copy") {
        const imagePrompt = `Create an image for the following content: "${generatedText}"`;
        generatedImageBase64 = await handleGenerateImage(imagePrompt);
      }
  
      let content: string[];
      if (contentType === "twitter") {
        content = generatedText
          .split("\n\n")
          .filter((tweet) => tweet.trim() !== "");
      } else {
        content = [generatedText];
      }
  
      setMessages(content);
  
      // Save generated content to Firestore
      const newContentRef = await addDoc(collection(db, "generatedContent"), {
        user: user.uid,
        content: content.join("\n\n"),
        prompt: inputMessage,
        contentType: contentType,
        tone: tone,
        industry: industry,
        ...(generatedImageBase64 && { generatedImageBase64 }), 
        createdAt: serverTimestamp(),
      });
  
      setHistory((prevHistory) => [
        {
          id: newContentRef.id,
          user: user.uid,
          content: content.join("\n\n"),
          prompt: inputMessage,
          contentType: contentType,
          tone: tone,
          industry: industry,
          ...(generatedImageBase64 && { generatedImageBase64 }), 
          createdAt: new Date(),
        },
        ...prevHistory,
      ]);
  
      setInputMessage("");
    } catch (error) {
      if (controller.signal.aborted) {
        console.log("Generation aborted.");
      } else {
        console.error("Generation Error Details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : "No stack trace",
          inputs: {
            contentType,
            industry,
            tone,
            inputMessageLength: inputMessage.length,
          },
        });
        alert(
          `Error generating content: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        setMessages(["An error occurred while generating content."]);
      }
    } finally {
      setIsLoading(false);
      abortController.current = null;
    }
  };

  const renderImages = () => {
    const imageUrls = messages.filter((msg) =>
      typeof msg === "string" && (msg.startsWith("http") || msg.startsWith("data:image"))
    );
  
    // Include the base64 image from history
    const historyImage = selectedHistoryItem?.generatedImageBase64;
  
    const allImages = [...imageUrls, ...(historyImage ? [historyImage] : [])];
  
    if (allImages.length === 0) return null;
  
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {allImages.map((imageUrl, index) => (
    <div
      key={index}
      className="relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
    >
      {/* Image */}
      <Image
        width={100}
        height={100}
        src={imageUrl}
        alt={`Generated Image ${index + 1}`}
        className="w-full h-auto max-h-[400px] object-cover rounded-lg"
      />
      
      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white text-sm opacity-0 transition-opacity duration-300 hover:opacity-100 flex justify-between items-center">
        <span>Generated Image {index + 1}</span>
        {/* Download Button */}
        <a
          href={imageUrl}
          download={`Generated_Image_${index + 1}`}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-lg"
        >
          Download
        </a>
      </div>
    </div>
  ))}
</div>

    

    );
  };
  

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

  // const renderContentMock = () => {
  //   if (messages.length === 0) return null;

  //   switch (contentType) {
  //     case "twitter":
  //       return <TwitterMock content={messages} />;
  //     case "instagram":
  //       return <InstagramMock content={messages[0]} />;
  //     default:
  //       return null;
  //   }
  // };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      setIsLoading(false);
    }
  };
  
  const handleDeleteHistoryItem = async (itemId: string) => {
    try {
      // Reference to the specific document
      const itemRef = doc(db, "generatedContent", itemId);

      // Delete the document
      await deleteDoc(itemRef);

      // Update local state
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item.id !== itemId)
      );

      alert("History item deleted successfully!");
    } catch (error) {
      console.error("Error deleting history item:", error);
      alert("Failed to delete history item.");
    }
  };
  return (
    <div className="lg:col-span-2 space-y-6 mx-auto h-[90vh] bg-gray-10 rounded-l  w-full mt-32 md:mt-0 md:p-6 ">
      {/* Configuration Filters */}
      <div className="bg-gradient-to- from-[#f8fafc] to-[#e3ebf6 mb-8 p-4 md:p-8 rounded-3xl w-full md:w-full shadow-l space-y-8">
      {/* Filters Section */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
        <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full items-center">
          <Select value={industry} onValueChange={(value: Industry) => setIndustry(value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-[#5a5acb]">
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
            <SelectTrigger className="w-full md:w-[200px] bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-[#5a5acb]">
              <SelectValue placeholder="Tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)}>
            <SelectTrigger className="w-full md:w-[200px] bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-[#5a5acb]">
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
            <Button className="px-4 py-2 bg-gradient-to-r from-[#eff1f6] to-[#d7e0ff] text-[#5a5acb] font-medium text-sm rounded-lg hover:from-[#d7e0ff] hover:to-[#eff1f6] shadow-md transition">
              <span className="flex items-center">
                History
                <Clock className="w-5 h-5 text-[#5a5acb] ml-2" />
              </span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[456px] max-w-full overflow-y-auto scroll-me-5">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold text-gray-800">History</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4 overflow-y-aut overflow-y-scroll">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer flex justify-between items-center"
                >
                  <div onClick={() => handleHistoryItemClick(item)} className="flex-1">
                    <p className="text-sm text-gray-600 truncate w-44">{item.prompt}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Clock className="mr-1 h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => handleDeleteHistoryItem(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

       {/* Content Display */}
       {(selectedHistoryItem || messages.length > 0) && (
          <div className=" max-h-[278px] overflow-y-auto  p-6 rounded-2xl space-y-4">
            <h2 className="text-2xl font-semibold text-[#5a5acb]">
              {/* {selectedHistoryItem ? "History Item" : "Generated Content"} */}
              Generated Content
            </h2>
            {contentType === "twitter" ? (
              <div className="space-y-4">
                {(selectedHistoryItem
                  ? selectedHistoryItem.content.split("\n\n")
                  : messages
                ).map((tweet: any, index: any) => (
                  <div
                    key={index}
                    className="bg-[#ebf0ff] p-4 rounded-xl relative"
                  >
                    <ReactMarkdown className="prose prose-invert text-gray-500 text-left max-w-none mb-2 text-sm">
                      {tweet}
                    </ReactMarkdown>
                    <div className="flex justify-between items-center text-gray-600 text-xs mt-2">
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
              <div className="bg- p-4 rounded-xl">
                {renderImages()}
                <ReactMarkdown className="prose prose-inver mt-16 text-gray-600 text-left max-w-none text-sm">
                  {selectedHistoryItem
                    ? selectedHistoryItem.content
                    : messages[0]}
                </ReactMarkdown>
                
              </div>
            )}
            </div>
        )}

        {/* Prompt Area */}
        <div className="flex ">
          <div className="flex items-center bg-white rounded-2xl shadow-md absolu border p-2 w-full max-w-3xl mx-auto">
            {/* Upload Image and Preview */}
            <div>
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
                  className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 transition"
                >
                  <ImageIcon className="w-6 h-6"/>
                </label>
                {/* {selectedImage && <span className="text-sm text-gray-600">{selectedImage.name}</span>} */}
              </div>

              {imagePreview && (
                <div className="mt-4 flex items-start">
                  <div className="relative inline-block">
                    <Image
                      width={100}
                      height={100}
                      src={imagePreview}
                      alt="Selected preview"
                      className="w-full h-auto max-h-[100px] object-contain rounded-md"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                      aria-label="Remove Image"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
            
              <textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                rows={1}
                className="w-full flex-grow bg-transparent border-none rounded-none focus:outline-none focus:ring-0 outline-none resize-none"
              />
            {/* Action Buttons */}
            {!isLoading ? (
              <button
                onClick={handleSendMessage}
                className=" p-2 text-gray-500 hover:text-blue-600 transition"
              >
                <SendHorizontal className="w-6 h-6"/>
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="p-2 text-red-500   transition"
              >
                <CircleStop className="w-6 h-6"/>
              </button>
            )}
          </div>
        
        </div>
      </div>


     
    </div>
  );
};

export default AiGenerator;



