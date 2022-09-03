import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import CreateProject from './CreateProject';
import '../Authentication/LandingPage.scss';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function Dashboard() {
	const [projectDetails, setProjectDetails] = useState([]);
	const { logOut, user } = useUserAuth();
	const navigate = useNavigate();
	const projectsRef = collection(db, 'projects');
	const [modal, setModal] = useState(false);

	useEffect(() => {
		const getProjectDetails = async () => {
			const data = await getDocs(projectsRef);
			setProjectDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		};
		getProjectDetails();
	}, []);

	const handleLogout = async () => {
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
			<Link to="/Project">
				<h2>Add a Project</h2>
			</Link>
			<button onClick={handleLogout}>Logout</button>
			<h2>Projects</h2>
			<button className="btn-modal" onClick={() => setModal(!modal)}>
				Add Project
			</button>

			{projectDetails.map((project) => {
				return (
					<div className="projectsContainer">
						<h3>{user.uid === project.userId ? project.title : ''}</h3>
					</div>
				);
			})}
			<div>
				{modal && (
					<div className="modal">
						<div className="overlay">
							<div className="modal-content">
								<button className="close-modal" onClick={() => setModal(!modal)}>
									X
								</button>
								<CreateProject />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
