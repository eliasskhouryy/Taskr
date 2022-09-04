import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import GoogleButton from 'react-google-button';
import './forms.scss';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { logIn, googleSignIn } = useUserAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		//async function to call the function login once the page is loaded
		e.preventDefault();
		setError('');
		try {
			await logIn(email, password);
			navigate('/dashboard');
		} catch (err) {
			setError(err.message);
		}
	};

	const handleGoogleSignIn = async (e) => {
		//Special firebase function that handles the google button login
		e.preventDefault();
		try {
			await googleSignIn();
			navigate('/dashboard');
		} catch (error) {
			console.log(error.message);
		}
	};
	// this form will handle the login in combination with the google login
	return (
		<div>
			<div className="formContainer">
				<h2>Login</h2>
				{error && <Alert variant="danger">{error}</Alert>}
				<form onSubmit={handleSubmit}>
					<input type="email" placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />

					<input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

					<div className="d-grid gap-2">
						<button variant="primary" type="Submit">
							Log In
						</button>
					</div>
				</form>
				<hr />
				<div>
					<GoogleButton className="g-btn" type="dark" onClick={handleGoogleSignIn} />
				</div>
			</div>
		</div>
	);
};

export default Login;
