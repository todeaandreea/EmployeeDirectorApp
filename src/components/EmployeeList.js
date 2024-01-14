import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Checkbox
} from '@mui/material';
import ApiService from '../services/ApiService';
import EmailForm from './EmailForm';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [deleteResult, setDeleteResult] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
    const [newEmployeeData, setNewEmployeeData] = useState({

        name: '',
        managerID: '',
        email: '',
        departmentID: '',
    });
    const [selectedPersons, setSelectedPersons] = useState([]);

    useEffect(() => {
        ApiService.getEmployees()
            .then((response) => setEmployees(response.data))
            .catch((error) => console.error('Error fetching employees:', error));
    }, []);

    const handleEmployeeButtonClick = (employee) => {
        setSelectedEmployee(employee);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setDeleteResult(null);
        setSelectedEmployee(null);
    };

    const handleDeleteEmployee = () => {
        ApiService.deleteEmployee(selectedEmployee.id)
            .then(() => {
                setEmployees(employees.filter((emp) => emp.id !== selectedEmployee.id));
                setDeleteResult('Employee deleted successfully.');
                handleDialogClose();
            })
            .catch((error) => {
                console.error('Error deleting employee:', error);
                setDeleteResult('Error deleting employee.');
            });
    };

    const handleAddDialogClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setIsAddDialogOpen(false);
        setNewEmployeeData({

            name: '',
            managerID: '',
            email: '',
            departmentID: '',
        });
    };

    const handleAddEmployee = () => {
        ApiService.addEmployee(newEmployeeData)
            .then((response) => {
                setEmployees([...employees, response.data]);
                setIsAddDialogOpen(false);
                setNewEmployeeData({

                    name: '',
                    managerID: '',
                    email: '',
                    departmentID: '',
                });
            })
            .catch((error) => console.error('Error adding employee:', error));
    };

    const handleShowInfoClick = async (employee) => {
        try {
            const response = await ApiService.getEmployee(employee.id);
            setSelectedEmployee(employee);
            setIsInfoDialogOpen(true);
            // You can use response.data to display additional employee details
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const handleInfoDialogClose = () => {
        setIsInfoDialogOpen(false);
        setSelectedEmployee(null);
    };

    const handleSelectPerson = (employee) => {
        setSelectedPersons((prevSelected) => {
            if (prevSelected.includes(employee)) {
                return prevSelected.filter((selectedPerson) => selectedPerson !== employee);
            } else {
                return [...prevSelected, employee];
            }
        });
    };

    const handleSendEmailClick = () => {
        if (selectedPersons.length > 0) {
            // Deschide formularul EmailForm cu angajații selectați
            // Pasează prop-ul onClose pentru a gestiona închiderea formularului
            setIsEmailFormOpen(true);
        } else {
            console.warn('No persons selected for email');
        }
    };
    const handleSendEmail = (subject, message) => {
        // Implementează aici logica pentru a trimite e-mailurile
        // Folosește subiectul și mesajul așa cum este necesar
        console.log('Subject:', subject);
        console.log('Message:', message);
        // Aici poți adăuga logica pentru a trimite efectiv e-mailul
        // Poți utiliza o librărie pentru gestionarea trimiterii de e-mailuri sau o altă metodă corespunzătoare
    };

    const resetSelectedPersons = () => {
        setSelectedPersons([]);
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button variant="contained" style={{ backgroundColor: '#d76c6c' , marginRight: '10px',  borderRadius: '10px'}} onClick={handleAddDialogClick}>
                    Add Employee
                </Button>
                <Button variant="contained" style={{ backgroundColor: '#d76c6c' , borderRadius: '10px' }} onClick={handleSendEmailClick}>
                    Send Email to Selected
                </Button>
            </Grid>
            {isEmailFormOpen && (
                <EmailForm
                    selectedPersons={selectedPersons}
                    onClose={() => {
                        setIsEmailFormOpen(false);
                        resetSelectedPersons();
                    }}
                    onSendEmail={handleSendEmail}
                    resetSelectedPersons={resetSelectedPersons}
                />
            )}


            {employees.map((employee) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
                    <Card>
                        <CardContent >
                            <Typography variant="h6" gutterBottom>
                                {employee.name}
                            </Typography>
                            <Button variant="outlined" style={{ borderColor: '#265364',color: '#265364', marginBottom: '10px' }} onClick={() => handleShowInfoClick(employee)}>
                                Show All Info
                            </Button>
                            <Button variant="outlined"  style={{ borderColor: '#b00c0c',color: '#b00c0c', marginBottom: '10px' }} onClick={() => handleEmployeeButtonClick(employee)}>
                                Delete Employee
                            </Button>
                            <Checkbox checked={selectedPersons.includes(employee)} onChange={() => handleSelectPerson(employee)} />
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Employee</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the employee?</Typography>
                    <Typography>{selectedEmployee?.name}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: '#100101' }} onClick={handleDialogClose}>Cancel</Button>
                    <Button style={{ color: '#b00c0c' }} onClick={handleDeleteEmployee}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose}>
                <DialogTitle>Add Employee</DialogTitle>
                <DialogContent>

                    <TextField
                        label="Department ID"
                        fullWidth
                        value={newEmployeeData.departmentID}
                        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, departmentID: e.target.value })}
                    />
                    <TextField
                        label="Name"
                        fullWidth
                        value={newEmployeeData.name}
                        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })}
                    />
                    <TextField
                        label="Manager ID"
                        fullWidth
                        value={newEmployeeData.managerID}
                        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, managerID: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        value={newEmployeeData.email}
                        onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: '#100101' }} onClick={handleAddDialogClose}>Cancel</Button>
                    <Button style={{ color: '#b00c0c' }} onClick={handleAddEmployee}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isInfoDialogOpen} onClose={handleInfoDialogClose}>
                <DialogTitle>{selectedEmployee?.name || ''} </DialogTitle>
                <DialogContent>
                    <Typography>ID: {selectedEmployee?.id}</Typography>
                    <Typography>Manager ID: {selectedEmployee?.managerID}</Typography>
                    <Typography>Email: {selectedEmployee?.email}</Typography>
                    {/* Add more details about the employee here */}
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: '#100101' }} onClick={handleInfoDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>


        </Grid>
    );
};

export default EmployeeList;