import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Sports Card Tracker</h1>
      <p className="text-xl mb-8">Track your sports card transactions and visualize your collection's performance.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <TrendingUp className="mx-auto mb-4" size={48} color="#4299e1" />
          <h2 className="text-2xl font-semibold mb-2">Track Transactions</h2>
          <p>Log your card purchases and sales with ease.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <BarChart2 className="mx-auto mb-4" size={48} color="#4299e1" />
          <h2 className="text-2xl font-semibold mb-2">Visualize Performance</h2>
          <p>See your collection's growth over time with interactive charts.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <DollarSign className="mx-auto mb-4" size={48} color="#4299e1" />
          <h2 className="text-2xl font-semibold mb-2">Analyze Profits</h2>
          <p>Understand your investment returns at a glance.</p>
        </div>
      </div>
      <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300">
        Get Started
      </Link>
    </div>
  );
};

export default Home;