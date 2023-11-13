import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { UserAuth } from "@/app/context/AuthContext";
import { useSnackbar, SnackbarProvider } from "notistack";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { user, googleSignIn, logOut, passwordlessSignIn } = UserAuth();

  const { enqueueSnackbar } = useSnackbar();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await passwordlessSignIn(email);
      enqueueSnackbar("Email Sent!", {
        variant: "success",
      });
      // const userCredential = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );
      // // Signed in
      // const createdUser = userCredential.user;
      // // You can save the user details to the state or context or perform other actions
      // console.log("User created:", createdUser);
      // // Reset form or redirect user
      // setEmail("");
      // setPassword("");
      // setError(null);
    } catch (error) {
      // Handle errors here, including displaying user-friendly messages
      setError("Failed to create an account. " + error.message);
    }
  };

  return (
    <div>
      <h1>whatever</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div>
          <h1 onClick={() => logOut()}>Sign Out</h1>
          <h1>DISPLAY NAME: {user.displayName}</h1>
          <h1>EMAIL: {user.email}</h1>
          <h1>IS THE EMAIL VERIFIED: {user.emailVerified}</h1>
          <img src={user.photoURL}></img>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSignUp}>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit">Sign Up</button>
          </form>

          <button type="button" onClick={() => googleSignIn()}>
            SIGN IN WITH GOOGLE
          </button>
        </div>
      )}
    </div>
  );
};

export default SignUp;
