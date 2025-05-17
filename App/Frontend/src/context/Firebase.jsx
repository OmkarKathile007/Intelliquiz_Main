import { createContext, useContext,useState,useEffect } from "react";
import { initializeApp } from "firebase/app";
import { 
    getAuth,createUserWithEmailAndPassword,
    signInWithEmailAndPassword ,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from "firebase/auth";

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyDd97uWkQi-DX6vxUj7_Wlcn1duusY5GJE",
    authDomain: "authentication-825f6.firebaseapp.com",
    projectId: "authentication-825f6",
    storageBucket: "authentication-825f6.firebasestorage.app",
    messagingSenderId: "721169518533",
    appId: "1:721169518533:web:81438ec1612ff0b6a705ac",
    measurementId: "G-YL6TXE38EQ"
  };


export const useFirebase=()=>useContext(FirebaseContext);
export const firebaseapp=initializeApp(firebaseConfig)
const firebaseAuth=getAuth(firebaseapp);

const GoogleProvider=new GoogleAuthProvider();

export const FirebaseProvider=(props)=>{

    const[user,setUser]=useState(null);

    useEffect(()=>{
        onAuthStateChanged(firebaseAuth,(user)=>{   
            if(user)setUser(user);
            else setUser(null);
        })
        console.log(firebaseAuth);
    },[])

    const signupUserWithEmailAndPassword=(email,password)=>{
        return createUserWithEmailAndPassword(firebaseAuth,email,password);
    }
    const signInWithEmailAndPass=(email,password)=>{
        return signInWithEmailAndPassword(firebaseAuth,email,password);
    }
    const signInWithGoogle=()=>{
        return signInWithPopup(firebaseAuth,GoogleProvider);
    }

    const isLoggedIn=user?true:false;


    return <FirebaseContext.Provider value={{signupUserWithEmailAndPassword,signInWithEmailAndPass,signInWithGoogle,isLoggedIn}}>
        {props.children}
        </FirebaseContext.Provider>
}

export default firebaseAuth;