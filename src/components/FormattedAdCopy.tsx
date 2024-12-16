const FormattedAdCopy = ({ content }) => {
   return (
     <div className="space-y-4">
       {content.split('\n\n').map((section: any, index: any) => (
         <div key={index} className="bg-whit  rounded- shadow-">
           {section.split('\n').map((line: any, lineIndex: any) => (
             <p key={lineIndex} className={`text-left
               ${line.startsWith('**') && line.endsWith('**') 
                 ? 'font-bold text-lg text-gray-800' 
                 : 'text-gray-600'}
             `}>
               {line.replace(/\*\*/g, '')}
             </p>
           ))}
         </div>
       ))}
     </div>
   );
 };

 export default FormattedAdCopy;

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
