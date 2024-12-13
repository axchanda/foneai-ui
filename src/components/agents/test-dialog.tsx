import React, { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Card,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    IconButton,
    Divider,
    Stack,
    Table,
    TableCell,
    TableBody,
    TableRow,
    Typography,
    TextField,
} from '@mui/material';

import { Iconify } from '../iconify';

const TestDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => {

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Some text content</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TestDialog;