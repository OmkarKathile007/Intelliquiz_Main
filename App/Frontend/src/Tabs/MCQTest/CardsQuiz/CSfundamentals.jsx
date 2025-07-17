// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Quiz from "../Quiz";
// import Difficulty from "../Difficulty/Difficulty";

// const CSfundamentals = () => {
//   const [hide, setHide] = useState(true);
//   const [quiz, setQuiz] = useState([]);
//   const [id, setId] = useState(0);

//   function TriggerQuiz() {
//     setHide(false);
//   }

//   return (
//     <>
//       <div className="bg-black w-screen min-h-screen flex flex-col items-center justify-center p-4">
//         {hide ? (
//           <div className="text-white border bg-custom-gray border-gray-500 w-full max-w-2xl rounded-lg 
//                           p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//                           flex flex-col items-center">
//             <h1 className="w-full text-center text-md md:text-6xl font-semibold mb-6">
//               Rules and Regulations
//             </h1>
//             <div className="flex flex-col items-center w-full gap-5 mt-4">
//               <ul className="list-disc list-inside w-full px-4">
//                 <li className="mb-2 text-base md:text-xl">
//                   The quiz consists of multiple-choice questions (MCQs).
//                 </li>
//                 <li className="mb-2 text-base md:text-xl">
//                   Users cannot pause or restart a quiz session once it has begun.
//                 </li>
//                 <li className="mb-2 text-base md:text-xl">
//                   Final score will be declared after the end of the quiz.
//                 </li>
//               </ul>
//               <button
//                 onClick={() => {
//                   TriggerQuiz();
//                   setId(1);
//                 }}
//                 className="font-raleway rounded-md w-full max-w-sm bg-green-400 py-3 md:py-4 text-xl md:text-3xl hover:bg-green-300 transition-colors mt-4"
//               >
//                 Start Quiz
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-20 md:mt-40 flex flex-col gap-10 w-full px-4">
//             <h1 className="w-full text-center text-2xl md:text-6xl font-bold text-white">
//               Quiz on CS Fundamentals
//             </h1>
//             <Quiz id={id} quiz="CS" />
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CSfundamentals;
import React, { useState } from "react";
import Quiz from "../Quiz";

const CSfundamentals = () => {
  const [hide, setHide] = useState(true);
  const [id, setId] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaError, setMediaError] = useState("");

  const TriggerQuiz = () => {
    setHide(false);
  };

  const requestMedia = async () => {
    setMediaError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      console.log("Media access granted:", stream);
    } catch (err) {
      console.error("Media access denied:", err);
      setMediaError("Camera & microphone access was denied.");
    }
  };

  return (
    <>
      <div className="bg-black w-screen min-h-screen flex flex-col items-center justify-center p-4">
        {hide ? (
          <div
            className="text-white border bg-custom-gray border-gray-500 w-full max-w-2xl rounded-lg 
                        p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        flex flex-col items-center"
          >
            <h1 className="w-full text-center text-md md:text-6xl font-semibold mb-6">
              Rules and Regulations
            </h1>

            <div className="flex flex-col items-center w-full gap-5 mt-4">
              <ul className="list-disc list-inside w-full px-4">
                <li className="mb-2 text-base md:text-xl">
                  The quiz consists of multiple-choice questions (MCQs).
                </li>
                <li className="mb-2 text-base md:text-xl">
                  Users cannot pause or restart a quiz session once it has begun.
                </li>
                <li className="mb-2 text-base md:text-xl">
                  Final score will be declared after the end of the quiz.
                </li>
                <li className="mb-2 text-base md:text-xl">
                  Camera and microphone will be monitored throughout the quiz.
                </li>
              </ul>

              {mediaError && (
                <p className="text-red-400 text-sm md:text-base">
                  {mediaError}
                </p>
              )}

              <button
                onClick={requestMedia}
                className="font-raleway rounded-md w-full max-w-sm bg-blue-500 py-3 md:py-4 text-xl md:text-3xl hover:bg-blue-400 transition-colors"
              >
                Enable Camera & Microphone
              </button>

              <button
                onClick={() => {
                  TriggerQuiz();
                  setId(1);
                }}
                disabled={!mediaStream}
                className={`font-raleway rounded-md w-full max-w-sm py-3 md:py-4 text-xl md:text-3xl transition-colors mt-4
                  ${mediaStream
                    ? "bg-green-400 hover:bg-green-300"
                    : "bg-gray-600 cursor-not-allowed"}`}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-20 md:mt-40 flex flex-col gap-10 w-full px-4">
            <h1 className="w-full text-center text-2xl md:text-6xl font-bold text-white">
              Quiz on CS Fundamentals
            </h1>
            <Quiz id={id} quiz="CS" />
          </div>
        )}
      </div>
    </>
  );
};

export default CSfundamentals;
