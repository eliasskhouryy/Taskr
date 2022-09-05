import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

import '../Authentication/LandingPage.scss';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import './dashboard.scss';
import '../Authentication/forms.scss';

export default function Dashboard() {
	const [projectDetails, setProjectDetails] = useState([]);
	const { logOut, user } = useUserAuth();
	const navigate = useNavigate();
	const projectsRef = collection(db, 'projects');
	const [modal, setModal] = useState(false);
	const [project, setProject] = useState('');

	const addProject = async (e) => {
		e.preventDefault();
		await addDoc(projectsRef, { userId: user.uid, title: project });
		setModal(!modal);
	};

	useEffect(
		() => onSnapshot(collection(db, 'projects'), (snapshot) => setProjectDetails(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))),

		[]
	);

	const handleDelete = async (id) => {
		const projectsRef = doc(db, 'projects', id);
		try {
			await deleteDoc(projectsRef);
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<div className="dashboard">
				<NavBar />

				<h1>
					My <span>Projects</span>
				</h1>

				{projectDetails.map((project) => {
					return (
						<div className="projects">
							{user.uid === project.userId && (
								<div className="projectsContainer">
									<Link to={`/project/${project.id}`}>
										<h3>{user.uid === project.userId ? project.title : ''}</h3>
									</Link>
									{user.uid === project.userId ? (
										<div
											className="close"
											onClick={() => {
												handleDelete(project.id);
											}}
										></div>
									) : (
										''
									)}
								</div>
							)}
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
									<div>
										<form onSubmit={addProject}>
											<h2>Add a new Project </h2>
											<input required type="text" onChange={(e) => setProject(e.target.value)} />
											<button>add</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<button className="btn-modal" onClick={() => setModal(!modal)}>
					Add Project
				</button>
			</div>
		</div>
	);
}
