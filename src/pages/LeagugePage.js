import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import TableLoading from '../components/table-loading/tableLoading';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const TABLE_HEAD = [
    { id: 'profile.image.file', label: 'Image', alignRight: false },
    { id: 'profile.fullName', label: 'Name', alignRight: false },
    { id: 'isCompleteProfile', label: 'Role', alignRight: false },
  ];

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setCategories([
        { id: 1, categoryName: 'Leaguge 1' },
        { id: 2, categoryName: 'Leaguge 2' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setNewCategoryName(category.categoryName);
    setEditModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setCurrentCategory(category);
    setDeleteModalOpen(true);
  };

  const handleSaveCategoryChanges = () => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => (cat.id === currentCategory.id ? { ...cat, categoryName: newCategoryName } : cat))
    );
    setEditModalOpen(false);
    setSnackbarMessage('Category updated successfully!');
    setSnackbarOpen(true);
  };

  const handleConfirmDelete = () => {
    setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== currentCategory.id));
    setDeleteModalOpen(false);
    setSnackbarMessage('Category deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      setCategories((prevCategories) => [
        ...prevCategories,
        { id: prevCategories.length + 1, categoryName: newCategoryName },
      ]);
      setNewCategoryName('');
      setEditModalOpen(false);
      setSnackbarMessage('Category added successfully!');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Leaguges List
      </Typography>
      <Button
        style={{ backgroundColor: '#f87203' }}
        onClick={() => {
          setNewCategoryName('');
          setCurrentCategory(null);
          setEditModalOpen(true);
        }}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add New Leaguge
      </Button>

      {isLoading ? (
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableBody>
              <TableLoading tableHeading={TABLE_HEAD} />
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leaguges Name</TableCell>
                <TableCell>Leaguges Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditCategory(category)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteCategory(category)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit/Add Category Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>{currentCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={currentCategory ? handleSaveCategoryChanges : handleAddCategory} color="primary">
            {currentCategory ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Category Modal */}
      {currentCategory && (
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <strong>{currentCategory.categoryName}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryList;
