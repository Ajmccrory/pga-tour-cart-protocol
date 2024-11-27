/**
 * Cart Management System - Cart History List Component
 * @author AJ McCrory
 * @created 2024
 * @description Displays cart usage history with filtering and sorting
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  Chip,
  TextField,
  MenuItem,
  styled,
} from '@mui/material';
import { api } from '../utils/api';
import { CartHistory } from '../types/types';

const StyledTableContainer = styled(Box)(({ theme }) => ({
  maxHeight: 440,
  overflowX: 'auto',
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold',
  },
}));

const StatusChip = styled(Chip)<{ overdue: boolean }>(({ theme, overdue }) => ({
  backgroundColor: overdue ? theme.palette.error.main : theme.palette.success.main,
  color: theme.palette.common.white,
}));

interface CartHistoryListProps {
  cartId?: number;
  personId?: number;
  onError: (message: string) => void;
}

const CartHistoryList: React.FC<CartHistoryListProps> = ({
  cartId,
  personId,
  onError,
}) => {
  const [history, setHistory] = useState<CartHistory[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, overdue, onTime

  useEffect(() => {
    fetchHistory();
  }, [cartId, personId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      let data;
      if (cartId) {
        data = await api.getCartHistory(cartId);
      } else if (personId) {
        data = await api.getPersonHistory(personId);
      } else {
        data = await api.getAllHistory();
      }
      setHistory(data);
    } catch (error) {
      onError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string): string => {
    return new Date(dateTime).toLocaleString();
  };

  const isOverdue = (returnTime: string, expectedReturnTime: string): boolean => {
    return new Date(returnTime) > new Date(expectedReturnTime);
  };

  const filteredHistory = history.filter(entry => {
    if (filter === 'overdue') {
      return entry.return_time && isOverdue(entry.return_time, entry.expected_return_time);
    }
    if (filter === 'onTime') {
      return entry.return_time && !isOverdue(entry.return_time, entry.expected_return_time);
    }
    return true;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Cart Usage History</Typography>
        <TextField
          select
          label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          sx={{ width: 150 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
          <MenuItem value="onTime">On Time</MenuItem>
        </TextField>
      </Box>

      <StyledTableContainer>
        <Paper>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Cart #</TableCell>
                <TableCell>Staff Member</TableCell>
                <TableCell>Checkout Time</TableCell>
                <TableCell>Expected Return</TableCell>
                <TableCell>Actual Return</TableCell>
                <TableCell>Battery Level</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.cart_number}</TableCell>
                    <TableCell>{entry.person_name}</TableCell>
                    <TableCell>{formatDateTime(entry.checkout_time)}</TableCell>
                    <TableCell>{formatDateTime(entry.expected_return_time)}</TableCell>
                    <TableCell>
                      {entry.return_time ? formatDateTime(entry.return_time) : 'Not returned'}
                    </TableCell>
                    <TableCell>
                      {entry.battery_level_start}% → {entry.battery_level_end || '?'}%
                    </TableCell>
                    <TableCell>
                      {entry.return_time ? (
                        <StatusChip
                          label={isOverdue(entry.return_time, entry.expected_return_time) ? 'Overdue' : 'On Time'}
                          overdue={isOverdue(entry.return_time, entry.expected_return_time)}
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredHistory.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default CartHistoryList; 