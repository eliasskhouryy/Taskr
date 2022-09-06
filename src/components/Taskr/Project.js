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
	const [allTasks, setTasks] = useState([]);
	const tasksRef = collection(db, 'tasks');
	const [projectDetails, setProjectDetails] = useState([]);
	const [board, setBoard] = useState([]);

	useEffect(
		() =>
			onSnapshot(collection(db, 'tasks'), (snapshot) => {
				const tasks = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
				setTasks(tasks);
				window.TASKS = tasks;
			}),
		[]
	);
	useEffect(() => onSnapshot(collection(db, 'projects'), (snapshot) => setProjectDetails(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))), []);

	const handleDelete = async (id) => {
		const projectsRef = doc(db, 'tasks', id);
		try {
			await deleteDoc(projectsRef);
		} catch (err) {
			alert(err);
		}
	};
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'task',
		drop: (item) => addTaskToDone(item.id),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	const addTaskToDone = (id) => {
		handleDelete(id);
		const taskList = window.TASKS.filter((task) => (task.id === id ? task.id : ''));
		setBoard((board) => [...board, ...taskList]);
		// await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false });
	};

	const addTask = async (e) => {
		e.preventDefault();
		await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false });
		setTitle('');
		setComment('');
	};

	//    const removeFromTasks = () => {
	//     const checkBoard = board.filter((task1) => (console.log(task1.id)));
	//     const checkTasks = window.TASKS.filter((task2) => (console.log(task2.id)));

	//    }
	//    removeFromTasks()

	return (
		<div className="newProject">
			<NavBar mainTitle={'Project'} />

			{projectDetails.map((project) => {
				return <h1>{project.id === id ? project.title : ''}</h1>;
			})}
			<div>
				{allTasks.map((task) => {
					if (id === task.projectId) {
						return <Task task={task} />;
					}
				})}
				<div className="addTask">
					<h2>Add a new Task </h2>
					<input value={title} type="text" onChange={(e) => setTitle(e.target.value)} placeholder="task title" required />
					<textarea value={comment} type="text" onChange={(e) => setComment(e.target.value)} placeholder="comment" />
					<button onClick={addTask}>add</button>
				</div>
			</div>
			<div className="done" ref={drop}>
				{board.map((task) => {
					return (
						<div className="task" key={task.id} id={task.id}>
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

const Task = ({ task }) => {
	const handleDelete = async (id) => {
		const projectsRef = doc(db, 'tasks', id);
		try {
			await deleteDoc(projectsRef);
		} catch (err) {
			alert(err);
		}
	};
	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'task',
		item: { id: task.id },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	return (
		<div>
			<div className="test">
				<div className="task" key={task.id} ref={drag} id={task.id}>
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
			</div>
		</div>
	);
};

export default Project;
