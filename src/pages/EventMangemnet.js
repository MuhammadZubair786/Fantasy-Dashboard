import React, { useState } from 'react';
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
  Snackbar,
  Alert,
  Paper,
  Grid,
  Tooltip,
  Collapse,
  Avatar,
} from '@mui/material';
import { Edit, Delete, Visibility, ArrowDownward, ArrowUpward } from '@mui/icons-material';

const ActiveMatchPage = () => {
  // Static data for matches
  const [matches, setMatches] = useState([
    {
      id: 1,
      team1: 'Manchester United',
      team2: 'Chelsea',
      team1Score: 2,
      team2Score: 1,
      matchDetails: 'Match played at Old Trafford, Manchester',
      isExpanded: false,
    },
    {
      id: 2,
      team1: 'Real Madrid',
      team2: 'Barcelona',
      team1Score: 1,
      team2Score: 1,
      matchDetails: 'Match played at Santiago Bernabeu, Madrid',
      isExpanded: false,
    },
    {
      id: 3,
      team1: 'Liverpool',
      team2: 'Manchester City',
      team1Score: 3,
      team2Score: 0,
      matchDetails: 'Match played at Anfield, Liverpool',
      isExpanded: false,
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpenDialog = (match = null) => {
    if (match) {
      setCurrentMatch(match);
      setTeam1(match.team1);
      setTeam2(match.team2);
      setTeam1Score(match.team1Score);
      setTeam2Score(match.team2Score);
    } else {
      setCurrentMatch(null);
      setTeam1('');
      setTeam2('');
      setTeam1Score(0);
      setTeam2Score(0);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSaveMatch = () => {
    if (currentMatch) {
      // Update the match
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === currentMatch.id
            ? { ...match, team1Score, team2Score }
            : match
        )
      );
      setSnackbarMessage('Match updated successfully!');
    } else {
      // Add new match
      const newMatch = {
        id: Date.now(),
        team1,
        team2,
        team1Score,
        team2Score,
        matchDetails: 'Match details not available',
        isExpanded: false,
      };
      setMatches((prevMatches) => [...prevMatches, newMatch]);
      setSnackbarMessage('Match added successfully!');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteMatch = (matchId) => {
    setMatches((prevMatches) => prevMatches.filter((match) => match.id !== matchId));
    setSnackbarMessage('Match deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleToggleDetails = (matchId) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId ? { ...match, isExpanded: !match.isExpanded } : match
      )
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Active Matches
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => handleOpenDialog()}
      >
        Add New Match
      </Button>

      <Grid container spacing={3}>
        {matches.length === 0 ? (
          <Typography>No active matches available. Add a match to get started!</Typography>
        ) : (
          matches.map((match) => (
            <Grid item xs={12} md={6} key={match.id}>
              <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                    {match.team1.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {match.team1} vs {match.team2}
                  </Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#f87203' }}>
                    {match.team1Score} - {match.team2Score}
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => handleToggleDetails(match.id)}
                  sx={{
                    borderColor: '#f87203',
                    color: '#f87203',
                    '&:hover': { borderColor: '#f57c00', color: '#f57c00' },
                  }}
                >
                  {match.isExpanded ? 'Show Less' : 'Show More'}
                  {match.isExpanded ? <ArrowUpward /> : <ArrowDownward />}
                </Button>

                <Collapse in={match.isExpanded}>
                  <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                    {match.matchDetails}
                  </Typography>
                </Collapse>

                <Box sx={{ mt: 2 }}>
                  <Tooltip title="Edit Match">
                    <IconButton onClick={() => handleOpenDialog(match)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Match">
                    <IconButton onClick={() => handleDeleteMatch(match.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog for adding/editing match */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentMatch ? 'Edit Match' : 'Add New Match'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Team 1"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Team 2"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Team 1 Score"
            type="number"
            value={team1Score}
            onChange={(e) => setTeam1Score(Number(e.target.value))}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Team 2 Score"
            type="number"
            value={team2Score}
            onChange={(e) => setTeam2Score(Number(e.target.value))}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveMatch} color="primary">
            {currentMatch ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActiveMatchPage;
