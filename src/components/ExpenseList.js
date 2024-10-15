// src/components/ExpenseList.js

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Paper,
    Typography,
  } from '@mui/material';
  import { Edit, Delete } from '@mui/icons-material';
  import axios from 'axios';
  
  const ExpenseList = ({ expenses, onEdit, onDeleteSuccess }) => {
    const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this expense?')) {
        try {
          await axios.delete(`/api/expenses/${id}`);
          onDeleteSuccess('Expense deleted successfully!');
        } catch (error) {
          console.error('Error deleting expense:', error);
          onDeleteSuccess('Error deleting expense!');
        }
      }
    };
  
    return (
      <Paper style={{ padding: '1rem' }}>
        <Typography variant="h6" gutterBottom>
          Expenses
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.category.name}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(expense)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  };
  
  export default ExpenseList;
  