"use client";

import { SnackbarProvider } from "notistack";
import { useState } from "react";

import Fighterform from "./components/forms/Fighterform";
import Fighterdisplay from "./components/DataDisplay/Fighterdisplay";
import SignUp from "./components/Auth/SignUp";

export default function Home() {
  const [display, setDisplay] = useState<boolean>(false);

  const changeDisplay = () => {
    setDisplay(!display);
  };

  return (
    <div>
      <button
        onClick={changeDisplay}
        className="absolute top-0 left-0 bg-white text-blue-400"
      >
        Switch
      </button>
      <SignUp />
      <SnackbarProvider>
        {display ? <Fighterdisplay /> : <Fighterform />}
      </SnackbarProvider>
    </div>
  );
}

//className="flex flex-col mx-[25%] gap-5"
