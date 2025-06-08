// import React, { useState } from 'react'
// import axios from 'axios'
// import SpinnerLoad from './SpinnerLoad';
//  const {
//    GoogleGenerativeAI,
//    HarmCategory,
//    HarmBlockThreshold,
//  } = require("@google/generative-ai") 
// import {GoogleGenerativeAI,HarmCategory,  HarmBlockThreshold} from "@google/generative-ai";

//  const API_KEY = import.meta.env.VITE_GEMINI_API_KE 
// //  const API_KEY="AIzaSyDVOcvSOnlIpKeu9bF7oBZpPByHSrt9vnM";

// const GenAI = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loader, setLoader] = useState(false);
//   const [displayQuiz, setDisplayQuiz] = useState(false);
//   const [hide, setHidden] = useState("");

 
    
   
    
//     // async function run() {
//     //   const chatSession = model.startChat({
//     //     generationConfig,
//     //     history: [
//     //     ],
//     //   });
    
//     //   const result = await chatSession.sendMessage(`Generate a ten-question quiz in MCQ format about the following topic: ${question}. Ensure each question includes multiple choices and is related to the context and dont give answer at last`);
//     //   console.log(result.response.text());
//     // }
    
    

//   async function generateAns() {
//     setLoader(true);
//     setAnswer("loading");

//     const response = await axios({
//       url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
//       method: "post",
//       data: {
//         contents: [
//           {
//             parts: [{
//               text: `Generate a ten-question quiz in MCQ format about the following topic: ${question}. Ensure each question includes multiple choices and is related to the context and dont give answer at last`
//             }]
//           },
//         ]
//       }
//     });
//     const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
//     const genAI = new GoogleGenerativeAI(apiKey);
    
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash",
//     });
    
//     const generationConfig = {
//       temperature: 1,
//       topP: 0.95,
//       topK: 40,
//       maxOutputTokens: 8192,
//       responseMimeType: "text/plain",
//     };
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [
//       ],
//     });
  
//     const result = await chatSession.sendMessage(`Create a ten-question multiple-choice quiz based strictly on the following content: '${question}'. Each question must be directly related to the provided content and include four answer choices labeled A, B, C, and D. Do not provide any headings, titles, introductions, explanations, or conclusions—only the questions and answer choices.`);
//     console.log(result.response.text());

//     // Simulate delay for modern feel and UX
//     setTimeout(() => {
//       setAnswer(result.response.text());
//       setLoader(false);
//       // setDisplayQuiz(true);
//       setHidden("hidden");
//     }, 3000);
//   }

//   const downloadQuiz = () => {
//     const element = document.createElement("a");
//     const file = new Blob([answer], { type: "text/plain" });
//     element.href = URL.createObjectURL(file);
//     element.download = "quiz.txt";
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
//       {loader ? (
//         <div className="flex items-center justify-center h-screen">
//           <SpinnerLoad />
//         </div>
//       ) : (
//         // Input form: hidden when quiz is generated
//         <div className={`flex flex-col items-center justify-center p-4 md:p-8 ${hide} ${displayQuiz ? 'hidden' : 'flex'} h-screen`}>
//           <h1 className="text-white tracking-wider text-3xl md:text-5xl font-sans font-bold mb-8">
//             Paste Your Paragraph
//           </h1>
//           <textarea
//             className="w-full max-w-2xl bg-transparent p-4 md:p-6 border-2 border-gray-300 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             cols="30"
//             rows="8"
//             placeholder="Enter your content here..."
//           ></textarea>
//           <button
//             className="rounded-md w-full max-w-xs mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold"
//             onClick={generateAns}
//           >
//             Generate Quiz
//           </button>
//         </div>
//       )}

//       {displayQuiz && (
//         <div className="flex flex-col items-center justify-center p-4 md:p-8">
//           <div className="w-full max-w-3xl bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6 my-8">
//             <pre className="whitespace-pre-wrap break-words text-lg text-lime-400">
//               {answer}
//             </pre>
//           </div>
//           <button
//             className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-md font-semibold"
//             onClick={downloadQuiz}
//           >
//             Download Quiz
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenAI;


import React, { useState } from 'react';
import axios from 'axios';
import SpinnerLoad from './SpinnerLoad';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const GenAI = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // "idle", "loading", "done"

  const generateAns = async () => {
    if (!question.trim()) return alert("Please enter a valid paragraph.");
    setStatus("loading");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      };

      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(
        `Create a ten-question multiple-choice quiz based on the content: '${question}'. Ensure four options per question.`
      );

      setAnswer(result.response.text());
      setStatus("done");
    } catch (error) {
      console.error("Error generating quiz:", error);
      setAnswer("Failed to generate quiz. Please try again.");
      setStatus("idle");
    }
  };

  const downloadQuiz = () => {
    const element = document.createElement("a");
    const file = new Blob([answer], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "quiz.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {status === "loading" ? (
        <div className="flex items-center justify-center h-screen">
          <SpinnerLoad />
        </div>
      ) : status === "done" ? (
        <div className="flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-3xl bg-gray-800 bg-opacity-80 rounded-xl shadow-lg p-6 my-8">
            <pre className="whitespace-pre-wrap break-words text-lg text-lime-400">{answer}</pre>
          </div>
          <button className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-md font-semibold" onClick={downloadQuiz}>
            Download Quiz
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 md:p-8 h-screen">
          <h1 className="text-3xl md:text-5xl font-bold mb-8">Paste Your Paragraph</h1>
          <textarea
            className="w-full max-w-2xl bg-transparent p-4 border-2 border-gray-300 rounded-lg text-white"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            cols="30"
            rows="8"
            placeholder="Enter your content here..."
          />
          <button
            className="rounded-md w-full max-w-xs mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={generateAns}
          >
            Generate Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default GenAI;
