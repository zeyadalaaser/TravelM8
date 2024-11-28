// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";

// const WalletPage = () => {
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchWalletData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
        
//         // Fetch wallet balance
//         const balanceResponse = await axios.get('http://localhost:5001/api/user/wallet-balance', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setWalletBalance(balanceResponse.data.balance);

//         // Fetch recent transactions
//         const transactionsResponse = await axios.get('http://localhost:5001/api/user/wallet-transactions', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setTransactions(transactionsResponse.data.transactions);

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching wallet data:', err);
//         setError('Failed to load wallet data. Please try again.');
//         setLoading(false);
//       }
//     };

//     fetchWalletData();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">My Wallet</h1>
      
//       {/* Wallet Balance Card */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Current Balance</CardTitle>
//           <CardDescription>Your available funds</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-4xl font-bold">${walletBalance.toFixed(2)}</p>
//         </CardContent>
//       </Card>

//       {/* Recent Transactions Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Transactions</CardTitle>
//           <CardDescription>Your wallet activity</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {transactions.length === 0 ? (
//             <p>No recent transactions.</p>
//           ) : (
//             transactions.map((transaction) => (
//               <div key={transaction._id} className="mb-4">
//                 <div className="flex justify-between items-center">
//                   <span className="font-medium">{transaction.type}</span>
//                   <span className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
//                     {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
//                 <p className="text-sm">{transaction.description}</p>
//                 <Separator className="mt-2" />
//               </div>
//             ))
//           )}
//           <Button className="w-full mt-4">View All Transactions</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default WalletPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch wallet balance
        const balanceResponse = await axios.get('http://localhost:5001/api/user/wallet-balance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWalletBalance(balanceResponse.data.balance);

        // Fetch recent transactions (mock data for now)
        // TODO: Replace with actual API call when endpoint is available
        setTransactions([
          { id: 1, type: 'Payment', amount: -50, date: '2023-05-15' },
          { id: 2, type: 'Deposit', amount: 100, date: '2023-05-10' },
          { id: 3, type: 'Payment', amount: -30, date: '2023-05-05' },
        ]);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data. Please try again.');
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>
      
      {/* Wallet Balance Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available funds</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">${walletBalance.toFixed(2)}</p>
        </CardContent>
      </Card>

      {/* Recent Transactions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{transaction.type}</span>
                <span className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-500">{transaction.date}</p>
              <Separator className="mt-2" />
            </div>
          ))}
          <Button className="w-full mt-4">View All Transactions</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;