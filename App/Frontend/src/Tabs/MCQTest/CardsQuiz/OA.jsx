

import React, { useState, useEffect } from "react";
import Quiz from "../Quiz";

const OA = () => {
  const [hide, setHide] = useState(true);
  const [id, setId] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaError, setMediaError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Stop media when user leaves or hides the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
        console.log("Media tracks stopped due to tab hide.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
  }, [mediaStream]);

  // Keep fullscreen state in sync
  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  return (
    <div className="bg-black w-screen min-h-screen flex flex-col items-center justify-center p-4">
      {hide ? (
        <div
          className="text-white border bg-custom-gray border-gray-500 w-full max-w-2xl rounded-lg 
                     p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     flex flex-col items-center"
        >
          <h1 className="w-full text-center text-3xl md:text-6xl font-semibold mb-6">
            Rules and Regulations
          </h1>

          <div className="flex flex-col items-center w-full gap-4 mt-4">
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
              onClick={toggleFullscreen}
              disabled={!mediaStream}
              className={`font-raleway rounded-md w-full max-w-sm py-3 md:py-4 text-xl md:text-3xl transition-colors
                ${mediaStream
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-gray-600 cursor-not-allowed"} mt-2`}
            >
              {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            </button>

            <button
              onClick={() => {
                TriggerQuiz();
                setId(3);
              }}
              disabled={!mediaStream}
              className={`font-raleway rounded-md w-full max-w-sm py-3 md:py-4 text-xl md:text-3xl transition-colors mt-4
                ${
                  mediaStream
                    ? "bg-green-400 hover:bg-green-300"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
            >
              Start Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-20 md:mt-40 flex flex-col gap-10 w-full px-4 items-center">
          <h1 className="w-full text-center text-3xl md:text-6xl font-bold text-white">
            Online Assessment
          </h1>
          <Quiz id={id} quiz="OA" />
        </div>
      )}
    </div>
  );
};

export default OA;
