import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function Dashboard() {
	const { logOut, user } = useUserAuth();
	const navigate = useNavigate();

	useEffect(() => {}, []);

	const handleLogout = async () => {
		// Firebase function to handle logout
		try {
			await logOut();
			navigate('/');
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div>
			<h1>Dashboard page</h1>
			<Link to='/Project'>
				<h2>Add a Project</h2>
			</Link>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}
