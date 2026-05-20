// import React from 'react'
// // import React from 'react';
// // import { FaFacebook } from "react-icons/fa"
// import { FaFacebook } from "../../../node_modules/react-icons/fa";
// import {  FaLinkedin } from "../../../node_modules/react-icons/fa6";
// import {  FaInstagram } from "../../../node_modules/react-icons/fa";
// import { FaSquareXTwitter } from "../../../node_modules/react-icons/fa6";

// const Footer = () => {
//   return (
//     <div className='bg-black w-full py-8 border-t-2 border-white text-white'>
//       <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
//         <div className='mb-4 md:mb-0'>
//           <h2 className='text-2xl font-bold ml-12 mt-3'>IntelliQuiz</h2>
//           <p className='text-sm  ml-12 ' >Elevate your learning with AI-driven quizzes.</p>
//         </div>
//         <div className='flex flex-col md:flex-row gap-4 ml-96'>
//           <a href='#' className='text-sm hover:underline'>Home</a>
//           <a href='#' className='text-sm hover:underline'>Features</a>
//           <a href='#' className='text-sm hover:underline'>About Us</a>
//           <a href='#' className='text-sm hover:underline'>Contact</a>
//         </div>
//         <div className='flex gap-2 mr-8'>
//           <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-blue-500'>
//           <FaFacebook />
//           </a>
//           <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-blue-400'>
//           <FaSquareXTwitter />
//           </a>
//           <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-pink-500'>
//           <FaInstagram />
//           </a>
//           <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-blue-700'>
//           <FaLinkedin />
//           </a>
//         </div>
//       </div>
//       <div className='text-center mt-4'>
//         <p className='text-xs'>&copy; 2025 IntelliQuiz. All rights reserved.</p>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import React from 'react';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLinkedin, FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='bg-black w-full py-8 border-t border-white/10 text-white'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
          {/* Brand Section */}
          <div className='text-center md:text-left'>
            <h2 className='text-xl sm:text-2xl font-bold mb-2'>IntelliQuiz</h2>
            <p className='text-xs sm:text-sm text-gray-400'>
              Elevate your learning with AI-driven quizzes.
            </p>
          </div>

          {/* Links Section */}
          <div className='flex flex-col sm:flex-row gap-4 sm:gap-6 text-center'>
            <a href='#' className='text-xs sm:text-sm hover:underline hover:text-blue-400 transition-colors'>
              Home
            </a>
            <a href='#' className='text-xs sm:text-sm hover:underline hover:text-blue-400 transition-colors'>
              Features
            </a>
            <a href='#' className='text-xs sm:text-sm hover:underline hover:text-blue-400 transition-colors'>
              About Us
            </a>
            <a href='#' className='text-xs sm:text-sm hover:underline hover:text-blue-400 transition-colors'>
              Contact
            </a>
          </div>

          {/* Social Icons */}
          <div className='flex gap-4 sm:gap-6'>
            <a href='https://facebook.com' target='_blank' rel='noopener noreferrer' 
               className='text-white hover:text-blue-500 transition-colors text-lg sm:text-xl'>
              <FaFacebook />
            </a>
            <a href='https://twitter.com' target='_blank' rel='noopener noreferrer' 
               className='text-white hover:text-blue-400 transition-colors text-lg sm:text-xl'>
              <FaSquareXTwitter />
            </a>
            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' 
               className='text-white hover:text-pink-500 transition-colors text-lg sm:text-xl'>
              <FaInstagram />
            </a>
            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' 
               className='text-white hover:text-blue-700 transition-colors text-lg sm:text-xl'>
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className='text-center mt-8 sm:mt-12'>
          <p className='text-xs sm:text-sm text-gray-400'>
            &copy; 2025 IntelliQuiz. All rights reserved.
          </p>
          <p className='mt-2 text-xs text-gray-500'>
            Made with ❤️ by Omkar
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
