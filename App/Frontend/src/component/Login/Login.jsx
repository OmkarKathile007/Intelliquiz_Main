

// // import React, { useState,useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useFirebase } from '../../context/Firebase';

// // const Login = () => {
// //   const firebase = useFirebase();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [isLogin, setIsLogin] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(()=>{
// //       if(firebase.isLoggedIn){
// //          navigate('/');
// //       }
// //   },[firebase,navigate])

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!isLogin) {
// //       // Handle Registration
// //       if (password !== confirmPassword) {
// //         alert('Passwords do not match!');
// //         return;
// //       }
// //       try {
// //         await firebase.signupUserWithEmailAndPassword(email, password);
// //         alert('Registration successful!');
// //         navigate('/main')
// //       } catch (error) {
// //         alert(`Invalid User`);
// //         alert("Error ",error);
// //       }
// //     } else {
// //       // Handle Login
// //       try {
// //         await firebase.signInWithEmailAndPass(email, password);
// //         alert('Login successful!');
// //         navigate('/main');
// //       } catch (error) {
// //         alert(`Invalid User`);
// //       }
// //     }
// //   };
// //   const handleGoogleSignIn = async () => {
// //     try {
// //       await firebase.signInWithGoogle();
// //       alert('Google Sign-In successful!');
// //       navigate('/');
// //     } catch (error) {
// //       alert(`Google Sign-In failed: ${error.message}`);
// //     }
// //   };

// //   const toggleForm = () => {
// //     setIsLogin(!isLogin);
// //     setEmail('');
// //     setPassword('');
// //     setConfirmPassword('');
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="w-full max-w-md p-6 bg-white rounded-md shadow-md">
// //         <h2 className="text-2xl font-bold text-center text-gray-700">
// //           {isLogin ? "Login" : "Register"}
// //         </h2>
// //         <form onSubmit={handleSubmit} className="mt-6">
// //           {/* Email Field */}
// //           <div className="mb-4">
// //             <label htmlFor="email" className="block text-sm font-medium text-gray-600">
// //               Email
// //             </label>
// //             <input
// //               type="email"
// //               id="email"
// //               onChange={(e) => setEmail(e.target.value)}
// //               value={email}
// //               className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               placeholder="Enter your email"
// //             />
// //           </div>

// //           {/* Password Field */}
// //           <div className="mb-4">
// //             <label htmlFor="password" className="block text-sm font-medium text-gray-600">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               id="password"
// //               onChange={(e) => setPassword(e.target.value)}
// //               value={password}
// //               className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               placeholder="Enter your password"
// //             />
// //           </div>

// //           {/* Confirm Password Field for Registration */}
// //           {!isLogin && (
// //             <div className="mb-4">
// //               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
// //                 Confirm Password
// //               </label>
// //               <input
// //                 type="password"
// //                 id="confirmPassword"
// //                 onChange={(e) => setConfirmPassword(e.target.value)}
// //                 value={confirmPassword}
// //                 className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                 placeholder="Confirm your password"
// //               />
// //             </div>
// //           )}

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //           >
// //             {isLogin ? "Login" : "Register"}
// //           </button>
// //         </form>
// //         <button
// //       // onClick={onClick}
// //       className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //        onClick={handleGoogleSignIn}   >
// //       <img
// //         src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
// //         alt="Google"
// //         className="w-5 h-5 mr-2"
// //       />
// //       Sign in with Google
// //     </button>

// //         {/* Toggle Form Button */}
// //         <p className="mt-4 text-sm text-center text-gray-600">
// //           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
// //           <button
// //             type="button"
// //             onClick={toggleForm}
// //             className="font-medium text-blue-600 hover:underline"
// //           >
// //             {isLogin ? "Register" : "Login"}
// //           </button>
         
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;


// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useFirebase } from '../../context/Firebase';

// // const Login = () => {
// //   const firebase = useFirebase();
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [isLogin, setIsLogin] = useState(false);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (firebase.isLoggedIn) {
// //       navigate('/');
// //     }
// //   }, [firebase, navigate]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!isLogin) {
// //       // Registration: Check for minimum password length
// //       if (password.length < 6) {
// //         alert('Password must be at least 6 characters long.');
// //         return;
// //       }

// //       if (password !== confirmPassword) {
// //         alert('Passwords do not match!');
// //         return;
// //       }
// //       try {
// //         await firebase.signupUserWithEmailAndPassword(email, password);
// //         alert('Registration successful!');
// //         navigate('/main');
// //       } catch (error) {
// //         alert('Registration failed. Please try again.');
// //         console.error("Error during registration:", error);
// //       }
// //     } else {
// //       // Login
// //       try {
// //         await firebase.signInWithEmailAndPass(email, password);
// //         alert('Login successful!');
// //         navigate('/main');
// //       } catch (error) {
// //         alert('Login failed. Please check your credentials.');
// //       }
// //     }
// //   };

// //   const handleGoogleSignIn = async () => {
// //     try {
// //       await firebase.signInWithGoogle();
// //       alert('Google Sign-In successful!');
// //       navigate('/');
// //     } catch (error) {
// //       alert(`Google Sign-In failed: ${error.message}`);
// //     }
// //   };

// //   const toggleForm = () => {
// //     setIsLogin(!isLogin);
// //     setEmail('');
// //     setPassword('');
// //     setConfirmPassword('');
// //   };

// //   return (
// //     <div className="flex items-center  justify-center min-h-screen bg-blue-950">
// //       <div className="w-full max-w-md p-6 border border-white bg-blue-950 rounded-md shadow-md">
// //         <h2 className="text-2xl font-bold text-center text-white">
// //           {isLogin ? "Login" : "Register"}
// //         </h2>
// //         <form onSubmit={handleSubmit} className="mt-6">
// //           {/* Email Field */}
// //           <div className="mb-4 text-white">
// //             <label htmlFor="email" className="block text-sm font-medium ">
// //               Email
// //             </label>
// //             <input
// //               type="email"
// //               id="email"
// //               onChange={(e) => setEmail(e.target.value)}
// //               value={email}
// //               className="w-full px-4 py-2 mt-2  bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               placeholder="Enter your email"
// //               required
// //             />
// //           </div>

// //           {/* Password Field */}
// //           <div className="mb-4">
// //             <label htmlFor="password" className="block text-sm font-medium ">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               id="password"
// //               onChange={(e) => setPassword(e.target.value)}
// //               value={password}
// //               className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// //               placeholder="Enter your password"
// //               minLength={6} // Enforces a minimum length on the input field
// //               required
// //             />
// //           </div>

// //           {/* Confirm Password Field for Registration */}
// //           {!isLogin && (
// //             <div className="mb-4">
// //               <label htmlFor="confirmPassword" className="block text-sm font-medium ">
// //                 Confirm Password
// //               </label>
// //               <input
// //                 type="password"
// //                 id="confirmPassword"
// //                 onChange={(e) => setConfirmPassword(e.target.value)}
// //                 value={confirmPassword}
// //                 className="w-full px-4 py-2 mt-2  bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// //                 placeholder="Confirm your password"
// //                 minLength={6} // Optional: Enforce the same minimum length
// //                 required
// //               />
// //             </div>
// //           )}

// //           {/* Submit Button */}
// //           <button
// //             type="submit"
// //             className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //           >
// //             {isLogin ? "Login" : "Register"}
// //           </button>
// //         </form>
// //         <button
// //           className="flex items-center justify-center w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-gray-300 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //           onClick={handleGoogleSignIn}
// //         >
// //           <img
// //             src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
// //             alt="Google"
// //             className="w-5 h-5 mr-2"
// //           />
// //           Sign in with Google
// //         </button>

// //         {/* Toggle Form Button */}
// //         <p className="mt-4 text-sm text-center text-gray-600">
// //           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
// //           <button
// //             type="button"
// //             onClick={toggleForm}
// //             className="font-medium text-blue-600 hover:underline"
// //           >
// //             {isLogin ? "Register" : "Login"}
// //           </button>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
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
//     <div className="flex  items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-950 to-gray-900">
//       <div className="w-full max-w-md border-2 border-green-200 p-8 space-y-6 rounded-xl bg-blue-900/30 backdrop-blur-sm border border-blue-600/30 shadow-2xl shadow-blue-900/50">
//         <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
//           {isLogin ? "Welcome Back" : "Create Account"}
//         </h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email Field */}
//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-sm font-medium text-blue-200">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               className="w-full px-4 py-3 bg-blue-900/40 border border-blue-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/50 text-blue-100 transition-colors"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="space-y-2">
//             <label htmlFor="password" className="block text-sm font-medium text-blue-200">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               className="w-full px-4 py-3 bg-blue-900/40 border border-blue-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/50 text-blue-100 transition-colors"
//               placeholder="Enter your password"
//               minLength={6}
//               required
//             />
//           </div>

//           {/* Confirm Password Field */}
//           {!isLogin && (
//             <div className="space-y-2">
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-200">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 value={confirmPassword}
//                 className="w-full px-4 py-3 bg-blue-900/40 border border-blue-600/50 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-blue-400/50 text-blue-100 transition-colors"
//                 placeholder="Confirm your password"
//                 minLength={6}
//                 required
//               />
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-cyan-400/20"
//           >
//             {isLogin ? "Login" : "Register"}
//           </button>
//         </form>

//         {/* Google Sign-In */}
//         {isLogin &&
//         <button
//           onClick={handleGoogleSignIn}
//           className="w-full flex items-center justify-center px-4 py-3 space-x-2 bg-blue-900/40 border border-blue-600/30 rounded-lg hover:bg-blue-900/60 text-blue-200 transition-colors"
//         >
//           <img
//             src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
//             alt="Google"
//             className="w-5 h-5"
//           />
//           <span>Sign in with Google</span>
//         </button>
// }

//         {/* Toggle Form */}
//         <p className="text-center text-blue-200/80">
//           {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//           <button
//             onClick={toggleForm}
//             className="font-medium text-cyan-400 hover:text-cyan-300 underline-offset-4 hover:underline transition-colors"
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
import { useFirebase } from "../../context/Firebase";

const FIREBASE_ERRORS = {
  "auth/user-not-found":        "No account found with this email.",
  "auth/wrong-password":        "Incorrect password.",
  "auth/email-already-in-use":  "This email is already registered.",
  "auth/invalid-email":         "Please enter a valid email address.",
  "auth/weak-password":         "Password must be at least 6 characters.",
  "auth/too-many-requests":     "Too many attempts. Please try again later.",
  "auth/popup-closed-by-user":  "Google sign-in was cancelled.",
  "auth/invalid-credential":    "Invalid email or password.",
};

const EyeIcon = ({ open }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3-9C6.477 3 2 12 2 12s4.477 9 10 9 10-9 10-9S17.523 3 12 3z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-9-10-9a17.9 17.9 0 013.875-4.825M6.5 6.5A9.77 9.77 0 0112 5c5.523 0 10 9 10 9a17.9 17.9 0 01-2.875 3.5M3 3l18 18" />
    )}
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const Login = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPw, setConfirmPw]     = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) navigate("/main", { replace: true });
  }, [firebase.isLoggedIn, navigate]);

  const friendlyError = (err) =>
    FIREBASE_ERRORS[err.code] || "Something went wrong. Please try again.";

  const resetForm = () => {
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPw("");
    setDisplayName("");
    setShowPw(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await firebase.signInWithGoogle();
      navigate("/main", { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!displayName.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirmPw) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await firebase.signupUserWithEmailAndPassword(email, password, displayName.trim());
      } else {
        await firebase.signInWithEmailAndPass(email, password);
      }
      navigate("/main", { replace: true });
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            IntelliQuiz
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your free account."}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Mode tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google button — primary CTA */}
          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? <Spinner /> : <GoogleIcon />}
            <span>{mode === "login" ? "Continue with Google" : "Sign up with Google"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display name (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {mode === "login" && (
                <button type="button" className="mt-1 text-xs text-cyan-400 hover:text-cyan-300 transition float-right">
                  Forgot password?
                </button>
              )}
            </div>

            {/* Confirm password (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading && <Spinner />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {mode === "signup" && (
            <p className="mt-4 text-center text-xs text-gray-500">
              By signing up you agree to our{" "}
              <span className="text-cyan-400 cursor-pointer hover:underline">Terms</span> and{" "}
              <span className="text-cyan-400 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
