import React, { useEffect, useState } from "react";
import {
  query,
  where,
  getDocs,
  collection,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase";

type Fighter = {
  name: string;
  wins: string;
  losses: string;
  isChampion: boolean;
  wasChampion: boolean;
  country: string;
  skillLevel: "Good" | "Bad" | "Average";
};

const FighterDisplay = () => {
  const [goodFighters, setGoodFighters] = useState<Fighter[]>([]);
  const [averageFighters, setAverageFighters] = useState<Fighter[]>([]);
  const [badFighters, setBadFighters] = useState<Fighter[]>([]);

  useEffect(() => {
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

    fetchFighters();
  }, []);

  const renderFighters = (fighters: Fighter[]) =>
    fighters.map((fighter: Fighter, index: number) => (
      <div key={index} className="p-4 border-b text-black">
        <h3>Name: {fighter.name}</h3>
        <p>Country: {fighter.country}</p>
        <p>
          Wins: {fighter.wins} <span>Losses: {fighter.losses}</span>
        </p>
      </div>
    ));

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
    </div>
  );
};

export default FighterDisplay;

// import React, { useEffect } from "react";
// import { query, where, getDocs, collection } from "firebase/firestore";
// import { db } from "../../firebase";

// const Fighterdisplay = () => {
//   // Create a reference to the fighters collection
//   const fightersRef = collection(db, "fighters");

//   // Create a query against the collection.
//   const q = query(fightersRef, where("skillLevel", "==", "Good"));
//   useEffect(() => {
//     const getFighters = async() => {

//     }
//   }, []);

//   });
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="flex gap-[100px]">
//         <div className="bg-white h-[700px] w-[450px]"></div>
//         <div className="bg-white h-[700px] w-[450px]"></div>
//         <div className="bg-white h-[700px] w-[450px]"></div>
//       </div>
//     </div>
//   );
// };

// export default Fighterdisplay;
