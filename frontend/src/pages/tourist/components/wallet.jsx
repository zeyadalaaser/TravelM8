import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from '@/hooks/currency-provider';

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, exchangeRate } = useCurrency();

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

        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:5001/api/tourists/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process orders to create transaction history
        const transactionHistory = ordersResponse.data.orders.reduce((acc, order) => {
          if (order.status === 'Cancelled' && order.paymentMethod === 'wallet') {
            // Cancelled order with wallet refund
            acc.push({
              id: order._id,
              type: 'Refund',
              amount: order.totalAmount,
              date: new Date(order.updatedAt).toISOString().split('T')[0],
              description: `Refund for cancelled order #${order._id.slice(-6)}`
            });
          } else if (order.status !== 'Cancelled' && order.paymentMethod === 'wallet') {
            // Successful wallet payment
            acc.push({
              id: order._id,
              type: 'Payment',
              amount: -order.totalAmount,
              date: new Date(order.createdAt).toISOString().split('T')[0],
              description: `Payment for order #${order._id.slice(-6)}`
            });
          }
          return acc;
        }, []);

        setTransactions(transactionHistory);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to load wallet data. Please try again.');
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wallet</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available funds</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{(walletBalance * exchangeRate).formatCurrency(currency)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Transactions</CardTitle>
          <CardDescription>Your wallet activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No wallet transactions found.</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{transaction.type}</span>
                  <span className={`font-bold ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount * exchangeRate).formatCurrency(currency)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                <p className="text-sm">{transaction.description}</p>
                <Separator className="mt-2" />
              </div>
            ))
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage;

