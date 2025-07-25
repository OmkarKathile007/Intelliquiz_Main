import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import AIimage from "../../assets/AI-Image.png";
import brainImage from "../../assets/brain.png";
import MultiplayerIcon from "../../assets/multiplayer.png";
import QuizIcon from "../../assets/QuizIcon2.png";
import ExamPng from "../../assets/exams.png";
import SelfLearning from "../../assets/Self_Learning.png";
import EmpAssessment from "../../assets/EMP_ASSESSMENT.png";
import Footer from "../Footer/Footer";
import bghome from "./bghome.png";
// import { Marquee } from "../../component/magicui/marquee";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/main");
  };

  const featuresRef = useRef(null);

  // Intersection observer for animating the "Features" title
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slide-in-left");
        }
      },
      { threshold: 0.1 }
    );
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  // Animate each letter in list items
  useEffect(() => {
    const listItems = document.querySelectorAll(".letter-animate li");
    listItems.forEach((item) => {
      const letters = item.textContent.split("");
      item.innerHTML = letters
        .map(
          (letter, i) =>
            `<span style="display: inline-block; animation: letter-pull-up 0.3s ease-out forwards; animation-delay: ${
              i * 0.02
            }s;">${letter}</span>`
        )
        .join("");
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-black w-full scroll-smooth min-h-screen flex flex-col items-center justify-center">
        <div
          className="
    w-full
    min-h-screen
    relative
    bg-[url(`${bghome}`)]
    bg-fixed
    bg-cover
    bg-center
    text-white
    px-4 sm:px-6 lg:px-8
  "
          style={{
            backgroundImage: `url(${bghome})`,
          }}
        >
          {/* Dark overlay to ensure text remains legible */}
          <div className="absolute inset-0 bg-black/80"></div>

          <div className="relative z-10 w-full mt-10 lg:mt-24 flex flex-col-reverse lg:flex-row justify-between items-center">
            {/* Left-side Text Container */}
            <div
              className="
        lg:ml-16 xl:ml-32
       
        lg:w-1/2
        flex flex-col
        items-center lg:items-start
        gap-4 sm:gap-6
        p-6
        rounded-lg
      "
            >
              <h2
                className="
          text-5xl sm:text-4xl md:text-4xl lg:text-7xl xl:text-7xl
          font-bold
          text-transparent
          bg-clip-text
          bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
          drop-shadow-lg
          animate-fade-in-up
        "
              >
                Personalized AI Learning
              </h2>

              <p
                className="
          mt-4 sm:mt-6
          text-sm sm:text-base md:text-lg lg:text-xl
          font-raleway
          animate-fade-in-up
          md:font-semibold
          text-center lg:text-left
          max-w-lg lg:max-w-none
          text-transparent
          bg-clip-text
          bg-gradient-to-r from-gray-300 to-white
          transition-transform duration-500 ease-out
          hover:scale-102
        "
              >
                Elevate your learning with AI-driven quizzes and multiplayer
                online modes, designed to make studying smarter and more
                engaging for students.
              </p>

              <div className="flex justify-center lg:justify-start sm:mt-8">
                <button
                  onClick={handleClick}
                  className="
            bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-800
            border border-gray-300
            drop-shadow-lg
            font-semibold
            py-2 px-6 sm:py-3 sm:px-8 md:py-3 md:px-10
            rounded-md
            text-sm sm:text-base
            transition-transform duration-300 ease-out
            hover:scale-105
          "
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Right-side Image */}
            <div className="flex justify-center lg:justify-end lg:w-1/2">
              <img
                className="
          w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
          mt-6 sm:mt-10 lg:mt-20
          drop-shadow-[0_10px_15px_rgba(135,206,235,0.7)]
          animate-move-up-down
        "
                src={AIimage}
                alt="AI Illustration"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <hr className="w-full mt-16 md:mt-32 lg:mt-56 border-gray-600" />
        <div className="bg-black w-full px-4 sm:px-6 lg:px-8">
          <div>
            <p
              ref={featuresRef}
              className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl p-4 font-bold"
            >
              Features
            </p>
          </div>

          {/* Feature 1 */}
          <div className="w-full py-10 sm:py-16 flex flex-col gap-6 sm:gap-8 lg:flex-row justify-evenly items-center">
            <img
              className="w-full max-w-[280px] sm:max-w-xs drop-shadow-[0_5px_5px_rgba(255,105,180,0.5)] animate-fade-in"
              src={brainImage}
              alt="AI Brain"
            />
            <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-2xl">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl animate-fade-move text-center lg:text-left font-raleway">
                PARAGRAPH BASED AI QUIZ GENERATION
              </h3>
              <div className="letter-animate text-white flex flex-col text-left gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 xl:p-12 bg-neutral-900 rounded-lg border border-gray-600 py-6 sm:py-8 animate-border-beam">
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light animate-letter-pull-up font-raleway">
                  AI-Powered Quiz Generation: Convert any paragraph into a quiz
                  instantly.
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light animate-letter-pull-up font-raleway">
                  Multi-Language Support: Generate quizzes in multiple
                  languages.
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light animate-letter-pull-up font-raleway">
                  Turn any text, from academic notes to articles, into an
                  interactive learning session.
                </p>
              </div>
            </div>
          </div>
          <hr className="border-gray-600 w-full" />

          {/* Feature 2 */}
          <div className="w-full py-10 sm:py-16 flex flex-col gap-6 sm:gap-8 lg:flex-row justify-evenly items-center">
            <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-2xl order-2 lg:order-1">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl animate-fade-move text-center lg:text-left font-raleway">
                MULTIPLAYER QUIZ MODE
              </h3>
              <div className="letter-animate text-white flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 xl:p-12 bg-neutral-900 font-raleway font-light rounded-lg border border-gray-600 py-6 sm:py-8">
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl animate-letter-pull-up">
                  Compete in real-time quiz sessions.
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl animate-letter-pull-up">
                  Multiple participants per session for collaborative
                  competition.
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl animate-letter-pull-up">
                  Randomized questions to keep each session unique.
                </p>
              </div>
            </div>
            <img
              className="w-full max-w-[280px] sm:max-w-xs drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] animate-fade-in filter invert order-1 lg:order-2"
              src={MultiplayerIcon}
              alt="Multiplayer Quiz"
            />
          </div>
          <hr className="border-gray-600 w-full" />

          {/* Feature 3 */}
          <div className="w-full py-10 sm:py-16 flex flex-col gap-6 sm:gap-8 lg:flex-row justify-evenly items-center">
            <img
              className="w-full max-w-[280px] sm:max-w-xs drop-shadow-[0_5px_5px_rgba(255,255,255,0.7)] animate-fade-in"
              src={QuizIcon}
              alt="Quiz Icon"
            />
            <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-2xl">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl animate-fade-move text-center lg:text-left font-raleway">
                PREPARE FOR CAMPUS PLACEMENT
              </h3>
              <div className="letter-animate text-white flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 xl:p-12 bg-neutral-900 font-raleway font-light rounded-lg border border-gray-600 py-6 sm:py-8">
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl">
                  Simulate real exam conditions for effective practice.
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl">
                  Quizzes on CS Fundamentals.
                </p>
                <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl">
                  Test your knowledge with our most asked questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-600 w-full" />

        {/* Made For Whom Section */}
        <div className="bg-black w-full pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
          
          <div className="w-full mt-12 sm:mt-16 lg:mt-20">
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white md:font-bold text-center">
              MADE FOR WHOM?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10 w-full">
              {/* Education */}
              <div className="rounded-lg border border-gray-600 p-4 flex flex-col items-center">
                <img
                  className="w-1/2 sm:w-2/5 m-auto mt-4 sm:mt-6 drop-shadow-lg animate-fade-in"
                  src={ExamPng}
                  alt="Education"
                />
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-2 sm:mt-3 text-center shadow-md animate-fade-in">
                  EDUCATION
                </p>
                <div className="w-full mt-3 sm:mt-4 border border-gray-600 p-2 sm:p-3">
                  <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light text-center p-2 sm:p-3 animate-letter-pull-up">
                    IntelliQuiz automates quiz creation for teachers, students,
                    and EdTech platforms, saving time, enhancing engagement, and
                    ensuring personalized assessments for education, competitive
                    exams, and adaptive learning.
                  </p>
                </div>
              </div>
              {/* Corporate Training */}
              <div className="rounded-lg border border-gray-600 p-4 flex flex-col items-center">
                <img
                  className="w-3/5 sm:w-1/2 h-auto sm:h-48 md:h-56 m-auto mt-4 sm:mt-6 drop-shadow-lg animate-fade-in"
                  src={EmpAssessment}
                  alt="Corporate Training"
                />
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-2 sm:mt-3 text-center shadow-md animate-fade-in">
                  CORPORATE TRAINING
                </p>
                <div className="w-full mt-3 sm:mt-4 border border-gray-600 p-2 sm:p-3">
                  <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light text-center p-2 sm:p-3 animate-letter-pull-up">
                    IntelliQuiz automates quiz creation for corporate training,
                    saving time, enhancing engagement, and ensuring effective
                    employee assessments.
                  </p>
                </div>
              </div>
              {/* Self-Learning */}
              <div className="rounded-lg border border-gray-600 p-4 flex flex-col items-center">
                <img
                  className="w-4/5 sm:w-3/4 m-auto mt-2 sm:mt-3 drop-shadow-lg animate-fade-in"
                  src={SelfLearning}
                  alt="Self-Learning"
                />
                <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-2 sm:mt-3 text-center shadow-md animate-fade-in">
                  SELF-LEARNING
                </p>
                <div className="w-full mt-3 sm:mt-4 border-2 border-gray-600 p-2 sm:p-3">
                  <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light text-center p-2 sm:p-3 animate-letter-pull-up">
                    IntelliQuiz simplifies learning by generating quizzes from
                    textbooks or content, helping users test knowledge, retain
                    information, and master topics effectively through active
                    recall.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-600 w-full" />

        {/* About Section */}
        <div className="bg-black w-full py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mt-10">
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white md:font-bold text-center">
              About us
            </p>
            <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl p-4 sm:p-6 lg:p-8 xl:p-14 mt-6 sm:mt-8 text-justify">
              IntelliQuiz turns any content into interactive quizzes, helping
              educators, students, and self-learners learn effectively. With
              features like multiplayer mode for collaborative learning and
              specialized preparation for campus placements, we aim to make
              learning engaging, accessible, and efficient for everyone.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;

// import React, { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// import AIimage from '../../assets/AI-Image.png';
// import brainImage from '../../assets/brain.png';
// import MultiplayerIcon from '../../assets/multiplayer.png';
// import QuizIcon from '../../assets/QuizIcon2.png';
// import ExamPng from '../../assets/exams.png';
// import SelfLearning from '../../assets/Self_Learning.png';
// import EmpAssessment from '../../assets/EMP_ASSESSMENT.png';
// import Footer from '../Footer/Footer';

// const Home = () => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate('/main');
//   };

//   const featuresRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('animate-slide-in-left');
//         }
//       },
//       { threshold: 0.1 }
//     );
//     if (featuresRef.current) {
//       observer.observe(featuresRef.current);
//     }
//     return () => {
//       if (featuresRef.current) {
//         observer.unobserve(featuresRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const listItems = document.querySelectorAll('.letter-animate li');
//     listItems.forEach((item) => {
//       const letters = item.textContent.split('');
//       item.innerHTML = letters
//         .map(
//           (letter, i) =>
//             `<span style="display: inline-block; animation: letter-pull-up 0.3s ease-out forwards; animation-delay: ${i *
//               0.02}s;">${letter}</span>`
//         )
//         .join('');
//     });
//   }, []);

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="bg-black min-w-fit  min-h-screen flex flex-col items-center justify-center ">
//         <div className="w-full min-h-screen bg-black flex flex-col lg:flex-row text-white px-4 sm:px-6 lg:px-8">
//           <div className="w-full mt-12 lg:mt-24 flex flex-col-reverse lg:flex-row justify-between items-center">
//             <div className="lg:ml-16 xl:ml-32 lg:w-1/2 flex flex-col items-center lg:items-start gap-4 sm:gap-6 px-2">
//               <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-300 mt-4 lg:mt-40 animate-fade-move text-center lg:text-left">
//                 AI Driven Quiz
//               </h2>
//               <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base lg:text-lg font-raleway animate-fade-in text-center lg:text-left max-w-md lg:max-w-none">
//                 Elevate your learning with AI-driven quizzes and multiplayer online modes, designed to make studying smarter and more engaging for students.
//               </p>
//               <div className="flex justify-center lg:justify-start mt-4 sm:mt-6 lg:mt-12 xl:mt-20">
//                 <button
//                   onClick={handleClick}
//                   className="bg-blue-700 font-semibold py-2 px-4 sm:py-3 sm:px-6 md:py-3 md:px-8 rounded-md shadow-lg transition-transform transform hover:scale-105 text-xs sm:text-sm"
//                 >
//                   Get Started
//                 </button>
//               </div>
//             </div>
//             <div className="flex justify-center lg:justify-end lg:w-1/2 px-2 overflow-hidden">
//               <img
//                 className="w-full max-w-[240px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-4 sm:mt-6 lg:mt-12 drop-shadow-[0_10px_15px_rgba(135,206,235,0.7)] animate-move-up-down"
//                 src={AIimage}
//                 alt="AI-Image"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Features Section */}
//         <hr className="w-screen -mx-4 sm:-mx-6 lg:-mx-8 mt-12 md:mt-24 lg:mt-40 border-gray-600" />
//         <div className="bg-black w-full px-4 sm:px-6 lg:px-8">
//           <div>
//             <p ref={featuresRef} className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl p-4 font-bold">
//               Features
//             </p>
//           </div>

//           {/* Feature 1 */}
//           <div className="w-full py-8 sm:py-12 flex flex-col gap-4 sm:gap-6 lg:flex-row justify-evenly items-center">
//             <img
//               className="w-full max-w-[200px] sm:max-w-xs drop-shadow-[0_5px_5px_rgba(255,105,180,0.5)] animate-fade-in"
//               src={brainImage}
//               alt="AI Brain"
//             />
//             <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-2xl">
//               <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl animate-fade-move text-center lg:text-left font-raleway">
//                 PARAGRAPH BASED AI QUIZ GENERATION
//               </h3>
//               <div className="letter-animate text-white flex flex-col text-left gap-2 sm:gap-3 p-3 sm:p-4 lg:p-6 xl:p-8 bg-neutral-900 rounded-lg border border-gray-600 py-4 sm:py-6 animate-border-beam">
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light animate-letter-pull-up font-raleway break-words">
//                   AI-Powered Quiz Generation: Convert any paragraph into a quiz instantly.
//                 </p>
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light animate-letter-pull-up font-raleway break-words">
//                   Multi-Language Support: Generate quizzes in multiple languages.
//                 </p>
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-light animate-letter-pull-up font-raleway break-words">
//                   Turn any text, from academic notes to articles, into an interactive learning session.
//                 </p>
//               </div>
//             </div>
//           </div>
//           <hr className="w-screen -mx-4 sm:-mx-6 lg:-mx-8 border-gray-600" />

//           {/* Feature 2 */}
//           <div className="w-full py-8 sm:py-12 flex flex-col gap-4 sm:gap-6 lg:flex-row justify-evenly items-center">
//             <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-2xl order-2 lg:order-1">
//               <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl animate-fade-move text-center lg:text-left font-raleway">
//                 MULTIPLAYER QUIZ MODE
//               </h3>
//               <div className="letter-animate text-white flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 lg:p-6 xl:p-8 bg-neutral-900 font-raleway font-light rounded-lg border border-gray-600 py-4 sm:py-6">
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg animate-letter-pull-up break-words">
//                   Compete in real-time quiz sessions.
//                 </p>
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg animate-letter-pull-up break-words">
//                   Multiple participants per session for collaborative competition.
//                 </p>
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg animate-letter-pull-up break-words">
//                   Randomized questions to keep each session unique.
//                 </p>
//               </div>
//             </div>
//             <img
//               className="w-full max-w-[200px] sm:max-w-xs drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] animate-fade-in filter invert order-1 lg:order-2"
//               src={MultiplayerIcon}
//               alt="Multiplayer Quiz"
//             />
//           </div>
//           <hr className="w-screen -mx-4 sm:-mx-6 lg:-mx-8 border-gray-600" />

//           {/* Feature 3 */}
//           <div className="w-full py-8 sm:py-12 flex flex-col gap-4 sm:gap-6 lg:flex-row justify-evenly items-center">
//             <img
//               className="w-full max-w-[200px] sm:max-w-xs drop-shadow-[0_5px_5px_rgba(255,255,255,0.7)] animate-fade-in"
//               src={QuizIcon}
//               alt="Quiz Icon"
//             />
//             <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-2xl">
//               <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl animate-fade-move text-center lg:text-left font-raleway">
//                 PREPARE FOR CAMPUS PLACEMENT
//               </h3>
//               <div className="letter-animate text-white flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 lg:p-6 xl:p-8 bg-neutral-900 font-raleway font-light rounded-lg border border-gray-600 py-4 sm:py-6">
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg break-words">
//                   Simulate real exam conditions for effective practice.
//                 </p>
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg break-words">
//                   Quizzes on CS Fundamentals.
//                 </p>
//                 <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg break-words">
//                   Test your knowledge with our most asked questions.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <hr className="w-screen -mx-4 sm:-mx-6 lg:-mx-8 border-gray-600" />

//         {/* Made For Whom Section */}
//         <div className="bg-black w-full pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
//           <div className="w-full mt-8 sm:mt-12 lg:mt-16">
//             <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-center">MADE FOR WHOM?</p>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 w-full">
//               {/* Education */}
//               <div className="rounded-lg border border-gray-600 p-3 flex flex-col items-center">
//                 <img
//                   className="w-1/2 sm:w-2/5 m-auto mt-2 sm:mt-4 drop-shadow-lg animate-fade-in"
//                   src={ExamPng}
//                   alt="Education"
//                 />
//                 <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2 text-center shadow-md animate-fade-in">
//                   EDUCATION
//                 </p>
//                 <div className="w-full mt-2 sm:mt-3 border border-gray-600 p-2">
//                   <p className="text-white text-xs sm:text-sm md:text-base font-light text-center p-2 animate-letter-pull-up break-words">
//                     IntelliQuiz automates quiz creation for teachers, students, and EdTech platforms, saving time, enhancing engagement, and ensuring personalized assessments for education, competitive exams, and adaptive learning.
//                   </p>
//                 </div>
//               </div>
//               {/* Corporate Training */}
//               <div className="rounded-lg border border-gray-600 p-3 flex flex-col items-center">
//                 <img
//                   className="w-3/5 sm:w-1/2 h-auto sm:h-40 md:h-48 m-auto mt-2 sm:mt-4 drop-shadow-lg animate-fade-in"
//                   src={EmpAssessment}
//                   alt="Corporate Training"
//                 />
//                 <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2 text-center shadow-md animate-fade-in">
//                   CORPORATE TRAINING
//                 </p>
//                 <div className="w-full mt-2 sm:mt-3 border border-gray-600 p-2">
//                   <p className="text-white text-xs sm:text-sm md:text-base font-light text-center p-2 animate-letter-pull-up break-words">
//                     IntelliQuiz automates quiz creation for corporate training, saving time, enhancing engagement, and ensuring effective employee assessments.
//                   </p>
//                 </div>
//               </div>
//               {/* Self-Learning */}
//               <div className="rounded-lg border border-gray-600 p-3 flex flex-col items-center">
//                 <img
//                   className="w-4/5 sm:w-3/4 m-auto mt-1 sm:mt-2 drop-shadow-lg animate-fade-in"
//                   src={SelfLearning}
//                   alt="Self-Learning"
//                 />
//                 <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2 text-center shadow-md animate-fade-in">
//                   SELF-LEARNING
//                 </p>
//                 <div className="w-full mt-2 sm:mt-3 border-2 border-gray-600 p-2">
//                   <p className="text-white text-xs sm:text-sm md:text-base font-light text-center p-2 animate-letter-pull-up break-words">
//                     IntelliQuiz simplifies learning by generating quizzes from textbooks or content, helping users test knowledge, retain information, and master topics effectively through active recall.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <hr className="w-screen -mx-4 sm:-mx-6 lg:-mx-8 border-gray-600" />

//         {/* About Section */}
//         <div className="bg-black w-full py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
//           <div className="mt-6 sm:mt-8">
//             <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-center">About us</p>
//             <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg p-3 sm:p-4 lg:p-6 xl:p-8 mt-4 sm:mt-6 text-justify sm:text-left break-words">
//               IntelliQuiz turns any content into interactive quizzes, helping educators, students, and self-learners learn effectively. With features like multiplayer mode for collaborative learning and specialized preparation for campus placements, we aim to make learning engaging, accessible, and efficient for everyone.
//             </p>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default Home;
