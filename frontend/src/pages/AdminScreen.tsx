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
} from '@mui/material';
import { Cart, Person } from '../types/types';
import CartList from '../components/CartList';
import PersonList from '../components/PersonList';
import CartForm from '../components/CartForm';
import PersonForm from '../components/PersonForm';
import Dashboard from '../components/Dashboard';
import { api } from '../utils/api';
import { displayErrorMessage } from '../utils/errorHandling';
import { Add, DeleteSweep } from '@mui/icons-material';
import BulkCartForm from '../components/BulkCartForm';
import CartSelectionDialog from '../components/CartSelectionDialog';

interface AdminScreenProps {
  onError: (message: string) => void;
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onError }) => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [openCartDialog, setOpenCartDialog] = useState(false);
    const [openBulkCartDialog, setOpenBulkCartDialog] = useState(false);
    const [openPersonDialog, setOpenPersonDialog] = useState(false);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
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
    }, [onError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Carts</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenBulkCartDialog(true)}
                                    startIcon={<Add />}
                                >
                                    Bulk Create
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenCartDialog(true)}
                                    startIcon={<Add />}
                                >
                                    Add Cart
                                </Button>
                                {carts.length > 0 && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => setOpenBulkDeleteDialog(true)}
                                        startIcon={<DeleteSweep />}
                                    >
                                        Bulk Delete
                                    </Button>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                            <CartList 
                                carts={carts} 
                                onUpdate={fetchData}
                                onError={onError}
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">Staff</Typography>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpenPersonDialog(true)}
                                startIcon={<Add />}
                            >
                                Add Staff
                            </Button>
                        </Box>
                        <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                            <PersonList 
                                persons={persons} 
                                onUpdate={fetchData}
                                onError={onError}
                            />
                        </Box>
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

            <Dialog 
                open={openBulkCartDialog} 
                onClose={() => setOpenBulkCartDialog(false)}
                maxWidth="md"
            >
                <BulkCartForm
                    onSubmit={fetchData}
                    onClose={() => setOpenBulkCartDialog(false)}
                    onError={onError}
                />
            </Dialog>

            <CartSelectionDialog
                open={openBulkDeleteDialog}
                carts={carts}
                onClose={() => setOpenBulkDeleteDialog(false)}
                onSubmit={fetchData}
                onError={onError}
            />
        </Box>
    );
};

export default AdminScreen; 