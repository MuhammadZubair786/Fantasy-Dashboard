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
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../service/firebase-config';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
import TableLoading from '../components/table-loading/tableLoading';

const TABLE_HEAD = [
  { id: 'imageUrl', label: 'Image', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'gender', label: 'Gender', alignRight: false },
  { id: 'age', label: 'Age', alignRight: false },
  { id: 'contact', label: 'Contact', alignRight: false },
  { id: 'isBlocked', label: 'Account Status', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false }
];

const Transition = Slide;

export default function UserPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
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
    const fetchUsers = async () => {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, 'users'));
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(fetched);
      setIsLoading(false);
    };
    fetchUsers();
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
    const userRef = doc(db, 'users', selectedUser.id);
    const newStatus = !selectedUser.isBlocked;
    await updateDoc(userRef, { isBlocked: newStatus });
    setUsers(prev =>
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

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <>
      <Helmet><title>User Management</title></Helmet>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
      User Management
      </Typography>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Users</Typography>
        <Box display="flex" alignItems="center">
          <Typography>Deleted Users</Typography>
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
                rowCount={filteredUsers.length}
                numSelected={selected.length}
                onSelectAllClick={(e) => {
                  const newSelecteds = e.target.checked ? filteredUsers.map(n => n.id) : [];
                  setSelected(newSelecteds);
                }}
              />
              <TableBody>
                {isLoading ? <TableLoading tableHeading={TABLE_HEAD} /> : (
                  filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
                    <TableRow key={user.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(user.id)}
                          onChange={() => {
                            const newSelected = selected.includes(user.id)
                              ? selected.filter(id => id !== user.id)
                              : [...selected, user.id];
                            setSelected(newSelected);
                          }}
                        />
                      </TableCell>
                      <TableCell><Avatar src={user.imageUrl} alt={user.name} /></TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>{user.age}</TableCell>
                      <TableCell>{user.contact}</TableCell>
                      <TableCell>
                        <Button size="small" color={user.isBlocked ? 'error' : 'success'} variant="outlined">
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </Button>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleOpenMenu(e, user)}>
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
          count={filteredUsers.length}
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
        <MenuItem onClick={handleBlockUser}>
          <Iconify icon="eva:slash-outline" sx={{ mr: 1 }} />
          {selectedUser?.isBlocked ? 'Unblock' : 'Block'}
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
              <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
              <Typography><strong>Gender:</strong> {selectedUser.gender}</Typography>
              <Typography><strong>Age:</strong> {selectedUser.age}</Typography>
              <Typography><strong>Contact:</strong> {selectedUser.contact}</Typography>
              <Typography><strong>Address:</strong> {selectedUser.address || 'N/A'}</Typography>
              <Typography><strong>UID:</strong> {selectedUser.id}</Typography>
              <Typography><strong>Status:</strong> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
