import React, { useEffect, useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './LandingPage.scss';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';

export default function LandingPage() {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const { logOut, user } = useUserAuth();
	const navigate = useNavigate();

	useEffect(() => {
		function checkForLogin() {
			if (user) {
				navigate('/dashboard');
			}
		}
		checkForLogin();
	}, []);

	function loginPopup() {
		setModal(!modal);
	}
	function signupPopup() {
		setModal2(!modal2);
	}

	return (
		<div className="landingPage">
			<div className="leftSide">
				<img className="logo" src="./white-logo-only.png" alt="" />
			</div>
			<div className="rightSide">
				<div className="task">
					<h1>Welcome to Taskr</h1>
					<button className="btn-modal" onClick={loginPopup}>
						Login
					</button>
					<button className="btn-modal" onClick={signupPopup}>
						SignUp
					</button>
				</div>
			</div>
			{modal && (
				<div className="modal">
					<div className="overlay">
						<div className="modal-content">
							<div className="close" onClick={loginPopup}></div>
							<Login />
						</div>
					</div>
				</div>
			)}
			{modal2 && (
				<div className="modal">
					<div className="overlay">
						<div className="modal-content">
							<div className="close" onClick={signupPopup}></div>
							<Signup />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
