"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const actionCodeSettings = {
    // The URL to redirect to after email verification.
    url: "http://localhost:3000", // Make sure to use http for localhost
    handleCodeInApp: true, // Must be true for email link sign-in to work
    // Your other settings...
    // iOS and Android settings are not needed for web development.
    // dynamicLinkDomain is used for Firebase Dynamic Links,
    // but it's not required if you're not using Dynamic Links.
  };

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const passwordlessSignIn = async (email) => {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    // Check if the URL contains a sign-in link and try to sign the user in.
    const completeSignInWithEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email) {
          // If the email is not stored, prompt the user for it.
          // This can happen if the link is opened in a different browser or device.
          email = window.prompt("Please provide your email for confirmation");
        }
        try {
          // Complete the sign-in process.
          const result = await signInWithEmailLink(
            auth,
            email,
            window.location.href
          );
          // Clear the email from localStorage.
          window.localStorage.removeItem("emailForSignIn");
          // Update the state with the signed-in user.
          setUser(result.user);
          // Optionally, redirect the user to a different page.
        } catch (error) {
          // Handle any errors that occur during sign-in here.
          console.error("Error signing in with email link", error);
        }
      }
    };

    completeSignInWithEmailLink();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, googleSignIn, logOut, passwordlessSignIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
