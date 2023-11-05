import React, { useEffect, useState } from "react";
import {
  query,
  where,
  getDocs,
  collection,
  DocumentData,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import EditFighterModal from "../forms/EditFighterModal";

type Fighter = {
  name: string;
  wins: string;
  losses: string;
  isChampion: boolean;
  wasChampion: boolean;
  country: string;
  skillLevel: "Good" | "Bad" | "Average";
};
type CompleteFighter = {
  id: string;
  name: string;
  wins: string;
  losses: string;
  isChampion: boolean;
  wasChampion: boolean;
  country: string;
  skillLevel: "Good" | "Bad" | "Average";
};

const FighterDisplay = () => {
  const [goodFighters, setGoodFighters] = useState<CompleteFighter[]>([]);
  const [averageFighters, setAverageFighters] = useState<CompleteFighter[]>([]);
  const [badFighters, setBadFighters] = useState<CompleteFighter[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<CompleteFighter>({
    id: "",
    name: "",
    wins: "",
    losses: "",
    isChampion: false,
    wasChampion: false,
    country: "",
    skillLevel: "Average",
  });

  const fetchFighters = async () => {
    const goodQuery = query(
      collection(db, "fighters"),
      where("skillLevel", "==", "Good")
    );
    const averageQuery = query(
      collection(db, "fighters"),
      where("skillLevel", "==", "Average")
    );
    const badQuery = query(
      collection(db, "fighters"),
      where("skillLevel", "==", "Bad")
    );

    const [goodSnapshot, averageSnapshot, badSnapshot] = await Promise.all([
      getDocs(goodQuery),
      getDocs(averageQuery),
      getDocs(badQuery),
    ]);

    setGoodFighters(
      goodSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Fighter),
      }))
    );
    setAverageFighters(
      averageSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Fighter),
      }))
    );
    setBadFighters(
      badSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Fighter),
      }))
    );
  };

  useEffect(() => {
    fetchFighters();
  }, []);

  const renderFighters = (fighters: CompleteFighter[]) =>
    fighters.map((fighter: CompleteFighter, index: number) => (
      <div key={index} className="p-4 border-b text-black">
        <h3>Name: {fighter.name}</h3>
        <p>Country: {fighter.country}</p>
        <p>
          Wins: {fighter.wins} <span>Losses: {fighter.losses}</span>
        </p>
        <p>{fighter.id}</p>
        <button className="pr-1" onClick={() => deleteFighter(fighter.id)}>
          Delete Fighter
        </button>
        <button
          onClick={() => {
            setFormData({ ...fighter });
            setShowModal(true);
          }}
        >
          Edit
        </button>
      </div>
    ));

  const deleteFighter = async (fighterId: string) => {
    const fighterRef = doc(db, "fighters", fighterId);
    await deleteDoc(fighterRef);
    // After deleting, you'll want to remove the fighter from your state
    setGoodFighters(goodFighters.filter((fighter) => fighter.id !== fighterId));
    fetchFighters();
    // Do the same for the other categories if necessary
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-[100px]">
        <div className="bg-white h-[700px] w-[450px] overflow-auto">
          {renderFighters(goodFighters)}
        </div>
        <div className="bg-white h-[700px] w-[450px] overflow-auto">
          {renderFighters(averageFighters)}
        </div>
        <div className="bg-white h-[700px] w-[450px] overflow-auto">
          {renderFighters(badFighters)}
        </div>
      </div>
      {showModal && (
        <EditFighterModal
          {...formData}
          fetchFighters={fetchFighters}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default FighterDisplay;
