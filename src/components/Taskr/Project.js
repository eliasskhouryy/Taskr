import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import NavBar from './NavBar';

import './project.scss';

function Project() {
	let { id } = useParams();
	const { logOut, user } = useUserAuth();
	const [title, setTitle] = useState('');
	const [comment, setComment] = useState('');
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const projectsRef = collection(db, 'projects');
	const tasksRef = collection(db, 'tasks');
	const [projectDetails, setProjectDetails] = useState([]);
	const [board, setBoard] = useState([]);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'task',
		item: tasks[0],
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'task',
		drop: (item) => addTaskToDone(item.id),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));
	const handleDelete = async (id) => {
		const projectsRef = doc(db, 'tasks', id);
		try {
			await deleteDoc(projectsRef);
		} catch (err) {
			alert(err);
		}
	};
	const addTaskToDone = (id) => {
		console.log(id);
		// const taskList = tasks.filter((task) => id === task.id)
		// setBoard((board) => [...board, taskList[0]])
	};

	const addTask = async (e) => {
		e.preventDefault();
		await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false });
		setTitle('');
		setComment('');
	};

	useEffect(
		() => onSnapshot(collection(db, 'tasks'), (snapshot) => setTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))),

		() => onSnapshot(collection(db, 'projects'), (snapshot) => setProjectDetails(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))),
		[]
	);

	return (
		<div className="newProject">
			<NavBar />
			{projectDetails.map((project) => {
				return <h1>{project.id === id ? project.title : ''}</h1>;
			})}
			<div>
				{tasks.map((task) => {
					if (id === task.projectId) {
						return (
							<div className="task" key={task.id} ref={drag} id={task.id} setBoard={task.id}>
								<h3>{task.title}</h3>
								<p>{task.comment}</p>
								<p>{task.status}</p>
								<div
									className="close"
									onClick={() => {
										handleDelete(task.id);
									}}
								></div>
							</div>
						);
					}
				})}

				<div className="addTask">
					<h2>Add a new Task </h2>
					<form onSubmit={addTask}>
						<input required value={title} type="text" onChange={(e) => setTitle(e.target.value)} placeholder="task title" required />
						<textarea required value={comment} type="text" onChange={(e) => setComment(e.target.value)} placeholder="comment" />
						<button>add</button>
					</form>
				</div>
			</div>
			<div className="done" ref={drop}>
				{board.map((task) => {
					return (
						<div key={task.id} id={task.id}>
							<h3>{task.title}</h3>
							<p>{task.comment}</p>
							<p>{task.status}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Project;
