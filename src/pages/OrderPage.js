import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Skeleton,
  Grid,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';

const LeaguesApprovalPage = () => {
  // State variables
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for skeleton
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Simulating data fetch and delay with useEffect
  useEffect(() => {
    setTimeout(() => {
      setLeagues([
        {
          id: 1,
          leagueName: 'Premier League',
          userName: 'John Doe',
          userEmail: 'john.doe@example.com',
          status: 'pending',
        },
        {
          id: 2,
          leagueName: 'La Liga',
          userName: 'Jane Smith',
          userEmail: 'jane.smith@example.com',
          status: 'pending',
        },
        {
          id: 3,
          leagueName: 'Serie A',
          userName: 'Bob Johnson',
          userEmail: 'bob.johnson@example.com',
          status: 'pending',
        },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  // Handle approval and rejection
  const handleApproveLeague = (leagueId) => {
    setLeagues((prevLeagues) =>
      prevLeagues.map((league) =>
        league.id === leagueId ? { ...league, status: 'approved' } : league
      )
    );
    setSnackbarMessage('League approved successfully!');
    setSnackbarOpen(true);
  };

  const handleRejectLeague = (leagueId) => {
    setLeagues((prevLeagues) =>
      prevLeagues.map((league) =>
        league.id === leagueId ? { ...league, status: 'rejected' } : league
      )
    );
    setSnackbarMessage('League rejected!');
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2E3B55' }}>
        League Approval Dashboard
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">League Name</TableCell>
              <TableCell align="left">User Name</TableCell>
              <TableCell align="left">User Email</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeleton loader for the rows
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="100px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="120px" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="180px" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="rectangular" width="80px" height="20px" />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="circle" width={40} height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              leagues.map((league) => (
                <TableRow key={league.id}>
                  <TableCell>{league.leagueName}</TableCell>
                  <TableCell>{league.userName}</TableCell>
                  <TableCell>{league.userEmail}</TableCell>
                  <TableCell align="center">
                    {league.status === 'pending' ? (
                      <Typography color="orange" fontWeight="bold">
                        Pending
                      </Typography>
                    ) : league.status === 'approved' ? (
                      <Typography color="green" fontWeight="bold">
                        Approved
                      </Typography>
                    ) : (
                      <Typography color="red" fontWeight="bold">
                        Rejected
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {league.status === 'pending' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            onClick={() => handleApproveLeague(league.id)}
                            color="primary"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#E0F7FA',
                                color: '#00838F',
                              },
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            onClick={() => handleRejectLeague(league.id)}
                            color="error"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#FFEBEE',
                                color: '#D32F2F',
                              },
                            }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {league.status !== 'pending' && (
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: league.status === 'approved' ? 'green' : 'red',
                        }}
                      >
                        {league.status.charAt(0).toUpperCase() + league.status.slice(1)}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeaguesApprovalPage;
