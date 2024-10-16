import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
  TableContainer,
  useMediaQuery,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

const ExpenseList = ({ expenses, onEdit, onDeleteSuccess }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Check for small screen sizes

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios?.delete(`/api/expenses/${id}`);
        onDeleteSuccess('Expense deleted successfully!');
      } catch (error) {
        console?.error('Error deleting expense:', error);
        onDeleteSuccess('Error deleting expense!');
      }
    }
  };

  // Function to convert Firestore date to a readable format
  const formatDate = (date) => {
    const milliseconds = date?.seconds * 1000; // Convert seconds to milliseconds
    return new Date(milliseconds)?.toLocaleDateString(); // Format date
  };

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        Expenses
      </Typography>
      <TableContainer style={{ maxWidth: '100%', overflowX: 'auto' }}>
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
            {expenses?.map((expense) => (
              <TableRow key={expense?.id}>
                <TableCell>{formatDate(expense?.date)}</TableCell>
                <TableCell>₹{expense?.amount?.toFixed(2)}</TableCell>
                <TableCell>{expense?.category}</TableCell>
                <TableCell>{expense?.description}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(expense)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense?.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {expenses?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ExpenseList;
