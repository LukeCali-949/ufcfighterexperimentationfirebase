"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { useSnackbar, SnackbarProvider } from "notistack";
import { db } from "../../firebase";

type FormData = {
  name: string;
  wins: string;
  losses: string;
  isChampion: boolean;
  wasChampion: boolean;
  country: string;
  skillLevel: "Good" | "Bad" | "Average";
};

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    wins: "",
    losses: "",
    isChampion: false,
    wasChampion: false,
    country: "",
    skillLevel: "Average",
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const name = target.name;
    let finalValue: string | number | boolean;

    if (target.type === "checkbox") {
      finalValue = (target as HTMLInputElement).checked;
    } else if (target.type === "number") {
      finalValue = target.value !== "" ? parseInt(target.value, 10) : 0;
    } else {
      finalValue = target.value;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: finalValue,
    }));
  };
  async function addFighter(fighterData: FormData) {
    try {
      const docRef = await addDoc(collection(db, "fighters"), fighterData);
      enqueueSnackbar(`Document written with ID: ${docRef.id}`, {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(`Error`, { variant: "error" });
      console.error("Error adding document: ", e);
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form data submitted:", formData);
    addFighter(formData);
    setFormData({
      name: "",
      wins: "",
      losses: "",
      isChampion: false,
      wasChampion: false,
      country: "",
      skillLevel: "Average",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mx-[25%] gap-5 bg-gray-800 p-8 rounded-lg my-[5%]"
    >
      <input
        className="rounded-md"
        type="text"
        name="name"
        placeholder="Fighter Name"
        value={formData.name}
        onChange={handleInputChange}
      />
      <input
        className="rounded-md"
        type="text"
        name="country"
        placeholder="Fighter Country"
        value={formData.country}
        onChange={handleInputChange}
      />
      <input
        className="rounded-md"
        type="text"
        name="wins"
        placeholder="Fighter Wins"
        value={formData.wins}
        onChange={handleInputChange}
      />
      <input
        className="rounded-md"
        type="text"
        name="losses"
        placeholder="Fighter Losses"
        value={formData.losses}
        onChange={handleInputChange}
      />
      <label>
        Is fighter a current champion?
        <input
          type="checkbox"
          name="isChampion"
          checked={formData.isChampion}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Was the fighter a champion?
        <input
          type="checkbox"
          name="wasChampion"
          checked={formData.wasChampion}
          onChange={handleInputChange}
        />
      </label>
      <select
        name="skillLevel"
        value={formData.skillLevel}
        onChange={handleInputChange}
        className="bg-green-400 rounded-md"
      >
        <option value="Good">Good</option>
        <option value="Average">Average</option>
        <option value="Bad">Bad</option>
      </select>
      <button type="submit" className="bg-black">
        Submit
      </button>
    </form>
  );
}

//className="flex flex-col mx-[25%] gap-5"
