import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import './forms.scss';

const Signup = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const { signUp } = useUserAuth();
	let navigate = useNavigate();

	const handleSubmit = async (e) => {
		//hangles the sign up form and sends the data back to firebase with the "signUp" firebase function
		e.preventDefault();
		setError('');
		if (password !== confirm) {
			alert('passwords do not match');
			return;
		}
		try {
			await signUp(email, password);
			navigate('/');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div>
			<div className="formContainer">
				<h2>Signup</h2>
				{error && <Alert variant="danger">{error}</Alert>}
				<form onSubmit={handleSubmit}>
					<input type="email" required placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />

					<input type="password" required placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
					<input type="password" required placeholder="Confirm Password" onChange={(e) => setConfirm(e.target.value)} />

					<div className="d-grid gap-2">
						<button variant="primary" type="Submit">
							Sign up
						</button>
					</div>
				</form>
				<br />
			</div>
		</div>
	);
};

export default Signup;
