
// // import React, { useState } from "react";
// // import { Link } from "react-router-dom";
// // import PsychologyIcon from "@mui/icons-material/Psychology";
// // import { CgProfile } from "react-icons/cg";
// // import { useFirebase } from "../../context/Firebase";

// // const Navbar = () => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const firebase = useFirebase();

// //   return (
// //     <div className="fixed  w-full bg-gray-900 shadow-lg shadow-slate-700 z-50 text-white">
// //       <div className="flex justify-between items-center h-28 px-8 lg:px-10">
// //         {/* Logo Section */}
// //         <div className="flex items-center">
// //           <PsychologyIcon sx={{ fontSize: 60 }} className="mr-2" />
// //           <h3 className="text-4xl lg:text-5xl font-bold">IntelliQuiz</h3>
// //         </div>

// //         {/* Desktop Menu */}
// //         <ul className="hidden lg:flex items-center gap-8 font-raleway">
// //           <li className="hover:text-sky-400  text-lg">
// //             <Link to="/">Home</Link>
// //           </li>
// //           <li className="hover:text-sky-400 text-lg">
// //             <Link to="/main">Enter</Link>
// //           </li>
// //           <li className="hover:text-sky-400  text-lg">
// //             <Link to="/contact">Contact Us</Link>
// //           </li>
          
// //           {firebase.isLoggedIn ? (
// //             <CgProfile className="w-8 h-8 cursor-pointer" />
// //           ) : (
// //             <li className="py-2 px-4 text-white bg-transparent border-2 border-white rounded-md ">
// //               <Link to="/signUp">Login / Register</Link>
// //             </li>
// //           )}
// //         </ul>

// //         {/* Hamburger Menu */}
// //         <button
// //           className="lg:hidden text-3xl"
// //           onClick={() => setIsMenuOpen(!isMenuOpen)}
// //         >
// //           ☰
// //         </button>
// //       </div>

// //       {/* Mobile Menu */}
// //       {isMenuOpen && (
// //         <ul className="flex flex-col items-center bg-gray-800 py-4 lg:hidden">
// //           <li className="hover:text-sky-400 font-semibold text-lg py-2">
// //             <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
// //           </li>
// //           <li className="hover:text-sky-400 font-semibold text-lg py-2">
// //             <Link to="/main" onClick={() => setIsMenuOpen(false)}>Enter</Link>
// //           </li>
          
// //           <li className="hover:text-sky-400 font-semibold text-lg py-2">
// //             <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
// //           </li>
// //           {firebase.isLoggedIn ? (
// //             <CgProfile className="w-8 h-8 cursor-pointer py-2" />
// //           ) : (
// //             <li className="py-2 px-4 text-white bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-black hover:font-semibold transition-all duration-300">
// //               <Link to="/signUp" onClick={() => setIsMenuOpen(false)}>
// //                 Login / Register
// //               </Link>
// //             </li>
// //           )}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default Navbar;
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import PsychologyIcon from "@mui/icons-material/Psychology";
// import { CgProfile } from "react-icons/cg";
// import { useFirebase } from "../../context/Firebase";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const firebase = useFirebase();

//   return (
//     <nav className="fixed w-full bg-gray-900 shadow-lg shadow-slate-700 z-50 text-white">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16 md:h-20">
//           {/* Logo Section */}
//           <div className="flex items-center">
//             <PsychologyIcon 
//               sx={{ fontSize: { xs: 40, md: 50 } }} 
//               className="mr-2 text-white"
//             />
//             <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
//               IntelliQuiz
//             </h3>
//           </div>

//           {/* Desktop Menu */}
//           <ul className="hidden lg:flex items-center gap-6 xl:gap-8 font-raleway">
//             <li className="hover:text-sky-400 transition-colors">
//               <Link to="/" className="px-3 py-2 text-lg">Home</Link>
//             </li>
//             <li className="hover:text-sky-400 transition-colors">
//               <Link to="/main" className="px-3 py-2 text-lg">Enter</Link>
//             </li>
//             <li className="hover:text-sky-400 transition-colors">
//               <Link to="/contact" className="px-3 py-2 text-lg">Contact Us</Link>
//             </li>
            
//             {firebase.isLoggedIn ? (
//               <li>
//                 <CgProfile className="w-8 h-8 cursor-pointer hover:text-sky-400 transition-colors" />
//               </li>
//             ) : (
//               <li className="ml-4">
//                 <Link 
//                   to="/signUp" 
//                   className="py-2 px-4 text-white bg-transparent border-2 border-white rounded-md 
//                             hover:bg-white hover:text-black transition-colors duration-300"
//                 >
//                   Login / Register
//                 </Link>
//               </li>
//             )}
//           </ul>

//           {/* Mobile Menu Button */}
//           <button
//             className="lg:hidden text-3xl focus:outline-none"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle menu"
//             aria-expanded={isMenuOpen}
//           >
//             {isMenuOpen ? "✕" : "☰"}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <div className={`lg:hidden ${isMenuOpen ? 'max-h-64' : 'max-h-0'} 
//                        overflow-hidden transition-all duration-300 ease-in-out bg-gray-800`}>
//         <ul className="flex flex-col items-center py-4 space-y-4">
//           <li>
//             <Link 
//               to="/" 
//               className="hover:text-sky-400 px-4 py-2 text-lg"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/main" 
//               className="hover:text-sky-400 px-4 py-2 text-lg"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Enter
//             </Link>
//           </li>
//           <li>
//             <Link 
//               to="/contact" 
//               className="hover:text-sky-400 px-4 py-2 text-lg"
//               onClick={() => setIsMenuOpen(false)}
//             >
//               Contact Us
//             </Link>
//           </li>
//           <li className="mt-2">
//             {firebase.isLoggedIn ? (
//               <CgProfile className="w-8 h-8 cursor-pointer hover:text-sky-400" />
//             ) : (
//               <Link
//                 to="/signUp"
//                 className="py-2 px-4 text-white bg-transparent border-2 border-white rounded-md
//                           hover:bg-white hover:text-black transition-colors duration-300"
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 Login / Register
//               </Link>
//             )}
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { CgProfile } from "react-icons/cg";
import { useFirebase } from "../../context/Firebase";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const firebase = useFirebase();

  return (
    <nav className="fixed w-full bg-gray-900 border-b border-b-gray-400 shadow-lg shadow-slate-700 z-50 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <PsychologyIcon 
              sx={{ fontSize: { xs: 35, sm: 40, md: 50 } }} 
              className="mr-1 sm:mr-2 text-white"
            />
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              IntelliQuiz
            </h3>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 font-raleway">
            <li className="hover:text-sky-400 transition-colors">
              <Link to="/" className="px-3 py-2 text-base lg:text-lg">Home</Link>
            </li>
            <li className="hover:text-sky-400 transition-colors">
              <Link to="/main" className="px-3 py-2 text-base lg:text-lg">Enter</Link>
            </li>
            <li className="hover:text-sky-400 transition-colors">
              <Link to="/contact" className="px-3 py-2 text-base lg:text-lg">Contact Us</Link>
            </li>
            <li className="hover:text-sky-400 transition-colors">
              <Link to="/dashboard" className="px-3 py-2 text-base lg:text-lg">Dashboard</Link>
            </li>
            
            {firebase.isLoggedIn ? (
              <li>
                <CgProfile className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer hover:text-sky-400 transition-colors" />
              </li>
            ) : (
              <li className="ml-4">
                <Link 
                  to="/signUp" 
                  className="py-1.5 px-4 sm:py-2 sm:px-5 text-sm sm:text-base border-2 border-white rounded-md 
                            hover:bg-white hover:text-black transition-colors duration-300"
                >
                  Login / Register
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl sm:text-3xl focus:outline-none p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isMenuOpen ? 'max-h-96' : 'max-h-0'} 
                       overflow-hidden transition-all duration-300 ease-in-out bg-gray-800 shadow-xl`}>
        <ul className="flex flex-col items-center py-4 space-y-3 sm:space-y-4">
          <li className="w-full text-center">
            <Link 
              to="/" 
              className="block hover:text-sky-400 px-4 py-3 sm:py-3.5 text-lg sm:text-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="w-full text-center">
            <Link 
              to="/main" 
              className="block hover:text-sky-400 px-4 py-3 sm:py-3.5 text-lg sm:text-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Enter
            </Link>
          </li>
          <li className="w-full text-center">
            <Link 
              to="/contact" 
              className="block hover:text-sky-400 px-4 py-3 sm:py-3.5 text-lg sm:text-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </li>
          <li className="w-full text-center mt-2 px-4">
            {firebase.isLoggedIn ? (
              <div className="flex justify-center">
                <CgProfile className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer hover:text-sky-400 p-1.5" />
              </div>
            ) : (
              <Link
                to="/signUp"
                className="inline-block py-2.5 px-6 sm:py-3 sm:px-8 text-sm sm:text-base border-2 border-white rounded-md
                          hover:bg-white hover:text-black transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;