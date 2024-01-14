// src/components/DepartmentList.js
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Button,
    Typography,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField, ListItemText, ListItem, List,
} from '@mui/material';
import ApiService from '../services/ApiService';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [deleteResult, setDeleteResult] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const [newDepartmentData, setNewDepartmentData] = useState({
        description: '',
        parentID: '',
        managerID: '',
    });

    const [managers, setManagers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isManagersDialogOpen, setIsManagersDialogOpen] = useState(false);
    const [isEmployeesDialogOpen, setIsEmployeesDialogOpen] = useState(false);

    const openManagersDialog = () => {
        setIsManagersDialogOpen(true);
    };

    const closeManagersDialog = () => {
        setIsManagersDialogOpen(false);
    };

    const openEmployeesDialog = () => {
        setIsEmployeesDialogOpen(true);
    };

    const closeEmployeesDialog = () => {
        setIsEmployeesDialogOpen(false);
    };

    useEffect(() => {
        ApiService.getDepartments()
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));
    }, []);

    const handleDepartmentButtonClick = (department) => {
        setSelectedDepartment(department);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setDeleteResult(null);
        setSelectedDepartment(null);
    };

    const handleDeleteDepartment = () => {
        ApiService.deleteDepartment(selectedDepartment.departmentID)
            .then(() => {
                setDepartments(departments.filter(dep => dep.departmentID !== selectedDepartment.departmentID));
                setDeleteResult('Department deleted successfully.');
                handleDialogClose();
            })
            .catch(error => {
                console.error('Error deleting department:', error);
                setDeleteResult('Error deleting department.');
            });
    };

    const handleAddDialogClick = () => {
        setIsAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setIsAddDialogOpen(false);
        setNewDepartmentData({
            description: '',
            parentID: '',
            managerID: '',
        });
    };

    const handleAddDepartment = () => {
        ApiService.addDepartment(newDepartmentData)
            .then(response => {
                setDepartments([...departments, response.data]);
                setIsAddDialogOpen(false);
                setNewDepartmentData({
                    description: '',
                    parentID: '',
                    managerID: '',
                });
            })
            .catch(error => console.error('Error adding department:', error));
    };

    const handleShowInfoClick = (department) => {
        setSelectedDepartment(department);
        setIsInfoDialogOpen(true);
    };

    const handleInfoDialogClose = () => {
        setIsInfoDialogOpen(false);
        setSelectedDepartment(null);
    };

    const handleGetManagersByDepartment = async (departmentID) => {
        try {
            const managers = await ApiService.getAllManagersByDepartment(departmentID);
            setManagers(managers);
            openManagersDialog();
        } catch (error) {
            console.error('Error getting managers by department:', error);
        }
    };

    const handleGetEmployeesByDepartment = async (departmentID) => {
        try {
            const employees = await ApiService.getAllEmployeesByDepartment(departmentID);
            setEmployees(employees);
            openEmployeesDialog();
        } catch (error) {
            console.error('Error getting employees by department:', error);
        }
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button variant="contained" style={{ backgroundColor: '#d76c6c',  borderRadius: '10px' }} onClick={handleAddDialogClick}>
                    Add Department
                </Button>

            </Grid>
            {departments.map(department => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={department.departmentID}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {department.description}
                            </Typography>

                            <Button
                                variant="outlined"
                                style={{ borderColor: '#265364',color: '#265364' , marginBottom: '10px'}}
                                onClick={() => handleShowInfoClick(department)}
                            >
                                Show All Info
                            </Button>
                            <Button
                                variant="outlined"
                                style={{borderColor: '#42854f', color: '#42854f' , marginBottom: '10px' }}
                                onClick={() => handleGetManagersByDepartment(department.departmentID)}
                            >
                                Get Managers
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ borderColor: '#42854f', color: '#42854f', marginBottom: '10px' }}
                                onClick={() => handleGetEmployeesByDepartment(department.departmentID)}
                            >
                                Get Employees
                            </Button>
                            <Button
                                variant="outlined"
                                style={{ borderColor: '#b00c0c',color: '#b00c0c', marginBottom: '10px' }}
                                onClick={() => handleDepartmentButtonClick(department)}
                            >
                                Delete Department
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                {}
                <DialogTitle>Delete Department</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the department?</Typography>
                    <Typography>{selectedDepartment?.description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: '#100101' }} onClick={handleDialogClose}>Cancel</Button>
                    <Button style={{ color: '#b00c0c' }} onClick={handleDeleteDepartment}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose}>
                {}
                <DialogTitle>Add Department</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Description"
                        fullWidth
                        value={newDepartmentData.description}
                        onChange={(e) => setNewDepartmentData({ ...newDepartmentData, description: e.target.value })}
                    />
                    <TextField
                        label="Parent ID"
                        fullWidth
                        value={newDepartmentData.parentID}
                        onChange={(e) => setNewDepartmentData({ ...newDepartmentData, parentID: e.target.value })}
                    />
                    <TextField
                        label="Manager ID"
                        fullWidth
                        value={newDepartmentData.managerID}
                        onChange={(e) => setNewDepartmentData({ ...newDepartmentData, managerID: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: '#100101' }} onClick={handleAddDialogClose}>Cancel</Button>
                    <Button style={{ color: '#b00c0c' }} onClick={handleAddDepartment}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isInfoDialogOpen} onClose={handleInfoDialogClose}>
                <DialogTitle>{selectedDepartment?.description || ''} - All Info</DialogTitle>
                <DialogContent>
                    <Typography>Department ID: {selectedDepartment?.departmentID}</Typography>
                    <Typography>Parent ID: {selectedDepartment?.parentID}</Typography>
                    <Typography>Manager ID: {selectedDepartment?.managerID}</Typography>
                    {}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleInfoDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* Managers Dialog */}
            <Dialog open={isManagersDialogOpen} onClose={closeManagersDialog}>
                <DialogTitle>Managers in Department</DialogTitle>
                <DialogContent>
                    <List>
                        {managers.map(manager => (
                            <ListItem key={manager.id}>
                                <ListItemText primary={manager.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeManagersDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Employees Dialog */}
            <Dialog open={isEmployeesDialogOpen} onClose={closeEmployeesDialog}>
                <DialogTitle>Employees in Department</DialogTitle>
                <DialogContent>
                    <List>
                        {employees.map(employee => (
                            <ListItem key={employee.id}>
                                <ListItemText primary={employee.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button style={{ color: '#100101' }} onClick={closeEmployeesDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default DepartmentList;
