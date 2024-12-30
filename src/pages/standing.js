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
  Paper,
  Avatar,
  Collapse,
  Tooltip,
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import { Delete, Edit, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc,setDoc } from 'firebase/firestore';

import TableLoading from '../components/table-loading/tableLoading';
import { db } from '../service/firebase-config';


const StandingLeagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [newLeagueName, setNewLeagueName] = useState('');
  const [leagueImage, setLeagueImage] = useState('');
  const [leagueDescription, setLeagueDescription] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [expandedLeague, setExpandedLeague] = useState(null);

  const leaguesCollection = collection(db, 'leaguesStanding');

  const fetchLeagues = async () => {
    setIsLoading(true);
  const leagueSnapshot = await getDocs(leaguesCollection);
  const leagueList = leagueSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => a.order - b.order); // Sort leagues by order field
  setLeagues(leagueList);
  setIsLoading(false);
  };

  // Simulate fetching data
  useEffect(() => {
    // setTimeout(() => {
    //   setLeagues([
    //     {
    //       id: 1,
    //       leagueName: 'Premier League',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Premier_League_Logo.png',
    //       description: 'The Premier League is the top professional football division in England.',
    //       teams: ['Manchester United', 'Chelsea', 'Liverpool', 'Manchester City', 'Arsenal'],
    //     },
    //     {
    //       id: 2,
    //       leagueName: 'La Liga',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/4/47/La_Liga_logo.svg',
    //       description: 'La Liga is the top professional football division of the Spanish football league system.',
    //       teams: ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia'],
    //     },
    //     {
    //       id: 3,
    //       leagueName: 'Serie A',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Serie_A_logo_2021.svg',
    //       description: 'Serie A is the top professional football division in Italy.',
    //       teams: ['Juventus', 'AC Milan', 'Inter Milan', 'AS Roma', 'Napoli'],
    //     },
    //     {
    //       id: 4,
    //       leagueName: 'Bundesliga',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Bundesliga_Logo_2010.svg',
    //       description: 'The Bundesliga is the top professional football division in Germany.',
    //       teams: ['Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Bayer Leverkusen', 'Wolfsburg'],
    //     },
    //     {
    //       id: 5,
    //       leagueName: 'Ligue 1',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Ligue_1_logo.svg',
    //       description: 'Ligue 1 is the top professional football division in France.',
    //       teams: ['Paris Saint-Germain', 'Marseille', 'Lyon', 'Monaco', 'Lille'],
    //     },
    //     {
    //       id: 6,
    //       leagueName: 'MLS',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Major_League_Soccer_logo.svg',
    //       description: 'Major League Soccer is the top professional football division in the United States.',
    //       teams: ['LA Galaxy', 'Seattle Sounders', 'New York Red Bulls', 'Atlanta United', 'Toronto FC'],
    //     },
    //     {
    //       id: 7,
    //       leagueName: 'Brazilian Serie A',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Brazilian_Football_Championship_logo.svg',
    //       description: 'The Brazilian Serie A is the top division of professional football in Brazil.',
    //       teams: ['Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Vasco da Gama'],
    //     },
    //     {
    //       id: 8,
    //       leagueName: 'Argentina Primera Division',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Argentine_Primer_Divisi%C3%B3n_logo.svg',
    //       description: 'The Argentine Primera Division is the top professional football division in Argentina.',
    //       teams: ['Boca Juniors', 'River Plate', 'Independiente', 'Racing Club', 'San Lorenzo'],
    //     },
    //     {
    //       id: 9,
    //       leagueName: 'Portuguese Primeira Liga',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Liga_Pro_logo.png',
    //       description: 'The Primeira Liga is the top division of professional football in Portugal.',
    //       teams: ['Benfica', 'Porto', 'Sporting CP', 'Braga', 'Vitoria Guimarães'],
    //     },
    //     {
    //       id: 10,
    //       leagueName: 'Dutch Eredivisie',
    //       leagueImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Eredivisie_logo_2017.svg',
    //       description: 'The Eredivisie is the top professional football league in the Netherlands.',
    //       teams: ['Ajax', 'PSV Eindhoven', 'Feyenoord', 'AZ Alkmaar', 'Vitesse'],
    //     },
    //   ]);
    //   setIsLoading(false);
    // }, 1000);
    fetchLeagues()
  }, []);

  const handleAddLeague = async () => {
    if (!newLeagueName || !leagueImage || !leagueDescription) return;

    const newLeague = {
      leagueName: newLeagueName,
      leagueImage,
      description: leagueDescription,
      teams,
    };

    const newOrder = leagues.length > 0 ? leagues[leagues.length - 1].order + 1 : 0;
    const newLeagueWithOrder = { ...newLeague, order: newOrder };

    const leagueRef = doc(collection(db, "leaguesStanding"));
    await setDoc(leagueRef, newLeagueWithOrder);
    fetchLeagues();
    setSnackbarMessage('League added successfully!');
    setSnackbarOpen(true);
    setIsDialogOpen(false);
    resetLeagueForm();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditLeague = (league) => {
    setIsEditMode(true);
    setCurrentLeague(league);
    setNewLeagueName(league.leagueName);
    setLeagueImage(league.leagueImage);
    setLeagueDescription(league.description);
    console.log(league.teams)
    setTeams(league.teams);
    setIsDialogOpen(true);
  };

  const handleSaveLeagueChanges = async () => {
    const leagueDoc = doc(db, 'leaguesStanding', currentLeague.id);

    await updateDoc(leagueDoc, {
      leagueName: newLeagueName,
      leagueImage,
      description: leagueDescription,
      teams,
    });

    fetchLeagues();
    setSnackbarMessage('League updated successfully!');
    setSnackbarOpen(true);
    setIsDialogOpen(false);

    resetLeagueForm();
  };


  const handleDeleteTeam = (teamIndex) => {
    const updatedTeams = teams.filter((_, index) => index !== teamIndex);
    setTeams(updatedTeams);
  };

  const resetLeagueForm = () => {
    setNewLeagueName('');
    setLeagueImage('');
    setLeagueDescription('');
    setTeams([]);
    setIsEditMode(false);
    setCurrentLeague(null);
  };

  const handleDeleteLeague = async (leagueId) => {
    const leagueDoc = doc(db, 'leaguesStanding', leagueId);

    await deleteDoc(leagueDoc);

    const updatedLeagues = leagues.filter((league) => league.id !== leagueId);
  setLeagues(updatedLeagues);

  // Update order in Firebase for the remaining leagues
  updatedLeagues.forEach(async (league, idx) => {
    const leagueDoc = doc(db, 'leaguesStanding', league.id);
    await updateDoc(leagueDoc, { order: idx });
  });

    fetchLeagues();
    setSnackbarMessage('League deleted successfully!');
    setSnackbarOpen(true);
  };

  const TABLE_HEAD = [
    { id: 'teamName', label: 'Team Name', alignRight: false },
    { id: 'teamLogo', label: 'Team Logo', alignRight: false },
    { id: 'actions', label: 'Actions', alignRight: false },
  ];


  const handleMoveLeague = (direction, index) => {
    const updatedLeagues = [...leagues];
    const [movedLeague] = updatedLeagues.splice(index, 1);
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  updatedLeagues.splice(newIndex, 0, movedLeague);
  
  // Update the order in the state
  setLeagues(updatedLeagues);

  // Update the order in Firebase
  updatedLeagues.forEach(async (league, idx) => {
    const leagueDoc = doc(db, 'leaguesStanding', league.id);
    await updateDoc(leagueDoc, {
      order: idx, // Update the order field to the new index
    });
  });
  };

  const handleToggleTeams = (leagueId) => {
    setExpandedLeague((prevExpanded) => (prevExpanded === leagueId ? null : leagueId));
  };

  const resetForm = () => {
    setNewLeagueName('');
    setLeagueImage('');
    setLeagueDescription('');
    setTeams([]);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Standing Leagues
      </Typography>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#f87203',
          color: '#fff',
          mb: 3,
          '&:hover': { backgroundColor: '#f57c00' },
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        Add New League
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
        leagues.map((league, index) => (
          <Box key={league.id} sx={{ mb: 4 }}>
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={league.leagueImage} alt={league.leagueName} sx={{ width: 60, height: 60, marginRight: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {league.leagueName}
                </Typography>
                <Box sx={{ marginLeft: 'auto' }}>
                  <Tooltip title="Move Up">
                    <IconButton onClick={() => handleMoveLeague('up', index)}>
                      <ArrowUpward />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Move Down">
                    <IconButton onClick={() => handleMoveLeague('down', index)}>
                      <ArrowDownward />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEditLeague(league)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteLeague(league.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
                {league.description}
              </Typography>

              <Button
                variant="outlined"
                onClick={() => handleToggleTeams(league.id)}
                sx={{
                  borderColor: '#f87203',
                  color: '#f87203',
                  '&:hover': { borderColor: '#f57c00', color: '#f57c00' },
                }}
              >
                {expandedLeague === league.id ? 'Hide Teams' : 'Show Teams'}
              </Button>

              <Collapse in={expandedLeague === league.id}>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Team Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {league.teams.map((team, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{team}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
            </Paper>
          </Box>
        ))
      )}

      {/* Dialog for adding/editing leagues */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>{isEditMode ? 'Edit League' : 'Add New League'}</DialogTitle>
        <DialogContent>
          <TextField
            label="League Name"
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Image URL"
            value={leagueImage}
            onChange={(e) => setLeagueImage(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Description"
            value={leagueDescription}
            onChange={(e) => setLeagueDescription(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            fullWidth
            margin="dense"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setTeams([...teams, teamName]);
                console.log(teams)
                setTeamName('');
              }
            }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            Press Enter to add team
          </Typography>
          {teams.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Teams:</Typography>
              {teams.map((team, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 ,justifyContent:"space-between"}}>
                  <Typography>{team}</Typography>
                  <IconButton
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleDeleteTeam(index)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={isEditMode ? handleSaveLeagueChanges : handleAddLeague} color="primary">
            {isEditMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
             open={snackbarOpen}
             autoHideDuration={6000}
             onClose={handleSnackbarClose}
             anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
           >
             <Alert onClose={handleSnackbarClose} severity="success">
               {snackbarMessage}
             </Alert>
           </Snackbar>
    </Box>
  );
};

export default StandingLeagues;
