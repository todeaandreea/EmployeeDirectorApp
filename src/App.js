// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import DepartmentList from './components/DepartmentList';
import EmployeeList from './components/EmployeeList';
import EmailForm from './components/EmailForm';
import Login from './components/Login';
import './App.css';

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleLogin = (username) => {
        setLoggedInUser(username);
    };

    const handleLogout = () => {
        setLoggedInUser(null);
    };

    return (
        <Router>
            <div className="app-container">
                <header>
                    <h1>Employee Track</h1>
                </header>
                <div className="main-container">
                    {loggedInUser ? (
                        <>
                            <nav>
                                <ul>
                                    <li>
                                        <button onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </nav>

                            <hr />

                            <div className="content">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/departments" element={<DepartmentListContainer />} />
                                    <Route path="/employees" element={<EmployeeListContainer />} />
                                    <Route path="/send-email" element={<EmailForm />} />
                                </Routes>
                            </div>
                        </>
                    ) : (
                        <Login onLogin={handleLogin} />
                    )}
                </div>
            </div>
        </Router>
    );
};

const Home = () => (
    <div className="home-container">
        <h2>Welcome to Employee Track! You have 2 options: </h2>
        <div className="button-container">
            <Link to="/departments" className="left-button">
                <button>View Departments</button>
            </Link>
            <Link to="/employees" className="right-button">
                <button>View Employees</button>
            </Link>
        </div>
    </div>
);


const BackButton = () => (
    <div>
        <Link to="/">
            <button>Back to Home</button>
        </Link>
    </div>
);

const DepartmentListContainer = () => (
    <>
        <BackButton />
        <DepartmentList />
    </>
);

const EmployeeListContainer = () => (
    <>
        <BackButton />
        <EmployeeList />
    </>
);

export default App;
