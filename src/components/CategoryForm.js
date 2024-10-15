import { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const CategoryForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory.id}`, { name });
        onSuccess('Category updated successfully!');
      } else {
        await axios.post('/api/categories', { name });
        onSuccess('Category added successfully!');
      }
      setEditingCategory(null);
      fetchCategories(); 
    } catch (error) {
      console.error('Error saving category:', error);
      onSuccess('Error saving category!');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  return (
    <Paper style={{ padding: '1rem' }}>
      <Typography variant="h6" gutterBottom>
        {editingCategory ? 'Edit Category' : 'Add New Category'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {editingCategory ? 'Update Category' : 'Add Category'}
        </Button>
      </form>

      <Typography variant="h6" style={{ marginTop: '1rem' }}>
        Category List
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemText primary={category.name} />
            <IconButton edge="end" onClick={() => handleEdit(category)}>
              <EditIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CategoryForm;
