"use client";

import React from 'react';

const rewardsData = [
  {
    title: "Lavish Resturent Card ",
    points: 4220,
    link: "#",
    imgSrc: "/lavish.png", // Update with your actual image path
  },
  {
    title: "Coffee Cupon Card",
    points: 845,
    link: "#",
    imgSrc: "/cafe.png", // Update with your actual image path
  },
  {
    title: "Flipkart Gift Card",
    points: 1500,
    link: "#",
    imgSrc: "/fk.png", // Update with your actual image path
  },
  {
    title: "Amazon Gift Card",
    points: 1600,
    link: "#",
    imgSrc: "/az.png", // Update with your actual image path
  },
];

const RewardCard = ({ title, points, link, imgSrc }) => {
    return (
      <div className="max-w-xs w-full">
        <div
          className={`group w-full cursor-pointer overflow-hidden relative h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800
            bg-[url(${imgSrc})] bg-cover
            before:bg-[url('/path/to/gif.gif')] before:fixed before:inset-0 before:opacity-0 before:z-[-1]
            hover:bg-[url('/path/to/gif.gif')]
            hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50
            transition-all duration-500`}
        >
          <div className="text relative z-50">
            <h3 className="font-bold text-xl md:text-2xl text-white">{title}</h3>
            <p className="font-normal text-sm md:text-base text-white mt-2 mb-4">
              {points} points
            </p>
            <a
              href={link}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              REDEEM REWARD
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  // Main Rewards page component
  const RewardsPage = () => {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Get rewarded for doing what you love.
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Search, shop, or play with Microsoft to start earning points. Redeem your points for gift cards, sweepstakes entries, nonprofit donations, and more.
        </p>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {rewardsData.map((reward, index) => (
            <RewardCard key={index} {...reward} />
          ))}
        </div>
      </div>
    );
  };
  
  export default RewardsPage;
  