"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // Import from Framer Motion
import { ArrowBigRightDash } from "lucide-react";

const sampleUsers = [
  {
    id: 1,
    photoUrl:
      "/v.png",
    name: "Vrathik",
    points: 1200,
  },
  {
    id: 2,
    photoUrl:
      "/a.png",
    name: "Abigna ",
    points: 1100,
  },
  {
    id: 3,
    photoUrl:
      "/r.jpg",
    name: "Rithvik",
    points: 1000,
  },
 
];

const LeaderBoard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7 Days");
  const [users, setUsers] = useState(sampleUsers);

  const handleFilterChange = (period) => {
    setSelectedPeriod(period);
    
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
  };

  const linkVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
  };


  const MedalBadge = ({ rank }) => {
    let medalIcon;
    if (rank === 1) {
      medalIcon = "🥇"; // Gold medal emoji
    } else if (rank === 2) {
      medalIcon = "🥈"; // Silver medal emoji
    } else if (rank === 3) {
      medalIcon = "🥉"; // Bronze medal emoji
    }
    return <span className="text-2xl">{medalIcon}</span>;
  };

  return (
    <div className="container mx-auto p-6 mt-28 bg-gray-100 min-h-screen">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-8 text-center text-blue-600"
      >
        Leader Board
      </motion.h1>
      <div className="mb-10 flex justify-center">
        {["7 Days", "30 Days", "All Time"].map((period) => (
          <motion.button
            key={period}
            onClick={() => handleFilterChange(period)}
            variants={buttonVariants}
            whileHover="hover"
            className={`px-5 py-2 mr-3 rounded-lg shadow ${
              selectedPeriod === period
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {period}
          </motion.button>
        ))}
      </div>

      {/* Reward Link */}
      <Link href="/reward">
        <motion.div
          className="flex flex-col items-center justify-center cursor-pointer mb-10"
          variants={linkVariants}
          whileHover="hover"
        >
          <span className="text-xl font-semibold mb-2 text-blue-600">Reward</span>
          <ArrowBigRightDash className="text-blue-500 hover:text-blue-700 w-10 h-10" />
        </motion.div>
      </Link>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user, index) => {
          let cardBgColor;
          if (index === 0) cardBgColor = "bg-yellow-300"; // Gold for 1st
          else if (index === 1) cardBgColor = "bg-gray-300"; // Silver for 2nd
          else if (index === 2) cardBgColor = "bg-yellow-800"; // Bronze for 3rd
          else cardBgColor = "bg-white"; // Default background for others

          return (
            <motion.div
              key={user.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`p-6 border border-gray-300 rounded-lg flex items-center ${cardBgColor} shadow-md`}
            >
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold flex items-center">
                  {user.name} {index < 3 && <MedalBadge rank={index + 1} />}
                </h2>
                <p className="text-gray-700">Points: {user.points}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderBoard;