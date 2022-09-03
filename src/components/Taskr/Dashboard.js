import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';

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
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}
