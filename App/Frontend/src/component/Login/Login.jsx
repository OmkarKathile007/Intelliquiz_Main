

// import React, { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useFirebase } from '../../context/Firebase';

// const Login = () => {
//   const firebase = useFirebase();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(false);
//   const navigate = useNavigate();

//   useEffect(()=>{
//       if(firebase.isLoggedIn){
//          navigate('/');
//       }
//   },[firebase,navigate])

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!isLogin) {
//       // Handle Registration
//       if (password !== confirmPassword) {
//         alert('Passwords do not match!');
//         return;
//       }
//       try {
//         await firebase.signupUserWithEmailAndPassword(email, password);
//         alert('Registration successful!');
//         navigate('/main')
//       } catch (error) {
//         alert(`Invalid User`);
//         alert("Error ",error);
//       }
//     } else {
//       // Handle Login
//       try {
//         await firebase.signInWithEmailAndPass(email, password);
//         alert('Login successful!');
//         navigate('/main');
//       } catch (error) {
//         alert(`Invalid User`);
//       }
//     }
//   };
//   const handleGoogleSignIn = async () => {
//     try {
//       await firebase.signInWithGoogle();
//       alert('Google Sign-In successful!');
//       navigate('/');
//     } catch (error) {
//       alert(`Google Sign-In failed: ${error.message}`);
//     }
//   };

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setEmail('');
//     setPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-700">
//           {isLogin ? "Login" : "Register"}
//         </h2>
//         <form onSubmit={handleSubmit} className="mt-6">
//           {/* Email Field */}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-600">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter your email"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-600">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Confirm Password Field for Registration */}
//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 value={confirmPassword}
//                 className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Confirm your password"
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>
//         <button
//       // onClick={onClick}
//       className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//        onClick={handleGoogleSignIn}   >
//       <img
//         src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
//         alt="Google"
//         className="w-5 h-5 mr-2"
//       />
//       Sign in with Google
//     </button>

//         {/* Toggle Form Button */}
//         <p className="mt-4 text-sm text-center text-gray-600">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             type="button"
//             onClick={toggleForm}
//             className="font-medium text-blue-600 hover:underline"
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>
         
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useFirebase } from '../../context/Firebase';

// const Login = () => {
//   const firebase = useFirebase();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLogin, setIsLogin] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (firebase.isLoggedIn) {
//       navigate('/');
//     }
//   }, [firebase, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!isLogin) {
//       // Registration: Check for minimum password length
//       if (password.length < 6) {
//         alert('Password must be at least 6 characters long.');
//         return;
//       }

//       if (password !== confirmPassword) {
//         alert('Passwords do not match!');
//         return;
//       }
//       try {
//         await firebase.signupUserWithEmailAndPassword(email, password);
//         alert('Registration successful!');
//         navigate('/main');
//       } catch (error) {
//         alert('Registration failed. Please try again.');
//         console.error("Error during registration:", error);
//       }
//     } else {
//       // Login
//       try {
//         await firebase.signInWithEmailAndPass(email, password);
//         alert('Login successful!');
//         navigate('/main');
//       } catch (error) {
//         alert('Login failed. Please check your credentials.');
//       }
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await firebase.signInWithGoogle();
//       alert('Google Sign-In successful!');
//       navigate('/');
//     } catch (error) {
//       alert(`Google Sign-In failed: ${error.message}`);
//     }
//   };

//   const toggleForm = () => {
//     setIsLogin(!isLogin);
//     setEmail('');
//     setPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <div className="flex items-center  justify-center min-h-screen bg-blue-950">
//       <div className="w-full max-w-md p-6 border border-white bg-blue-950 rounded-md shadow-md">
//         <h2 className="text-2xl font-bold text-center text-white">
//           {isLogin ? "Login" : "Register"}
//         </h2>
//         <form onSubmit={handleSubmit} className="mt-6">
//           {/* Email Field */}
//           <div className="mb-4 text-white">
//             <label htmlFor="email" className="block text-sm font-medium ">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               className="w-full px-4 py-2 mt-2  bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium ">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter your password"
//               minLength={6} // Enforces a minimum length on the input field
//               required
//             />
//           </div>

//           {/* Confirm Password Field for Registration */}
//           {!isLogin && (
//             <div className="mb-4">
//               <label htmlFor="confirmPassword" className="block text-sm font-medium ">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 value={confirmPassword}
//                 className="w-full px-4 py-2 mt-2  bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Confirm your password"
//                 minLength={6} // Optional: Enforce the same minimum length
//                 required
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           >
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>
//         <button
//           className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//           onClick={handleGoogleSignIn}
//         >
//           <img
//             src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
//             alt="Google"
//             className="w-5 h-5 mr-2"
//           />
//           Sign in with Google
//         </button>

//         {/* Toggle Form Button */}
//         <p className="mt-4 text-sm text-center text-gray-600">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             type="button"
//             onClick={toggleForm}
//             className="font-medium text-blue-600 hover:underline"
//           >
//             {isLogin ? "Register" : "Login"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from '../../context/Firebase';

const Login = () => {
  const firebase = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate('/');
    }
  }, [firebase, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      try {
        await firebase.signupUserWithEmailAndPassword(email, password);
        alert('Registration successful!');
        navigate('/main');
      } catch (error) {
        alert('Registration failed. Please try again.');
        console.error("Error during registration:", error);
      }
    } else {
      try {
        await firebase.signInWithEmailAndPass(email, password);
        alert('Login successful!');
        navigate('/main');
      } catch (error) {
        alert('Login failed. Please check your credentials.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await firebase.signInWithGoogle();
      alert('Google Sign-In successful!');
      navigate('/');
    } catch (error) {
      alert(`Google Sign-In failed: ${error.message}`);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-gray-900">
      <div className="w-full max-w-md border-2 border-green-200 p-8 space-y-6 rounded-xl bg-blue-900/30 backdrop-blur-sm border border-blue-600/30 shadow-2xl shadow-blue-900/50">
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-blue-200">
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full px-4 py-3 bg-blue-900/40 border border-blue-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/50 text-blue-100 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-blue-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-3 bg-blue-900/40 border border-blue-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/50 text-blue-100 transition-colors"
              placeholder="Enter your password"
              minLength={6}
              required
            />
          </div>

          {/* Confirm Password Field */}
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="w-full px-4 py-3 bg-blue-900/40 border border-blue-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/50 text-blue-100 transition-colors"
                placeholder="Confirm your password"
                minLength={6}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-cyan-400/20"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Google Sign-In */}
        {isLogin &&
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-3 space-x-2 bg-blue-900/40 border border-blue-600/30 rounded-lg hover:bg-blue-900/60 text-blue-200 transition-colors"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Sign in with Google</span>
        </button>
}

        {/* Toggle Form */}
        <p className="text-center text-blue-200/80">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="font-medium text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline transition-colors"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;