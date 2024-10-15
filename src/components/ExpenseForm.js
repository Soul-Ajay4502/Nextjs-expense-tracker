// src/components/ExpenseForm.js

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

const ExpenseForm = ({ onSuccess, expenseData, categories }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (expenseData) {
      setAmount(expenseData.amount);
      setDescription(expenseData.description || '');
      setCategoryId(expenseData.categoryId);
      setDate(expenseData.date.slice(0, 10)); // format YYYY-MM-DD
    } else {
      setAmount('');
      setDescription('');
      setCategoryId('');
      setDate('');
    }
  }, [expenseData]);

  const clearFormData=()=>{
    setAmount('');
      setDescription('');
      setCategoryId('');
      setDate('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      amount: parseFloat(amount),
      description,
      categoryId: parseInt(categoryId),
      date,
    };
    try {
      if (expenseData) {
        await axios.put(`/api/expenses/${expenseData.id}`, payload);
        onSuccess('Expense updated successfully!');
      } else {
        await axios.post('/api/expenses', payload);
        onSuccess('Expense added successfully!');
      }
      clearFormData();
    } catch (error) {
      console.error('Error saving expense:', error);
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
              onChange={(e) => setAmount(e.target.value)}
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
              onChange={(e) => setDate(e.target.value)}
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
              onChange={(e) => setCategoryId(e.target.value)}
              required
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
