import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel } from '@mui/icons-material';

const RosterManagementPage = () => {
  const [wrestlers, setWrestlers] = useState([]);
  const [newWrestler, setNewWrestler] = useState({ name: '', score: 0, rank: 0, status: 'Bench' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editWrestler, setEditWrestler] = useState(null);

  useEffect(() => {
    // Simulate fetching wrestlers from an API (replace with real API call)
    setLoading(true);
    setTimeout(() => {
      setWrestlers([
        { id: 1, name: 'John Doe', score: 10, rank: 5, status: 'Active' },
        { id: 2, name: 'Jane Smith', score: 15, rank: 3, status: 'Bench' },
        { id: 3, name: 'Tommy Lee', score: 8, rank: 7, status: 'Active' },
        // Add more wrestlers as needed
      ]);
      setLoading(false);
    }, 3000);
  }, []);

  const handleAddWrestler = () => {
    if (wrestlers.length >= 20) {
      setSnackbarMessage('Roster limit reached. You cannot add more than 20 wrestlers.');
      setSnackbarOpen(true);
      return;
    }

    const newWrestlerData = { ...newWrestler, id: wrestlers.length + 1 };
    setWrestlers((prevWrestlers) => [...prevWrestlers, newWrestlerData]);
    setSnackbarMessage('Wrestler added successfully!');
    setSnackbarOpen(true);
    setNewWrestler({ name: '', score: 0, rank: 0, status: 'Bench' });
    setIsDialogOpen(false);
  };

  const handleEditWrestler = (wrestler) => {
    setEditWrestler(wrestler);
    setNewWrestler(wrestler);
    setIsDialogOpen(true);
  };

  const handleSaveWrestler = () => {
    setWrestlers((prevWrestlers) =>
      prevWrestlers.map((wrestler) =>
        wrestler.id === editWrestler.id ? { ...wrestler, ...newWrestler } : wrestler
      )
    );
    setSnackbarMessage('Wrestler updated successfully!');
    setSnackbarOpen(true);
    setEditWrestler(null);
    setIsDialogOpen(false);
  };

  const handleDeleteWrestler = (id) => {
    setWrestlers((prevWrestlers) => prevWrestlers.filter((wrestler) => wrestler.id !== id));
    setSnackbarMessage('Wrestler deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleToggleStatus = (id) => {
    setWrestlers((prevWrestlers) =>
      prevWrestlers.map((wrestler) =>
        wrestler.id === id ? { ...wrestler, status: wrestler.status === 'Active' ? 'Bench' : 'Active' } : wrestler
      )
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2E3B55' }}>
        Roster Management (Admin Only)
      </Typography>

      {/* Add New Wrestler Button */}
      <Button
        variant="contained"
        style={{ backgroundColor: '#f87203' }}
        startIcon={<Add />}
        sx={{ mb: 3 }}
        onClick={() => setIsDialogOpen(true)}
        disabled={wrestlers.length >= 20}
      >
        Add New Wrestler
      </Button>

      {/* Wrestlers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress sx={{ display: 'block', margin: '0 auto' }} />
                </TableCell>
              </TableRow>
            ) : wrestlers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No wrestlers available.
                </TableCell>
              </TableRow>
            ) : (
              wrestlers.map((wrestler) => (
                <TableRow key={wrestler.id}>
                  <TableCell>{wrestler.name}</TableCell>
                  <TableCell>{wrestler.score}</TableCell>
                  <TableCell>{wrestler.rank}</TableCell>
                  {/* <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: wrestler.status === 'Active' ? '#2E7D32' : '#E57373',
                        fontWeight: 'bold',
                      }}
                    >
                      {wrestler.status}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton color="primary" onClick={() => handleEditWrestler(wrestler)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteWrestler(wrestler.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle Status">
                      <IconButton
                        color="primary"
                        onClick={() => handleToggleStatus(wrestler.id)}
                      >
                        {wrestler.status === 'Active' ? <Cancel /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Wrestler Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{editWrestler ? 'Edit Wrestler' : 'Add New Wrestler'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={newWrestler.name}
            onChange={(e) => setNewWrestler({ ...newWrestler, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Score"
            variant="outlined"
            type="number"
            fullWidth
            value={newWrestler.score}
            onChange={(e) => setNewWrestler({ ...newWrestler, score: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Rank"
            variant="outlined"
            type="number"
            fullWidth
            value={newWrestler.rank}
            onChange={(e) => setNewWrestler({ ...newWrestler, rank: e.target.value })}
            sx={{ mb: 2 }}
          />
          {/* <TextField
            select
            label="Status"
            value={newWrestler.status}
            onChange={(e) => setNewWrestler({ ...newWrestler, status: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Active">Active</option>
            <option value="Bench">Bench</option>
          </TextField> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={editWrestler ? handleSaveWrestler : handleAddWrestler}
            color="primary"
            variant="contained"
          >
            {editWrestler ? 'Save Changes' : 'Add Wrestler'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RosterManagementPage;
