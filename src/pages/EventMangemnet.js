import React, { useEffect, useState } from 'react';
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
  TableContainer,
  TableBody,
  Table,
} from '@mui/material';
import { Edit, Delete, ArrowDownward, ArrowUpward } from '@mui/icons-material';

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../service/firebase-config';
import TableLoading from '../components/table-loading/tableLoading';

const ActiveMatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [laoding,setloading] =useState(true)
   const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const matchesCollection = collection(db, 'matches'); // Firestore collection reference

  // Fetch matches from Firestore
  const fetchMatches = async () => {


    const querySnapshot = await getDocs(matchesCollection);
    const matchesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMatches(matchesData);
    setloading(false)
  };

  useEffect(() => {
    setloading(true)
    fetchMatches();
  }, []);

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

  const handleSaveMatch = async () => {
    if (currentMatch) {
      // Update match in Firestore
      const matchDoc = doc(db, 'matches', currentMatch.id);
      await updateDoc(matchDoc, {
        team1Score,
        team2Score,
      });
      setSnackbarMessage('Match updated successfully!');
    } else {
      // Add new match to Firestore
      await addDoc(matchesCollection, {
        team1,
        team2,
        team1Score,
        team2Score,
        matchDetails: 'Match details not available',
        isExpanded: false,
      });
      setSnackbarMessage('Match added successfully!');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
    fetchMatches(); // Refresh matches after adding/updating
  };

  const handleDeleteMatch = async (matchId) => {
    const matchDoc = doc(db, 'matches', matchId);
    await deleteDoc(matchDoc);
    setSnackbarMessage('Match deleted successfully!');
    setSnackbarOpen(true);
    fetchMatches(); // Refresh matches after deletion
  };

  const handleToggleDetails = (matchId) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId ? { ...match, isExpanded: !match.isExpanded } : match
      )
    );
  };

  const TABLE_HEAD = [
    { id: 'teamName', label: 'Team Name', alignRight: false },
    { id: 'teamLogo', label: 'Team Logo', alignRight: false },
    { id: 'actions', label: 'Actions', alignRight: false },
  ];


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
      {
      laoding ? 
       <TableContainer sx={{ minWidth: 800 }}>
       <Table>
         <TableBody>
           <TableLoading tableHeading={TABLE_HEAD} />
         </TableBody>
       </Table>
     </TableContainer>
      :
        matches.length === 0 ? (
          <Typography style={{margin:"20px"}}>No active matches available. Add a match to get started!</Typography>
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
