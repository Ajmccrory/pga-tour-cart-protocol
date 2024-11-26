/**
 * Cart Management System - Admin Screen Component
 * @author AJ McCrory
 * @created 2024
 * @description Main admin dashboard for cart and staff management
 */

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Button,
    Dialog,
    Box,
    styled,
} from '@mui/material';
import { Cart, Person } from '../types/types';
import CartList from '../components/CartList';
import PersonList from '../components/PersonList';
import CartForm from '../components/CartForm';
import PersonForm from '../components/PersonForm';
import Dashboard from '../components/Dashboard';
import { api } from '../utils/api';
import { displayErrorMessage } from '../utils/errorHandling';
import { Add as AddIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 3),
    marginBottom: theme.spacing(2),
}));

const AdminScreen: React.FC = () => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [openCartDialog, setOpenCartDialog] = useState(false);
    const [openPersonDialog, setOpenPersonDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cartsData, personsData] = await Promise.all([
                api.getCarts(),
                api.getPersons()
            ]);
            setCarts(cartsData);
            setPersons(personsData);
            setDashboardError(null);
        } catch (error) {
            const errorMessage = displayErrorMessage(error);
            setDashboardError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleError = (message: string) => {
        setDashboardError(message);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Dashboard 
                        carts={carts}
                        loading={loading}
                        error={dashboardError}
                        onUpdate={fetchData}
                        onError={handleError}
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Carts</Typography>
                            <ActionButton 
                                variant="contained" 
                                onClick={() => setOpenCartDialog(true)}
                                startIcon={<AddIcon />}
                            >
                                Add Cart
                            </ActionButton>
                        </Box>
                        <CartList 
                            carts={carts} 
                            onUpdate={fetchData}
                            onError={handleError}
                        />
                    </StyledPaper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <StyledPaper>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Staff</Typography>
                            <ActionButton 
                                variant="contained" 
                                onClick={() => setOpenPersonDialog(true)}
                                startIcon={<AddIcon />}
                            >
                                Add Staff
                            </ActionButton>
                        </Box>
                        <PersonList 
                            persons={persons} 
                            onUpdate={fetchData}
                            onError={handleError}
                        />
                    </StyledPaper>
                </Grid>
            </Grid>

            <Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)}>
                <CartForm 
                    onSubmit={fetchData} 
                    onClose={() => setOpenCartDialog(false)}
                    onError={handleError}
                />
            </Dialog>

            <Dialog open={openPersonDialog} onClose={() => setOpenPersonDialog(false)}>
                <PersonForm 
                    onSubmit={fetchData} 
                    onClose={() => setOpenPersonDialog(false)}
                    onError={handleError}
                />
            </Dialog>
        </Box>
    );
};

export default AdminScreen; 