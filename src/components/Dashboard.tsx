import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { PlusCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Transaction {
  id: string;
  date: string;
  cardName: string;
  type: 'purchase' | 'sale';
  amount: number;
}

const Dashboard = () => {
  const { currentUser } = useAuth()!;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    cardName: '',
    type: 'purchase',
    amount: 0,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (currentUser) {
        const q = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTransactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          fetchedTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(fetchedTransactions);
      }
    };
    fetchTransactions();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      try {
        await addDoc(collection(db, 'transactions'), {
          ...newTransaction,
          userId: currentUser.uid,
          timestamp: new Date(),
        });
        setNewTransaction({ date: '', cardName: '', type: 'purchase', amount: 0 });
        // Refresh transactions
        const q = query(collection(db, 'transactions'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const updatedTransactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          updatedTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(updatedTransactions);
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    }
  };

  const chartData = {
    labels: transactions.map((t) => t.date),
    datasets: [
      {
        label: 'Cumulative Profit/Loss',
        data: transactions.reduce((acc: number[], t, index) => {
          const prevValue = index > 0 ? acc[index - 1] : 0;
          const currentValue = t.type === 'sale' ? prevValue + t.amount : prevValue - t.amount;
          acc.push(currentValue);
          return acc;
        }, []),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cumulative Profit/Loss Over Time',
      },
    },
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Add Transaction</h3>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardName">
                Card Name
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={newTransaction.cardName}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              <PlusCircle className="mr-2" size={18} />
              Add Transaction
            </button>
          </form>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4">Profit/Loss Chart</h3>
          <div className="bg-white shadow-md rounded p-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Card Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {transaction.date}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {transaction.cardName}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {transaction.type}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;