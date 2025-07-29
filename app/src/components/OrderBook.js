import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Grid 
} from '@mui/material';

const OrderBook = () => {
    const [buyList, setBuyList] = useState([]);
    const [sellList, setSellList] = useState([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001');

        ws.onopen = () => {
            console.log('connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type !== 'orderBook') return;
            setBuyList(data.buyList || []);
            setSellList(data.sellList || []);
        };

        ws.onclose = () => {
            console.log('disconnected');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom component="div">
                Order Book
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom component="div" color="green">
                        Buy Orders
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="buy orders">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {buyList.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {order.price}
                                        </TableCell>
                                        <TableCell align="right">{order.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" gutterBottom component="div" color="red">
                        Sell Orders
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="sell orders">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sellList.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {order.price}
                                        </TableCell>
                                        <TableCell align="right">{order.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default OrderBook;