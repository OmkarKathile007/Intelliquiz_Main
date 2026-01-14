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



// AI GENERATED UI

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   motion, 
//   useScroll, 
//   useTransform, 
//   useSpring, 
//   useMotionValue, 
//   useMotionTemplate, 
//   AnimatePresence 
// } from "framer-motion";
// import { 
//   Brain, 
//   Users, 
//   Zap, 
//   Target, 
//   Briefcase, 
//   BookOpen, 
//   ChevronRight, 
//   Cpu 
// } from "lucide-react";

// // --- Keep your original Asset Imports here ---
// import AIimage from "../../assets/AI-Image.png";
// import brainImage from "../../assets/brain.png";
// import MultiplayerIcon from "../../assets/multiplayer.png";
// import QuizIcon from "../../assets/QuizIcon2.png";
// import ExamPng from "../../assets/exams.png";
// import SelfLearning from "../../assets/Self_Learning.png";
// import EmpAssessment from "../../assets/EMP_ASSESSMENT.png";
// import Footer from "../Footer/Footer";
// // bghome is replaced by the dynamic CSS Aurora background, but kept for fallback
// import bghome from "./bghome.png"; 

// // --- UTILITY COMPONENTS ---

// const MagneticButton = ({ children, onClick, className }) => {
//   const ref = useRef(null);
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const springX = useSpring(x, { stiffness: 150, damping: 15 });
//   const springY = useSpring(y, { stiffness: 150, damping: 15 });

//   const handleMouseMove = (e) => {
//     const { clientX, clientY } = e;
//     const { left, top, width, height } = ref.current.getBoundingClientRect();
//     const centerX = left + width / 2;
//     const centerY = top + height / 2;
//     x.set((clientX - centerX) * 0.3);
//     y.set((clientY - centerY) * 0.3);
//   };

//   const handleMouseLeave = () => {
//     x.set(0);
//     y.set(0);
//   };

//   return (
//     <motion.button
//       ref={ref}
//       onClick={onClick}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       style={{ x: springX, y: springY }}
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.95 }}
//       className={`relative overflow-hidden group ${className}`}
//     >
//       <span className="relative z-10">{children}</span>
//       <div className="absolute inset-0 -z-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//       <div className="absolute inset-0 -z-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
//     </motion.button>
//   );
// };

// const TiltCard = ({ children, className }) => {
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
//   const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

//   function onMouseMove({ currentTarget, clientX, clientY }) {
//     const { left, top, width, height } = currentTarget.getBoundingClientRect();
//     x.set((clientX - left - width / 2) / 20);
//     y.set((clientY - top - height / 2) / 20);
//   }

//   return (
//     <motion.div
//       onMouseMove={onMouseMove}
//       onMouseLeave={() => {
//         x.set(0);
//         y.set(0);
//       }}
//       style={{
//         rotateY: mouseX,
//         rotateX: useTransform(mouseY, (value) => -value),
//         transformStyle: "preserve-3d",
//       }}
//       className={`relative transform transition-all duration-200 ease-out ${className}`}
//     >
//       {children}
//     </motion.div>
//   );
// };

// const GlitchText = ({ text }) => {
//   return (
//     <div className="relative inline-block group">
//       <span className="relative z-10">{text}</span>
//       <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-400 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-1">
//         {text}
//       </span>
//       <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-400 opacity-0 group-hover:opacity-70 group-hover:animate-glitch-2">
//         {text}
//       </span>
//     </div>
//   );
// };

// // --- BACKGROUND EFFECTS ---

// const NeuralBackground = () => {
//   return (
//     <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
//       {/* Aurora Gradients */}
//       <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[120px] animate-pulse-slow" />
//       <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
//       <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] animate-pulse-slow delay-2000" />
      
//       {/* Scanline Overlay */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_51%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
      
//       {/* Floating Particles (Simulated via CSS for performance) */}
//       <div className="absolute inset-0 opacity-30">
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute bg-cyan-400 rounded-full blur-[1px]"
//             initial={{ 
//               x: Math.random() * window.innerWidth, 
//               y: Math.random() * window.innerHeight,
//               scale: Math.random() * 0.5 + 0.5
//             }}
//             animate={{ 
//               y: [null, Math.random() * window.innerHeight],
//               opacity: [0, 0.8, 0]
//             }}
//             transition={{ 
//               duration: Math.random() * 10 + 10, 
//               repeat: Infinity, 
//               ease: "linear" 
//             }}
//             style={{ width: Math.random() * 4 + 1 + 'px', height: Math.random() * 4 + 1 + 'px' }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const CustomCursor = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);

//   useEffect(() => {
//     const updateMousePosition = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//       const target = e.target;
//       setIsHovering(target.closest('button') || target.closest('a') || target.closest('.hover-trigger'));
//     };
//     window.addEventListener('mousemove', updateMousePosition);
//     return () => window.removeEventListener('mousemove', updateMousePosition);
//   }, []);

//   return (
//     <>
//       <motion.div
//         className="fixed top-0 left-0 w-4 h-4 bg-cyan-400 rounded-full mix-blend-difference pointer-events-none z-[9999]"
//         animate={{ x: mousePosition.x - 8, y: mousePosition.y - 8, scale: isHovering ? 2 : 1 }}
//         transition={{ type: "spring", stiffness: 500, damping: 28 }}
//       />
//       <motion.div
//         className="fixed top-0 left-0 w-8 h-8 border border-cyan-400/50 rounded-full pointer-events-none z-[9998]"
//         animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16, scale: isHovering ? 1.5 : 1 }}
//         transition={{ type: "spring", stiffness: 250, damping: 20 }}
//       />
//     </>
//   );
// };

// // --- MAIN COMPONENT ---

// const Home = () => {
//   const navigate = useNavigate();
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

//   const handleClick = () => navigate("/main");

//   // Animations variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1, 
//       transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1, 
//       transition: { type: "spring", stiffness: 100 } 
//     }
//   };

//   return (
//     <div className="bg-black min-h-screen text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
//       {/* <CustomCursor /> */}
//       <NeuralBackground />
      
//       {/* Progress Bar */}
//       <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 origin-left z-[100]" style={{ scaleX }} />

//       {/* --- HERO SECTION --- */}
//       <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
//         <motion.div 
//           className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12"
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//         >
//           {/* Text Content */}
//           <div className="lg:w-1/2 text-center  z-20">
//             <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 backdrop-blur-md mb-6">
//               <span className="relative flex h-2 w-2">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
//               </span>
//               <span className="text-xs font-mono text-cyan-300 tracking-wider">SYSTEM ONLINE v2.0</span>
//             </motion.div>

//             <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
//               <GlitchText text="INTELLI" />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
//                  QUIZ
//               </span>
//             </motion.h1>

//             <motion.p variants={itemVariants} className="text-lg md:text-xl lg:mx-20 text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
//               Upload any content. Generate an assessment instantly. 
//               <span className="text-cyan-400 font-semibold"> 60% faster</span> learning retention through our AI-driven active recall engine.
//             </motion.p>

//             <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-center">
//               <MagneticButton 
//                 onClick={handleClick}
//                 className="bg-white text-black font-bold py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-transparent hover:border-white/50 transition-all"
//               >
//                 Get Started 
//               </MagneticButton>
//               {/* <MagneticButton className="bg-transparent text-white border border-white/20 font-bold py-4 px-8 rounded-lg hover:bg-white/5 backdrop-blur-sm">
//                 Watch Demo
//               </MagneticButton> */}
//             </motion.div>
//           </div>

//           {/* Hero Visual (3D/Image) */}
//           <motion.div 
//             className="lg:w-1/2 relative flex justify-center perspective-1000"
//             variants={itemVariants}
//           >
//             {/* Spinning Wireframe Decoration */}
//             <motion.div 
//               animate={{ rotate: 360 }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               className="absolute inset-0 border-[1px] border-dashed border-cyan-500/20 rounded-full w-[400px] h-[400px] md:w-[600px] md:h-[600px] m-auto"
//             />
            
//             <div className="relative z-10 w-full max-w-lg">
//               <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-2xl rounded-full" />
//               <img 
//                 src={AIimage} 
//                 alt="AI Intelligence" 
//                 className="relative z-10 w-full drop-shadow-[0_20px_50px_rgba(6,182,212,0.5)]"
//               />
              
//               {/* Floating UI Elements on top of image */}
//               {/* <motion.div 
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -right-8 top-20 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3"
//               >
//                 <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><Cpu size={20} /></div>
//                 <div>
//                   <div className="text-xs text-gray-400">Processing</div>
//                   <div className="text-sm font-bold text-white">1.2M Nodes</div>
//                 </div>
//               </motion.div>

//               <motion.div 
//                 animate={{ y: [0, 10, 0] }}
//                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//                 className="absolute -left-8 bottom-20 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3"
//               >
//                 <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Zap size={20} /></div>
//                 <div>
//                   <div className="text-xs text-gray-400">Efficiency</div>
//                   <div className="text-sm font-bold text-white">99.8%</div>
//                 </div>
//               </motion.div> */}
//             </div>
//           </motion.div>
//         </motion.div>
        
//         {/* Scroll Indicator */}
//         <motion.div 
//           animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} 
//           transition={{ duration: 2, repeat: Infinity }}
//           className="absolute bottom-10"
//         >
//           <ChevronRight className="transform rotate-90 text-gray-500" />
//         </motion.div>
//       </div>

//       {/* --- FEATURES SECTION --- */}
//       <div className="relative z-10 py-32 container mx-auto px-4">
//         <motion.div 
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           className="text-center mb-24"
//         >
//           <h2 className="text-4xl md:text-6xl font-bold mb-6">Neural Capabilities</h2>
//           <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-600 mx-auto rounded-full" />
//         </motion.div>

//         <div className="space-y-32">
//           {/* Feature 1 */}
//           <FeatureRow 
//             img={brainImage}
//             icon={<Brain size={32} />}
//             title="Instant Knowledge Synthesis"
//             desc="AI-Powered Quiz Generation: Convert any paragraph into a quiz instantly.
//         Multi-Language Support Generate quizzes in multiple languages.
//         Turn any text, from academic notes to articles, into an interactive learning session."
//             align="left"
//             gradient="from-pink-500/20 to-purple-500/20"
//           />

//           {/* Feature 2 */}
//           <FeatureRow 
//             img={MultiplayerIcon}
//             icon={<Users size={32} />}
//             title="Synaptic Multiplayer"
//             desc="Compete in real-time quiz sessions.
//         Multiple participants per session for collaborative competition.
//         Randomized questions to keep each session unique."
//             align="right"
//             gradient="from-cyan-500/20 to-blue-500/20"
//           />

//           {/* Feature 3 */}
//           <FeatureRow 
//             img={QuizIcon}
//             icon={<Target size={32} />}
//             title="Placement Simulations"
//             desc="Simulate real exam conditions for effective practice.
//         Quizzes on CS Fundamentals.
//         Test your knowledge with our most asked questions."
//             align="left"
//             gradient="from-orange-500/20 to-red-500/20"
//           />
//         </div>
//       </div>

//       {/* --- TARGET AUDIENCE (Holographic Grid) --- */}
//       <div className="relative z-10 py-20 bg-black/50 backdrop-blur-sm border-t border-white/5">
//         <div className="container mx-auto px-4">
//           <motion.h2 
//             initial={{ opacity: 0 }} 
//             whileInView={{ opacity: 1 }}
//             className="text-center text-4xl md:text-6xl font-bold mb-20"
//           >
//             Optimized For
//           </motion.h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <AudienceCard 
//               img={ExamPng} 
//               title="Academia" 
//               role="Students & Educators"
//               desc=" IntelliQuiz automates quiz creation for teachers, students,

//                     and EdTech platforms, saving time, enhancing engagement, and

//                     ensuring personalized assessments for education, competitive

//                     exams, and adaptive learning.."
//             />
//             <AudienceCard 
//               img={EmpAssessment} 
//               title="Enterprise" 
//               role="HR & Training"
//               desc=" IntelliQuiz automates quiz creation for corporate training,

//                     saving time, enhancing engagement, and ensuring effective

//                     employee assessments.."
//             />
//             <AudienceCard 
//               img={SelfLearning} 
//               title="Autodidacts" 
//               role="Self Learners"
//               desc=" IntelliQuiz simplifies learning by generating quizzes from

//                     textbooks or content, helping users test knowledge, retain

//                     information, and master topics effectively through active

//                     recall."
//             />
//           </div>
//         </div>
//       </div>

//       {/* --- ABOUT SECTION --- */}
//       <div className="relative z-10 py-32 container mx-auto px-4">
//         <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-1 rounded-2xl">
//           <div className="bg-black rounded-xl p-8 md:p-16 border border-white/10 relative overflow-hidden group">
//             <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]" />
//             <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-700" />
            
//             <div className="relative z-10 text-center max-w-4xl mx-auto">
//               <h2 className="text-3xl md:text-5xl font-bold mb-8">The IntelliQuiz Mission</h2>
//               <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
//                 We believe intelligence is not just about retention, but application. By fusing generative AI with cognitive science principles, we are rebuilding the infrastructure of modern education. Join us in the cognitive revolution.
//               </p>
//             </div>
//           </div>
//         </div>
       
//       </div>
//      <Footer />
      
//     </div>
//   );
// };

// // --- SUB-COMPONENTS FOR CLEANLINESS ---

// const FeatureRow = ({ img, icon, title, desc, align, gradient }) => {
//   const isRight = align === "right";
  
//   return (
//     <div className={`flex flex-col ${isRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.8 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true, margin: "-100px" }}
//         transition={{ duration: 0.6 }}
//         className="w-full lg:w-1/2 relative"
//       >
//         <div className={`absolute inset-0 bg-gradient-to-r ${gradient} blur-3xl rounded-full opacity-60`} />
//         <TiltCard>
//            <img src={img} alt={title} className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl rounded-lg border border-white/10" />
//         </TiltCard>
//       </motion.div>

//       <motion.div 
//         initial={{ opacity: 0, x: isRight ? -50 : 50 }}
//         whileInView={{ opacity: 1, x: 0 }}
//         viewport={{ once: true, margin: "-100px" }}
//         className="w-full lg:w-1/2"
//       >
//         <div className="inline-block p-3 rounded-xl bg-white/5 border border-white/10 mb-6 text-cyan-400">
//           {icon}
//         </div>
//         <h3 className="text-3xl md:text-5xl font-bold mb-6 font-raleway">{title}</h3>
//         <p className="text-gray-400 text-lg leading-relaxed mb-6">{desc}</p>
//         <div className="h-[1px] w-full bg-gradient-to-r from-cyan-500/50 to-transparent" />
//       </motion.div>
//     </div>
//   );
// };

// const AudienceCard = ({ img, title, role, desc }) => {
//   return (
//     <TiltCard className="h-full">
//       <div className="h-full bg-neutral-900/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-cyan-500/50 transition-colors duration-300 group flex flex-col items-center text-center">
//         <div className="relative mb-8 group-hover:scale-110 transition-transform duration-300">
//           <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
//           <img src={img} alt={title} className="relative z-10 w-32 h-32 object-contain" />
//         </div>
//         <h3 className="text-2xl font-bold mb-2">{title}</h3>
//         <span className="text-cyan-400 text-sm font-mono mb-4 block uppercase tracking-widest">{role}</span>
//         <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
//       </div>
//     </TiltCard>
//   );
// };

// export default Home;

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
