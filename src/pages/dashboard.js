// src/pages/dashboard.js

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryForm from '../components/CategoryForm';
import ExpenseSummary from '../components/ExpenseSummary';
import {
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  // State to hold categories and expenses data
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Loading states
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Fetch categories when Categories tab is active
  useEffect(() => {
    if (activeTab === 0) {
      fetchCategories();
    }
  }, [activeTab]);

  // Fetch expenses when Expenses or Summary tab is active
  useEffect(() => {
    if (activeTab === 2 || activeTab === 3) {
      fetchExpenses();
    }
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSuccess = (message = 'Operation successful!') => {
    setSnackbarMsg(message);
    setOpenSnackbar(true);
    setEditingExpense(null);
    // Refresh data if necessary
    if (activeTab === 0) {
      fetchCategories();
    }
    if (activeTab === 1 || activeTab === 2 || activeTab === 3) {
      fetchExpenses();
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveTab(1); // Switch to Add/Edit Expense tab for editing
  };

  const handleDeleteSuccess = (message) => {
    setSnackbarMsg(message);
    setOpenSnackbar(true);
    if (activeTab === 2 || activeTab === 3) {
      fetchExpenses();
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbarMsg('Error fetching categories');
      setOpenSnackbar(true);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const res = await fetch('/api/expenses');
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setSnackbarMsg('Error fetching expenses');
      setOpenSnackbar(true);
    } finally {
      setLoadingExpenses(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Dashboard Tabs"
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{ marginBottom: '0.5rem',background:'white',borderTopLeftRadius:'10px',borderTopRightRadius:'10px' }}
        >
          <Tab label="Categories" />
          <Tab label={editingExpense ? 'Edit Expense' : 'Add Expense'} />
          <Tab label="Expenses" />
          <Tab label="Summary" />
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          {loadingCategories ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <CategoryForm onSuccess={handleSuccess} />
          )}
          {/* Optionally, display a list of categories here */}
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {categories.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              Please add a category before adding expenses.
            </Typography>
          ) : (
            <ExpenseForm
              onSuccess={handleSuccess}
              expenseData={editingExpense}
              categories={categories}
            />
          )}
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          {loadingExpenses ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          {loadingExpenses ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : (
            <ExpenseSummary expenses={expenses} />
          )}
        </TabPanel>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={
            snackbarMsg.toLowerCase().includes('error') ? 'error' : 'success'
          }
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

// TabPanel Component to handle tab content rendering
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default Dashboard;
