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
import { Add as AddIcon, DeleteSweep as DeleteSweepIcon } from '@mui/icons-material';
import BulkCartForm from '../components/BulkCartForm';
import BulkDeleteDialog from '../components/BulkDeleteDialog';

interface AdminScreenProps {
  onError: (message: string) => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onError }) => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [openCartDialog, setOpenCartDialog] = useState(false);
    const [openBulkCartDialog, setOpenBulkCartDialog] = useState(false);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
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
            onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBulkDelete = async () => {
        try {
            await api.deleteAllCarts();
            await fetchData();
        } catch (error) {
            onError(displayErrorMessage(error));
        }
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
                        onError={onError}
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 3 
                        }}>
                            <Typography variant="h6">Carts</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenBulkCartDialog(true)}
                                    startIcon={<AddIcon />}
                                >
                                    Bulk Create
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenCartDialog(true)}
                                    startIcon={<AddIcon />}
                                >
                                    Add Cart
                                </Button>
                                {carts.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => setOpenBulkDeleteDialog(true)}
                                        startIcon={<DeleteSweepIcon />}
                                    >
                                        Delete All
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        <CartList 
                            carts={carts} 
                            onUpdate={fetchData}
                            onError={onError}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Staff</Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpenPersonDialog(true)}
                                startIcon={<AddIcon />}
                            >
                                Add Staff
                            </Button>
                        </Box>
                        <PersonList 
                            persons={persons} 
                            onUpdate={fetchData}
                            onError={onError}
                        />
                    </Paper>
                </Grid>
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

            <Dialog open={openBulkCartDialog} onClose={() => setOpenBulkCartDialog(false)}>
                <BulkCartForm
                    onSubmit={fetchData}
                    onClose={() => setOpenBulkCartDialog(false)}
                    onError={onError}
                />
            </Dialog>

            <BulkDeleteDialog
                open={openBulkDeleteDialog}
                cartCount={carts.length}
                onClose={() => setOpenBulkDeleteDialog(false)}
                onConfirm={handleBulkDelete}
            />
        </Box>
    );
};

export default AdminScreen; 