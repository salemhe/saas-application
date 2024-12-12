// import { useState } from "react";

// const AiGenerator = () => {
//   const [messages, setMessages] = useState([]);
//   const [industry, setIndustry] = useState("General");
//   const [tone, setTone] = useState("Professional");
//   const [contentType, setContentType] = useState("Ad Copy");

//   const handleNewMessage = (message) => {
//     setMessages((prev) => [...prev, message]);
//     // Add API call here to handle AI response generation.
//   };

//   return (
//     <div className="flex flex-col w-[90%] max-w-4xl mx-auto h-[90vh] bg-white border border-gray-200 rounded-lg shadow-lg md:w-full">
//       {/* Header */}
//       <div className="p-4 bg-gray-100 border-b border-gray-200">
//         <h1 className="text-2xl font-semibold text-gray-800">AI Ad Content Generator</h1>
//         <p className="text-sm text-gray-600">Generate compelling ad content tailored for any industry and tone.</p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border-b border-gray-200">
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full">
//           <select
//             className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//             value={industry}
//             onChange={(e) => setIndustry(e.target.value)}
//           >
//             <option value="General">General</option>
//             <option value="Tech">Tech</option>
//             <option value="Health">Health</option>
//             <option value="Education">Education</option>
//           </select>

//           <select
//             className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//             value={tone}
//             onChange={(e) => setTone(e.target.value)}
//           >
//             <option value="Professional">Professional</option>
//             <option value="Casual">Casual</option>
//             <option value="Persuasive">Persuasive</option>
//             <option value="Humorous">Humorous</option>
//           </select>

//           <select
//             className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//             value={contentType}
//             onChange={(e) => setContentType(e.target.value)}
//           >
//             <option value="Ad Copy">Ad Copy</option>
//             <option value="Funnel Copy">Funnel Copy</option>
//             <option value="Blog Post">Blog Post</option>
//           </select>
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-grow p-4 overflow-y-auto">
//         {messages.length > 0 ? (
//           messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`p-3 my-2 rounded-lg max-w-[80%] ${
//                 msg.role === "user"
//                   ? "bg-blue-100 text-left self-start"
//                   : "bg-gray-100 text-right self-end"
//               }`}
//             >
//               <p>{msg.content}</p>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-400">Start by typing a query below!</p>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="flex items-center p-4 bg-gray-50 border-t border-gray-200">
//         <textarea
//           rows="2"
//           placeholder="Type your query here..."
//           className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
//               e.preventDefault();
//               handleNewMessage({ role: "user", content: e.target.value });
//               e.target.value = "";
//             }
//           }}
//         />
//         <button
//           className="ml-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
//           onClick={() => {
//             const textarea = document.querySelector("textarea");
//             if (textarea.value.trim()) {
//               handleNewMessage({ role: "user", content: textarea.value });
//               textarea.value = "";
//             }
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AiGenerator;


import { useState } from "react";

const AiGenerator = () => {
  const [industry, setIndustry] = useState("General");
  const [tone, setTone] = useState("Professional");
  const [contentType, setContentType] = useState("Ad Copy");

  return (
    <div className="flex flex-col w-[90%] max-w-4xl mx-auto h-[90vh] bg-white border border-gray-200 rounded-lg shadow-lg md:w-full">
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">AI Ad Content Generator</h1>
        <p className="text-sm text-gray-600">Generate compelling ad content tailored for any industry and tone.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          <select
            className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
          </select>

          <select
            className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="Professional">Professional</option>
            <option value="Casual">Casual</option>
            <option value="Persuasive">Persuasive</option>
            <option value="Humorous">Humorous</option>
          </select>

          <select
            className="w-full md:w-auto p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="Ad Copy">Ad Copy</option>
            <option value="Funnel Copy">Funnel Copy</option>
            <option value="Blog Post">Blog Post</option>
          </select>
        </div>
      </div>

      {/* Placeholder Area for Chat or Other Features */}
      <div className="flex-grow p-4 flex flex-col justify-center items-center text-center">
        <p className="text-gray-400">Select options above to get started!</p>
        <div className="mt-4 text-gray-600">
          <p className="text-lg font-medium">This section will display the generated content or relevant outputs.</p>
          <p className="mt-2 text-sm">Customize the filters to tailor your content.</p>
        </div>
      </div>
    </div>
  );
};

export default AiGenerator;
