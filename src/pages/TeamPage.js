// Simplified and cleaned-up UserPage component with pagination and better structure
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import {
  Card, Table, Stack, Paper, Avatar, Button, Popover, Checkbox, TableRow,
  TableBody, TableCell, Container, Typography, IconButton, TableContainer,
  TablePagination, Box, Switch, Dialog, DialogTitle, DialogContent, Slide,
  MenuItem
} from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../service/firebase-config';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import TableLoading from '../components/table-loading/tableLoading';


const TABLE_HEAD = [
  { id: 'imageUrl', label: 'Image', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'car_no', label: 'Vehicle No', alignRight: false },
  { id: 'company', label: 'Company Name', alignRight: false },
  { id: 'service', label: 'Service Name', alignRight: false },
  { id: 'vehicle', label: 'Vehicle', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },

  { id: 'action', label: 'Action', alignRight: false }
];

const Transition = Slide;

export default function UserPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewDeleted, setViewDeleted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchservices = async () => {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, 'requests'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(fetched)
      setServices(fetched);
      setIsLoading(false);
    };
    fetchservices();
  }, [viewDeleted]);

  const handleOpenMenu = (event, user) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setPopoverAnchor(null);
  };

  const handleViewUser = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    const userRef = doc(db, 'requests', selectedUser.id);
    const newStatus = !selectedUser.isBlocked;
    await updateDoc(userRef, { isBlocked: newStatus });
    setServices(prev =>
      prev.map(u => (u.id === selectedUser.id ? { ...u, isBlocked: newStatus } : u))
    );
    toast.success(`User ${newStatus ? 'Blocked' : 'Unblocked'}`);
    handleCloseMenu();
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredservices = services.filter(user =>
    
    user
  );

  return (
    <>
      <Helmet><title>Service Management</title></Helmet>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
      Service Management
      </Typography>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">services</Typography>
        <Box display="flex" alignItems="center">
          <Typography>Deleted services</Typography>
          <Switch checked={viewDeleted} onChange={() => setViewDeleted(!viewDeleted)} />
        </Box>
      </Stack> */}

      <Card>
        <UserListToolbar filterName={filterName} onFilterName={(e) => setFilterName(e.target.value)} />

        <Scrollbar>
          <TableContainer>
            <Table>
              <UserListHead
                headLabel={TABLE_HEAD}
                rowCount={filteredservices.length}
                numSelected={selected.length}
                onSelectAllClick={(e) => {
                  const newSelecteds = e.target.checked ? filteredservices.map(n => n.id) : [];
                  setSelected(newSelecteds);
                }}
              />
              <TableBody>
                {isLoading ? <TableLoading tableHeading={TABLE_HEAD} /> : (
                  filteredservices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(request => (
                    <TableRow key={request.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(request.id)}
                          onChange={() => {
                            const newSelected = selected.includes(request.id)
                              ? selected.filter(id => id !== request.id)
                              : [...selected, request.id];
                            setSelected(newSelected);
                          }}
                        />
                      </TableCell>
                      <TableCell><Avatar src={request.imageUrl} alt={request.name} /></TableCell>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.car_no}</TableCell>
                      <TableCell>{request.companyName}</TableCell>
                      <TableCell>{request.selected_service}</TableCell>
                      <TableCell>{request.selected_vehicle}</TableCell>
                      <TableCell>{request.status}</TableCell>



                    
                      <TableCell align="left">
                        <IconButton onClick={(e) => handleOpenMenu(e, request)}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={filteredservices.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        transition
        PaperProps={{
          sx: {
            p: 1,
            width: 160,
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            animation: 'fadeIn 0.3s ease-in-out'
          }
        }}
      >
        <MenuItem onClick={handleViewUser}>
          <Iconify icon="eva:eye-fill" sx={{ mr: 1 }} /> View
        </MenuItem>
      
      </Popover>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Stack spacing={2}>
              <Typography><strong>User Id:</strong> {selectedUser.user_id}</Typography>
              <Typography><strong>User Location:</strong> {selectedUser.location}</Typography>
              <Typography><strong>Contact No :</strong> {selectedUser.contact_no}</Typography>
              <Typography><strong>Vehicle No:</strong> {selectedUser.car_no}</Typography>
              <Typography><strong>Vehicle Color:</strong> {selectedUser.car_color              }</Typography>
              <Typography><strong>Company Name:</strong> {selectedUser.companyName}</Typography>
              <Typography><strong>Company Address:</strong> {selectedUser.companyAddress || 'N/A'}</Typography>
              <Typography><strong>Selected Service:</strong> {selectedUser.selected_service}</Typography>
              <Typography><strong>Selected Vehicle:</strong> {selectedUser.selected_vehicle}</Typography>
              <Typography><strong>status:</strong> {selectedUser.status}</Typography>
              <Typography><strong>Company Id:</strong> {selectedUser.companyId}</Typography>
              <Typography><strong>Date:</strong> {dayjs.unix(selectedUser.timestamp.seconds).format("YYYY-MM-DD HH:mm:ss")              }</Typography>
              <Typography><strong>Details:</strong> {selectedUser.details || 'N/A'}</Typography>
           
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
