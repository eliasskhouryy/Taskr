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
			<img className="logo" src="./white-logo-with-title.png" alt="" />
			<button className="btn-modal" onClick={loginPopup}>
				Login
			</button>
			<button className="btn-modal" onClick={signupPopup}>
				SignUp
			</button>
			{modal && (
				<div className="modal">
					<div className="overlay">
						<div className="modal-content">
							<button className="close-modal" onClick={loginPopup}>
								X
							</button>
							<Login />
						</div>
					</div>
				</div>
			)}
			{modal2 && (
				<div className="modal">
					<div className="overlay">
						<div className="modal-content">
							<button className="close-modal" onClick={signupPopup}>
								X
							</button>
							<Signup />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
