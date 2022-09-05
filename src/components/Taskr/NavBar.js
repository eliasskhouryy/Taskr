import React from 'react';
import './nav.scss';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';

export default function NavBar({ mainTitle }) {
	const { logOut, user } = useUserAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logOut();
			navigate('/');
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<nav>
			<img className="logo" src="/logo-with-title.png" alt="" onClick={() => navigate('/dashboard')} />
			<h1>{mainTitle}</h1>
			<a onClick={handleLogout}>Logout</a>
		</nav>
	);
}
