"use client"
import React, { useState } from 'react';

// Sample data for demonstration
const sampleUsers = [
  {
    id: 1,
    photoUrl: 'https://example.com/photo1.jpg',
    name: 'John Doe',
    points: 1200,
  },
  {
    id: 2,
    photoUrl: 'https://example.com/photo2.jpg',
    name: 'Raj',
    points: 1100,
  },
  {
    id: 3,
    photoUrl: 'https://example.com/photo2.jpg',
    name: 'Rithvik',
    points: 1700,
  },
 
  // Add more users as needed
];

const LeaderBoard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7 Days');
  const [users, setUsers] = useState(sampleUsers);

  const handleFilterChange = (period) => {
    setSelectedPeriod(period);
    // Fetch and update users based on the selected period
    // This is where you'd make an API call or filter the data
  };

  return (
    <div className="container mx-auto p-4 mt-28">
      <h1 className="text-3xl font-bold mb-4">Leader Board</h1>
      <div className="mb-6">
        <button
          onClick={() => handleFilterChange('7 Days')}
          className={`px-4 py-2 mr-2 rounded ${selectedPeriod === '7 Days' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          7 Days
        </button>
        <button
          onClick={() => handleFilterChange('30 Days')}
          className={`px-4 py-2 mr-2 rounded ${selectedPeriod === '30 Days' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          30 Days
        </button>
        <button
          onClick={() => handleFilterChange('All Time')}
          className={`px-4 py-2 rounded ${selectedPeriod === 'All Time' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Time
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="p-4 border border-gray-300 rounded-lg flex items-center">
            <img
              src={user.photoUrl}
              alt={user.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">Points: {user.points}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;