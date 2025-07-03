import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import {
    Card,
    Typography,
    Grid,
    Avatar,
    Box,
    Divider,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TotalUsers = () => {
    const { users, getallusers, dashdata, getdashdata, deleteUser, editUser } = useContext(AdminContext);
    const [selectedState, setSelectedState] = useState('');
    
    // State for edit dialog
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        full_address: '',
        pet_type: '',
        breed: '',
        category: '',
        pet_age: '',
        pet_gender: ''
    });
    const [userImage, setUserImage] = useState(null);
    
    // State for delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        getallusers(); 
    }, []);

    useEffect(() => {
        getdashdata(); 
    }, []);

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
    };

    const filteredUsers = selectedState
        ? users.filter((user) => user.address?.LOCATION?.toUpperCase() === selectedState)
        : users;
        
    // Handle opening edit dialog
    const handleEditClick = (user) => {
        setCurrentUser(user);
        setUserFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            gender: user.gender || '',
            full_address: user.full_address || '',
            pet_type: user.pet_type || '',
            breed: user.breed || '',
            category: user.category || '',
            pet_age: user.pet_age || '',
            pet_gender: user.pet_gender || ''
        });
        setEditDialogOpen(true);
    };
    
    // Handle edit dialog close
    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setCurrentUser(null);
        setUserImage(null);
    };
    
    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({
            ...userFormData,
            [name]: value
        });
    };
    
    // Handle image upload
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserImage(e.target.files[0]);
        }
    };
    
    // Handle form submission
    const handleEditSubmit = () => {
        if (currentUser && currentUser._id) {
            editUser(currentUser._id, userFormData, userImage);
            handleEditDialogClose();
        }
    };
    
    // Handle delete click
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };
    
    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (userToDelete && userToDelete._id) {
            deleteUser(userToDelete._id);
            setDeleteDialogOpen(false);
        }
    };
    
    // Handle delete dialog close
    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    return dashdata && (
        <Box sx={{ p: 4, minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight="bold" mb={3} color="green">
                All Users 🦥
            </Typography>

            {/* Dropdown for State Filter */}
            <FormControl sx={{ width: '300px', mb: 4 }}>
                <InputLabel
                    id="state-select-label"
                    sx={{ color: 'green', fontWeight: 'bold' }}
                >
                    Filter by State
                </InputLabel>
                <Select
                    labelId="state-select-label"
                    value={selectedState}
                    onChange={handleStateChange}
                    label="Filter by State"
                    sx={{
                        color: 'green',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'green' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'darkgreen' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'green' },
                    }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="NEW DELHI">NEW DELHI</MenuItem>
                    <MenuItem value="GUJARAT">GUJARAT</MenuItem>
                    <MenuItem value="HARYANA">HARYANA</MenuItem>
                    <MenuItem value="MUMBAI">MUMBAI</MenuItem>
                </Select>
            </FormControl>

            {filteredUsers.length > 0 ? (
                <Grid container spacing={6}>
                    {filteredUsers.map((user, index) => (
                        <Grid item xs={12} sm={6} md={3.9} key={index} >
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    width: '392px',
                                    p: 3,
                                    borderRadius: 4,
                                    boxShadow: 5,
                                    transition: '0.3s',
                                    '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        src={user.image || 'https://via.placeholder.com/150'}
                                        alt={user.name}
                                        sx={{ width: 80, height: 80, mr: 2, border: '2px solid #1976d2' }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                                            {user.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Gender: {user.gender}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Age: {calculateAge(user.dob)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Email: {user.email}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Phone: {user.phone}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Appointments: {
                                                dashdata?.userAppointments?.find(appointment => appointment.userId === user._id)?.totalAppointments || 'N/A'
                                            }
                                        </Typography>
                                    </Box>
                                </Box>

                                <div className='flex flex-row gap-3'>
                                    <div className='border p-1 border-green-500 bg-green-300 rounded text-xs '>{user.address.LOCATION}</div>
                                    <div className='border p-1 border-green-500 bg-green-300 rounded text-xs '>{user.address.LINE}</div>
                                </div>

                                <Divider sx={{ my: 2 }} />

                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        display="flex"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid',
                                                borderColor: 'green',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '12px',
                                                backgroundColor: '#e8f5e9',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            <LocationOnIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                                            {user.full_address}
                                        </Box>
                                    </Typography>
                                    {/* Pet Info */}
                                    <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                                        <Box sx={{
                                            border: '1px solid',
                                            borderColor: 'green',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '12px',
                                            backgroundColor: '#e0f7fa',
                                            fontSize: '0.875rem',
                                        }}>
                                            {user.pet_type}
                                        </Box>
                                        <Box sx={{
                                            border: '1px solid',
                                            borderColor: 'green',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '12px',
                                            backgroundColor: '#e0f7fa',
                                            fontSize: '0.875rem',
                                        }}>
                                            {user.breed}
                                        </Box>
                                        <Box sx={{
                                            border: '1px solid',
                                            borderColor: 'green',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '12px',
                                            backgroundColor: '#e0f7fa',
                                            fontSize: '0.875rem',
                                        }}>
                                            {user.category}
                                        </Box>
                                    </Box>

                                    <Box display="flex" gap={2} mt={2}>
                                        <Box
                                            sx={{
                                                border: '1px solid',
                                                borderColor: 'green',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '12px',
                                                backgroundColor: '#e8f5e9',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Pet Age: {user.pet_age}
                                        </Box>
                                        <Box
                                            sx={{
                                                border: '1px solid',
                                                borderColor: 'green',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '12px',
                                                backgroundColor: '#e8f5e9',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            Pet Gender: {user.pet_gender}
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Chip
                                        icon={
                                            user.isAccountverified ? <VerifiedIcon /> : <ErrorOutlineIcon />
                                        }
                                        label={user.isAccountverified ? 'Verified Account' : 'Unverified Account'}
                                        color={user.isAccountverified ? 'success' : 'error'}
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                    
                                    <Box>
                                        <IconButton 
                                            color="primary" 
                                            onClick={() => handleEditClick(user)}
                                            sx={{ mr: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <div className="flex justify-center items-center mt-6">
                    <p className="text-5xl sm:text-7xl md:text-4xl text-center font-extrabold text-green-400">
                        🦥No User🦦 <br /> Found in <br /> {selectedState ? `${selectedState}` : ''}
                    </p>
                </div>
            )}
            
            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: 'green', color: 'white', fontWeight: 'bold' }}>
                    Edit User
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="name"
                                label="Name"
                                value={userFormData.name}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="email"
                                label="Email"
                                value={userFormData.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="phone"
                                label="Phone"
                                value={userFormData.phone}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={userFormData.gender}
                                    onChange={handleInputChange}
                                    label="Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="full_address"
                                label="Full Address"
                                value={userFormData.full_address}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Pet Information
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="pet_type"
                                label="Pet Type"
                                value={userFormData.pet_type}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="breed"
                                label="Breed"
                                value={userFormData.breed}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="category"
                                label="Category"
                                value={userFormData.category}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="pet_age"
                                label="Pet Age"
                                value={userFormData.pet_age}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Pet Gender</InputLabel>
                                <Select
                                    name="pet_gender"
                                    value={userFormData.pet_gender}
                                    onChange={handleInputChange}
                                    label="Pet Gender"
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                Profile Image
                            </Typography>
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mt: 1 }}
                            >
                                Upload New Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {userImage && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Selected file: {userImage.name}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleEditDialogClose} color="error" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="success" variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', fontWeight: 'bold' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mt: 2 }}>
                        Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleDeleteDialogClose} color="primary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TotalUsers;