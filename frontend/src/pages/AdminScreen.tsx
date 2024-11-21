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
import Layout from '../components/Layout';

const AdminScreen: React.FC = () => {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [openCartDialog, setOpenCartDialog] = useState(false);
    const [openPersonDialog, setOpenPersonDialog] = useState(false);

    useEffect(() => {
        fetchCarts();
        fetchPersons();
    }, []);

    const fetchCarts = async () => {
        const response = await fetch('http://localhost:5000/carts');
        const data = await response.json();
        setCarts(data);
    };

    const fetchPersons = async () => {
        const response = await fetch('http://localhost:5000/persons');
        const data = await response.json();
        setPersons(data);
    };

    return (
        <Layout>
            <Box sx={{ mb: 4 }}>
                <Dashboard carts={carts} />
            </Box>
            
            <Grid container spacing={3}>
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
                        <CartList carts={carts} onUpdate={fetchCarts} />
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
                        <PersonList persons={persons} onUpdate={fetchPersons} />
                    </Paper>
                </Grid>
            </Grid>

            <Dialog open={openCartDialog} onClose={() => setOpenCartDialog(false)}>
                <CartForm onSubmit={fetchCarts} onClose={() => setOpenCartDialog(false)} />
            </Dialog>

            <Dialog open={openPersonDialog} onClose={() => setOpenPersonDialog(false)}>
                <PersonForm onSubmit={fetchPersons} onClose={() => setOpenPersonDialog(false)} />
            </Dialog>
        </Layout>
    );
};

export default AdminScreen; 