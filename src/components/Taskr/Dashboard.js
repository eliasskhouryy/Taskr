import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import '../Authentication/LandingPage.scss';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';
import './dashboard.scss';
import '../Authentication/forms.scss';

export default function Dashboard() {
	const [projectDetails, setProjectDetails] = useState([]);
	const [groupProjectDetails, setGroupProjectDetails] = useState([]);
	const { logOut, user } = useUserAuth();
	const navigate = useNavigate();
	const projectsRef = collection(db, 'projects');
	const groupProjectsRef = collection(db, 'groupProjects');
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [project, setProject] = useState('');
	const [description, setDescription] = useState('');
	const [otherUsers, setOtherUsers] = useState([]);
	const [groupProject, setGroupProject] = useState('');
	const [groupDescription, setGroupDescription] = useState('');

	const addProject = async (e) => {
		e.preventDefault();
		await addDoc(projectsRef, { userId: user.uid, title: project, description: description, time: new Date().getTime() });
		setModal(!modal);
	};
	const addGroupProject = async (e) => {
		e.preventDefault();
		await addDoc(groupProjectsRef, { users: [user.uid, ...[otherUsers]], title: groupProject, description: groupDescription, time: new Date().getTime() });
		setModal2(!modal2);
	};
	useEffect(
		() => onSnapshot(collection(db, 'projects'), (snapshot) => setProjectDetails(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))),

		[]
	);
	useEffect(
		() => onSnapshot(collection(db, 'groupProjects'), (snapshot) => setGroupProjectDetails(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))),

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
	const handleDelete2 = async (id) => {
		const groupProjectsRef = doc(db, 'groupProjects', id);
		try {
			await deleteDoc(groupProjectsRef);
		} catch (err) {
			alert(err);
		}
	};

	return (
		<div>
			<div className="dashboard">
				<NavBar mainTitle={'Dashboard'} />
				<h1>
					My{' '}
					<span>
						Projects <AddBoxOutlinedIcon className="btn-modal" onClick={() => setModal(!modal)} />
					</span>
				</h1>
				<div className="containing">
					{projectDetails
						.sort((objA, objB) => Number(objA.time) - Number(objB.time))
						.map((project) => {
							return (
								<div className="projects">
									{user.uid === project.userId && (
										<div className="projectsContainer">
											<Link to={`/project/${project.id}`}>
												<h3>{user.uid === project.userId ? project.title : ''}</h3>
											</Link>
											<h4>{user.uid === project.userId ? project.description : ''}</h4>
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
						})
						.reverse()}
				</div>
				<div>
					{modal && (
						<div className="modal">
							<div className="overlay">
								<div className="modal-content">
									<div className="close" onClick={() => setModal(!modal)}></div>
									<div>
										<form className="formy" onSubmit={addProject}>
											<h2>Add a new Project </h2>
											<input required placeholder="Project Title" type="text" onChange={(e) => setProject(e.target.value)} />
											<textarea required placeholder="Project Description" type="text" onChange={(e) => setDescription(e.target.value)} />
											<button>add</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				{/* //////////////////////////////////////////////////////////////////////// */}
				<h1 className="alternative">
					Collaboration{' '}
					<span>
						Projects <AddBoxOutlinedIcon className="btn-modal" onClick={() => setModal2(!modal2)} />
					</span>
				</h1>
				<div className="containing1">
					{groupProjectDetails
						.sort((objA, objB) => Number(objA.time) - Number(objB.time))
						.map((project) => {
							return (
								<div className="projects">
									{' '}
									{project.users.map((useri) =>
										user.email == useri || user.uid == useri ? (
											<div className="projectsContainer">
												<Link to={`/project/${project.id}`}>
													<h3>{user.uid == useri || user.email == useri ? project.title : ''}</h3>
												</Link>
												<h4>{user.uid == useri || user.email == useri ? project.description : ''}</h4>
												{user.uid == useri || user.email == useri ? (
													<div
														className="close"
														onClick={() => {
															handleDelete2(project.id);
														}}
													></div>
												) : (
													''
												)}
											</div>
										) : (
											''
										)
									)}
								</div>
							);
						})
						.reverse()}
				</div>
				<div>
					{modal2 && (
						<div className="modal">
							<div className="overlay">
								<div className="modal-content2">
									<div className="close" onClick={() => setModal2(!modal2)}></div>
									<div>
										<form className="formy" onSubmit={addGroupProject}>
											<h2>Add a new Project </h2>
											<input required placeholder="Project Title" type="text" onChange={(e) => setGroupProject(e.target.value)} />
											<textarea required placeholder="Project Description" type="text" onChange={(e) => setGroupDescription(e.target.value)} />
											<input required placeholder="Other Users" type="text" onChange={(e) => setOtherUsers(e.target.value)} />
											<button>add</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
