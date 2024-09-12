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
    <div className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="relative">
        <span className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-sm font-semibold">LIMITED TIME OFFER</span>
        <img className="w-full h-48 object-cover" src={imgSrc} alt={title} />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-600">{points} points</p>
        <a href={link} className="text-blue-500 hover:underline">REDEEM REWARD</a>
      </div>
    </div>
  );
};

const RewardsPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Get rewarded for doing what you love to do.</h1>
      <p className="text-gray-600 mb-6">Just search, shop, or play with Microsoft to start earning points. Redeem your points for gift cards, sweepstakes entries, nonprofit donations, and more.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rewardsData.map((reward, index) => (
          <RewardCard key={index} {...reward} />
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;