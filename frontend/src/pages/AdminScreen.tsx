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
} from '@mui/material';
import { Cart, Person } from '../types/types';
import CartList from '../components/CartList';
import PersonList from '../components/PersonList';
import CartForm from '../components/CartForm';
import PersonForm from '../components/PersonForm';
import Dashboard from '../components/Dashboard';
import { api } from '../utils/api';
import { displayErrorMessage } from '../utils/errorHandling';

interface AdminScreenProps {
    onError: (message: string) => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onError }) => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [openCartDialog, setOpenCartDialog] = useState(false);
    const [openPersonDialog, setOpenPersonDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

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
            onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Dashboard 
                    carts={carts}
                    loading={loading}
                    error={dashboardError}
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Carts</Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpenCartDialog(true)}
                        sx={{ mb: 2 }}
                    >
                        Add Cart
                    </Button>
                    <CartList 
                        carts={carts} 
                        onUpdate={fetchData}
                        onError={onError}
                    />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">Staff</Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpenPersonDialog(true)}
                        sx={{ mb: 2 }}
                    >
                        Add Staff
                    </Button>
                    <PersonList 
                        persons={persons} 
                        onUpdate={fetchData}
                        onError={onError}
                    />
                </Paper>
            </Grid>

            <Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)}>
                <CartForm 
                    onSubmit={fetchData} 
                    onClose={() => setOpenCartDialog(false)}
                    onError={onError}
                />
            </Dialog>

            <Dialog open={openPersonDialog} onClose={() => setOpenPersonDialog(false)}>
                <PersonForm 
                    onSubmit={fetchData} 
                    onClose={() => setOpenPersonDialog(false)}
                    onError={onError}
                />
            </Dialog>
        </Grid>
    );
};

export default AdminScreen; 