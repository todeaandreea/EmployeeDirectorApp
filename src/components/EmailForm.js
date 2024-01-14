// src/components/EmailForm.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';

const EmailForm = ({ onClose, onSendEmail, resetSelectedPersons }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSendEmail = () => {
        // Verifică dacă subject și message nu sunt goale înainte de a trimite emailul
        if (subject.trim() === '' || message.trim() === '') {
            alert('Subject și Message sunt obligatorii.');
            return;
        }

        // Trimite emailul
        onSendEmail(subject, message);
        resetSelectedPersons();
        // Închide dialogul
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Send Email</DialogTitle>
            <DialogContent>
                <TextField
                    label="Subject"
                    fullWidth
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <TextField
                    label="Message"
                    multiline
                    rows={4}
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button style={{ color: '#100101' }} onClick={onClose}>Cancel</Button>
                <Button style={{ color: '#b00c0c' }} onClick={handleSendEmail}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailForm;