import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';

const ExpenseForm = ({ onSuccess, expenseData }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');

  // Define static categories
  const categories = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Transport' },
    { id: 3, name: 'Entertainment' },
    { id: 4, name: 'Utilities' },
    { id: 5, name: 'Healthcare' },
    { id: 6, name: 'Other' },
  ];

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (inputDate) => {
    const dateObj = new Date(inputDate);
    return dateObj.toISOString().split('T')[0]; // Extracts YYYY-MM-DD format
  };

  // If Firestore Timestamp is used, convert it to a JavaScript Date
  const convertFirestoreTimestampToDate = (timestamp) => {
    return new Date(timestamp?.seconds * 1000);
  };

  useEffect(() => {
    if (expenseData) {
      setAmount(expenseData?.amount);
      setDescription(expenseData?.description || '');
      setCategoryId(expenseData?.category);

      // Handle different date formats (Firestore timestamp or standard date string)
      if (expenseData?.date?.seconds) {
        const formattedDate = formatDate(convertFirestoreTimestampToDate(expenseData?.date));
        setDate(formattedDate);
      } else {
        setDate(expenseData?.date?.slice(0, 10)); // for standard date strings
      }
    } else {
      clearFormData();
    }
  }, [expenseData]);

  const clearFormData = () => {
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const payload = {
      amount: parseFloat(amount),
      description,
      category: categoryId,
      date,
    };
    try {
      if (expenseData) {
        await axios?.put(`/api/expenses/${expenseData?.id}`, payload);
        onSuccess('Expense updated successfully!');
      } else {
        await axios?.post('/api/expenses', payload);
        onSuccess('Expense added successfully!');
      }
      clearFormData();
    } catch (error) {
      console?.error('Error saving expense:', error);
      onSuccess('Error saving expense!');
    }
  };

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        {expenseData ? 'Edit Expense' : 'Add New Expense'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e?.target?.value)}
              required
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e?.target?.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Category"
              select
              value={categoryId}
              onChange={(e) => setCategoryId(e?.target?.value)}
              required
              fullWidth
            >
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e?.target?.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {expenseData ? 'Update Expense' : 'Add Expense'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ExpenseForm;
