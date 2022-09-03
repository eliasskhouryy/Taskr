import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import './project.scss';

const Project = () => {
	let { id } = useParams();
	const { logOut, user } = useUserAuth();
	const [title, setTitle] = useState('');
	const [comment, setComment] = useState('');
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const projectsRef = collection(db, 'projects');
	const tasksRef = collection(db, 'tasks');
	const [projectDetails, setProjectDetails] = useState([]);

	const addTask = async () => {
		await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false });
		window.location.reload();
	};

	useEffect(() => {
		const getProjectDetails = async () => {
			const data = await getDocs(projectsRef);
			setProjectDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		};
		getProjectDetails();
		const getTaskDetails = async () => {
			const data = await getDocs(tasksRef);
			setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		};
		getTaskDetails();
	}, []);

	const Brainstorming = (Brain) => {
		return (
			<div>
				<p>{this.state.Brain.length} Brain</p>
				{this.state.Brain.map((s) => (
					<p key={s.id}>{s.content}</p>
				))}
			</div>
		);
	};

	return (
		<div className="newProject">
			{projectDetails.map((project) => {
				return <h1>{project.id === id ? project.title : ''}</h1>;
			})}
			<div>
				{tasks.map((task) => {
					if (id === task.projectId) {
						return (
							<div className="task">
								<h3>{task.title}</h3>
								<p>{task.comment}</p>
								<p>{task.status}</p>
							</div>
						);
					}
				})}
				<div className="addTask">
					<h2>Add a new Task </h2>
					<input type="text" onChange={(e) => setTitle(e.target.value)} placeholder="task title" required />
					<textarea type="text" onChange={(e) => setComment(e.target.value)} placeholder="comment" />
					<button onClick={addTask}>add</button>
				</div>
			</div>
		</div>
	);
};

export default Project;
