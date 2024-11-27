/**
 * Cart Management System - Cart History Dialog
 * @author AJ McCrory
 * @created 2024
 * @description Dialog for displaying cart usage history
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Person, Timer, Battery5Bar } from '@mui/icons-material';
import { Cart, CartHistory } from '../types/types';
import { api } from '../utils/api';

const StyledTableContainer = styled(Box)(({ theme }) => ({
  maxHeight: '60vh',
  marginTop: theme.spacing(2),
  overflowX: 'auto',
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
}));

const StatusChip = styled(Chip)<{ isoverdue: 'true' | 'false' }>(({ theme, isoverdue }) => ({
  backgroundColor: isoverdue === 'true' ? theme.palette.error.main : theme.palette.success.main,
  color: theme.palette.common.white,
}));

interface CartHistoryDialogProps {
  open: boolean;
  cart: Cart | null;
  onClose: () => void;
  onError: (message: string) => void;
}

const CartHistoryDialog: React.FC<CartHistoryDialogProps> = ({
  open,
  cart,
  onClose,
  onError,
}) => {
  const [history, setHistory] = useState<CartHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = React.useCallback(async () => {
    if (!cart) return;
    
    try {
      setLoading(true);
      const data = await api.getCartHistory(cart.id);
      setHistory(data);
    } catch (error) {
      onError('Failed to fetch cart history');
    } finally {
      setLoading(false);
    }
  }, [cart, onError]);

  useEffect(() => {
    if (open && cart) {
      fetchHistory();
    }
  }, [open, cart, fetchHistory]);

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString();
  };

  const isOverdue = (returnTime: string, expectedReturnTime: string): boolean => {
    return new Date(returnTime) > new Date(expectedReturnTime);
  };

  const getBatteryDifference = (start: number, end: number | null): string => {
    if (end === null) return `${start}% → In Use`;
    const diff = end - start;
    const sign = diff >= 0 ? '+' : '';
    return `${start}% → ${end}% (${sign}${diff}%)`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Cart #{cart?.cart_number} History
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledTableContainer>
            <Paper>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person />
                        Staff Member
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer />
                        Checkout Time
                      </Box>
                    </TableCell>
                    <TableCell>Expected Return</TableCell>
                    <TableCell>Actual Return</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Battery5Bar />
                        Battery Usage
                      </Box>
                    </TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.person_name}</TableCell>
                      <TableCell>{formatDateTime(entry.checkout_time)}</TableCell>
                      <TableCell>{formatDateTime(entry.expected_return_time)}</TableCell>
                      <TableCell>
                        {entry.return_time ? formatDateTime(entry.return_time) : 'In Use'}
                      </TableCell>
                      <TableCell>
                        {getBatteryDifference(entry.battery_level_start, entry.battery_level_end)}
                      </TableCell>
                      <TableCell>
                        {entry.return_time ? (
                          <StatusChip
                            label={isOverdue(entry.return_time, entry.expected_return_time) ? 'Overdue' : 'On Time'}
                            isoverdue={isOverdue(entry.return_time, entry.expected_return_time).toString() as 'true' | 'false'}
                          />
                        ) : (
                          <Chip label="In Progress" color="info" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </StyledTableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartHistoryDialog; 