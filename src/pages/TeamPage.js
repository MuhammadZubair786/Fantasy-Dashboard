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

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const TABLE_HEAD = [
    { id: 'teamName', label: 'Team Name', alignRight: false },
    { id: 'teamLogo', label: 'Team Logo', alignRight: false },
    { id: 'actions', label: 'Actions', alignRight: false },
  ];

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setTeams([
        { id: 1, teamName: 'Team A', teamLogo: 'logoA.png' },
        { id: 2, teamName: 'Team B', teamLogo: 'logoB.png' },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEditTeam = (team) => {
    setCurrentTeam(team);
    setNewTeamName(team.teamName);
    setEditModalOpen(true);
  };

  const handleDeleteTeam = (team) => {
    setCurrentTeam(team);
    setDeleteModalOpen(true);
  };

  const handleSaveTeamChanges = () => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === currentTeam.id ? { ...team, teamName: newTeamName } : team
      )
    );
    setEditModalOpen(false);
    setSnackbarMessage('Team updated successfully!');
    setSnackbarOpen(true);
  };

  const handleConfirmDelete = () => {
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== currentTeam.id));
    setDeleteModalOpen(false);
    setSnackbarMessage('Team deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleAddTeam = () => {
    if (newTeamName.trim() !== '') {
      setTeams((prevTeams) => [
        ...prevTeams,
        { id: prevTeams.length + 1, teamName: newTeamName, teamLogo: 'defaultLogo.png' },
      ]);
      setNewTeamName('');
      setEditModalOpen(false);
      setSnackbarMessage('Team added successfully!');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Teams List
      </Typography>
      <Button
        style={{ backgroundColor: '#f87203' }}
        onClick={() => {
          setNewTeamName('');
          setCurrentTeam(null);
          setEditModalOpen(true);
        }}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add New Team
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
                <TableCell>Team Name</TableCell>
                <TableCell>Team Logo</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.teamName}</TableCell>
                  <TableCell>
                    <img src={team.teamLogo} alt={team.teamName} width={50} height={50} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditTeam(team)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteTeam(team)}>
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

      {/* Edit/Add Team Modal */}
      <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>{currentTeam ? 'Edit Team' : 'Add Team'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Team Name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={currentTeam ? handleSaveTeamChanges : handleAddTeam} color="primary">
            {currentTeam ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Team Modal */}
      {currentTeam && (
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete <strong>{currentTeam.teamName}</strong>?
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

export default TeamList;
