// src/components/ExpenseSummary.js

import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios';

const ExpenseSummary = ({ expenses }) => {
  const [monthlyTotals, setMonthlyTotals] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Calculate total expenses per month
  useEffect(() => {
    const totals = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += expense.amount;
      return acc;
    }, {});

    // Convert the totals object to an array and sort by date descending
    const sortedTotals = Object.entries(totals)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(b.month) - new Date(a.month));

    setMonthlyTotals(sortedTotals);
  }, [expenses]);

  const handleOpenModal = async (month) => {
    setSelectedMonth(month);
    setModalOpen(true);
    setLoading(true);

    try {
      // Fetch expenses for the selected month
      const [monthName, year] = month.split(' ');
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); // 0-based index

      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === monthIndex &&
          expenseDate.getFullYear() === parseInt(year)
        );
      });

      setMonthlyExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMonth(null);
    setMonthlyExpenses([]);
  };

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        Total Expenses per Month
      </Typography>
      <List>
        {monthlyTotals.map(({ month, total }) => (
          <ListItem
            key={month}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleOpenModal(month)}>
                <InfoIcon />
              </IconButton>
            }
            button
            onClick={() => handleOpenModal(month)}
          >
            <ListItemText
              primary={month}
              secondary={`Total: ₹${total.toFixed(2)}`}
            />
          </ListItem>
        ))}
        {monthlyTotals.length === 0 && (
          <ListItem>
            <ListItemText primary="No expenses to display." />
          </ListItem>
        )}
      </List>

      {/* Modal for Detailed Expenses */}
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>{selectedMonth} - Detailed Expenses</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {monthlyExpenses.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount (₹)</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {monthlyExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{expense.category.name}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No expenses found for this month.</Typography>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default ExpenseSummary;
