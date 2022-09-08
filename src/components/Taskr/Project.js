import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import NavBar from './NavBar';
import './project.scss';
import PacmanLoader from 'react-spinners/PacmanLoader';
import _ from 'underscore';

function Project() {
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1900);
	}, []);

	let { id } = useParams();
	const { logOut, user } = useUserAuth();
	const [title, setTitle] = useState('');
	const [comment, setComment] = useState('');
	const [allTasks, setTasks] = useState([]);
	const [chat, setChat] = useState([]);
	const [message, setMessage] = useState([]);
	const tasksRef = collection(db, 'tasks');
	const completeTasksRef = collection(db, 'completeTasks');
	const chatRef = collection(db, 'chat');
	const [projectDetails, setProjectDetails] = useState([]);
	const [completeTasks, setCompleteTasks] = useState([]);
	const [modal, setModal] = useState(false);
	const inProcessRef = collection(db, 'inProcess');
	const [inProcess, setInProcess] = useState(['ehde']);

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
	useEffect(() => onSnapshot(collection(db, 'completeTasks'), (snapshot) => setCompleteTasks(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))), []);
	useEffect(() => onSnapshot(collection(db, 'inProcess'), (snapshot) => setInProcess(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))), []);
	useEffect(() => onSnapshot(collection(db, 'chat'), (snapshot) => setChat(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))), []);

	const handleDelete = async (id) => { // Deletes data from database when task is being dropped
		const projectsRef = doc(db, 'tasks', id);
		try {
			await deleteDoc(projectsRef);
		} catch (err) {
			alert(err);
		}
	};
	const handleDeleteFromProcess = async (id) => {// Deletes data from database when task is being dropped
		const inProcessRef = doc(db, 'inProcess', id);
		try {
			await deleteDoc(inProcessRef);
		} catch (err) {
			alert(err);
		}
	};
	const handleDeleteFromCompleted = async (id) => {// Deletes data from database when task is being dropped
		const completedTasksRef = doc(db, 'completeTasks', id);
		try {
			await deleteDoc(completedTasksRef);
		} catch (err) {
			alert(err);
		}
	};
	const [{ isOver }, drop] = useDrop(() => ({ // dnd function
		accept: 'task',// accepts the item in thsi case task but could be called everything
		drop: (item) => addTaskToDone(item.id, item.title, item.comment),// drops the items and passes it to the function
		collect: (monitor) => ({ // monitors for example the x and y possition when its being collected and truns null when dropped
			isOver: !!monitor.isOver(),
		}),
	}));

	const [{ isOver1 }, drop1] = useDrop(() => ({// dnd function
		accept: 'task',// accepts the item in thsi case task but could be called everything
		drop: (item) => addTaskToInProcess(item.id, item.title, item.comment),// drops the items and passes it to the function
		collect: (monitor) => {// monitors for example the x and y possition when its being collected and truns null when dropped
			return { isOver: !!monitor.isOver() };
		},
	}));
	const [{ isOver2 }, drop2] = useDrop(() => ({// dnd function
		accept: 'task',// accepts the item in thsi case task but could be called everything
		drop: (item) => addTaskToToDo(item.id, item.title, item.comment),// drops the items and passes it to the function
		collect: (monitor) => ({// monitors for example the x and y possition when its being collected and truns null when dropped
			isOver: !!monitor.isOver(),
		}),
	}));

	const addTaskToDone = async (taskId, title, comment) => { // adding task to container with the values in argument
		console.log('done');
		await handleDeleteFromProcess(taskId); // deletes task from Process when its dropped on Complete
		await handleDeleteFromCompleted(taskId);// deletes task from Complete when its dropped on Complete
		await handleDelete(taskId);// deletes task from task/ToDo when its dropped on Complete
		await addDoc(completeTasksRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });// adds new task for this container into firebase
	};
	const addTaskToInProcess = async (taskId, title, comment) => {// adding task to container with the values in argument
		console.log('process');
		await handleDeleteFromCompleted(taskId);// deletes task from Complete when its dropped on Process
		await handleDeleteFromProcess(taskId);// deletes task from Process when its dropped on Process
		await handleDelete(taskId);// deletes task from tasks/ToDo when its dropped on Process
		await addDoc(inProcessRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });// adds new task for this container into firebase
	};
	const addTaskToToDo = async (taskId, title, comment) => {// adding task to container with the values in argument
		console.log('todo');
		await handleDeleteFromCompleted(taskId);// deletes task from Completed when its dropped on tasks/ToDo
		await handleDeleteFromProcess(taskId);// deletes task from Process when its dropped on tasks/ToDo
		await handleDelete(taskId);// deletes task from tasks/ToDo when its dropped on tasks/ToDo

		await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });// adds new task for this container into firebase
	};

	const addTask = async (e) => {
		e.preventDefault(); // keeps you on same page when you add a task on submit button
		await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });// adds new task for this container into firebase
		setTitle(''); // empty the input field after submit
		setComment('');// empty the input field after submit
	};

	const addChat = async (e) => {
		e.preventDefault();// keeps you on same page when you add a task on submit button
		await addDoc(chatRef, { projectId: id, message: message, userEmail: user.email, time: new Date().getTime() }); // saves the messages in chat
		setMessage('');// empty the input field after submit
	};

	return (
		<div className="projectBody">
			{loading ? ( // while data is lodaing from database, pacman comes up as a loading sign
				<div className="pacman">
					<PacmanLoader size="50" color="#6236d6" />
				</div>
			) : (
				<div> 
					{projectDetails.map((project) => (project.id === id ? <NavBar mainTitle={project.title} /> : ''))} 

					<div className="newProject">
						<div className="addTask">
							<h2 className="h3">Tasks</h2>
							<div className="taskList" ref={drop2}> {/*  drop for dnd so that it knows where you can drop things */}
								{allTasks
									.sort((objA, objB) => Number(objA.time) - Number(objB.time)) // sorts tasks by its timestamp
									.map((task) => {// maps put all tasks from this div and shows them
										if (id === task.projectId) { // id had to match project id to show up
											return (
												<div className="listTask"> {/* container for the tasks */}
													<Task task={task} />
												</div>
											);
										}
									})}
							</div>
							<div className="taskForm">
								<h3>Add a new Task </h3>
								<input required value={title} type="text" onChange={(e) => setTitle(e.target.value)} placeholder="task title" />
								<textarea value={comment} type="text" onChange={(e) => setComment(e.target.value)} placeholder="comment" />
								<button onClick={addTask}>Add</button>
							</div>
						</div>
						<div className="progress">
							<h2>In Progress</h2>
							<div className="donely taskList" ref={drop1}>{/*  drop for dnd so that it knows where you can drop things */}
								{inProcess
									.sort((objA, objB) => Number(objA.time) - Number(objB.time))// sorts tasks by its timestamp
									.map((task) => // maps put all tasks from this div and shows them
										id === task.projectId ? (// id had to match project id to show up
											<div className="listTask task"> {/* container for the tasks */}
												<Process task={task} />
											</div>
										) : (
											''
										)
									)}
							</div>
						</div>
						<div className="done">
							<h2>Completed</h2>
							<div className="donely" ref={drop}> {/*  drop for dnd so that it knows where you can drop things */}
								{completeTasks
									.sort((objA, objB) => Number(objA.time) - Number(objB.time))// sorts tasks by its timestamp
									.map((task) =>// maps put all tasks from this div and shows them
										id === task.projectId ? (// id had to match project id to show up
											<div className="task"> {/* container for the tasks */}
												<Complete task={task} />
											</div>
										) : (
											''
										)
									)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

const Task = ({ task }) => {
	const handleDelete = async (id) => { // delete function to make it possible to delete tasks in the ToDo list
		const projectsRef = doc(db, 'tasks', id);
		try {
			await deleteDoc(projectsRef);
		} catch (err) {
			alert(err);
		}
	};
	const [{ isDragging }, drag] = useDrag(() => ({ // if user picks up an item it takes the id, title, comment and saves it in item and passes it on to the drop function
		type: 'task',
		item: { id: task.id, title: task.title, comment: task.comment },
		collect: (monitor) => {
			return {
				isDragging: !!monitor.isDragging(),
			};
		},
	}));

	return ( //returns each task in its div and is referenced as drag
		<div key={task.id} ref={drag} id={task.id}>
			<h3>{task.title}</h3>
			<p>{task.comment}</p>
			<div
				className="close"
				onClick={() => {
					handleDelete(task.id);
				}}
			></div>
		</div>
	);
};
const Process = ({ task }) => {
	const [{ isDragging }, drag] = useDrag(() => ({ // if user picks up an item it takes the id, title, comment and saves it in item and passes it on to the drop function
		type: 'task',
		item: { id: task.id, title: task.title, comment: task.comment },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	return ( //returns each task in its div and is referenced as drag
		<div key={task.id} ref={drag} id={task.id}>
			<h3>{task.title}</h3>
			<p>{task.comment}</p>
		</div>
	);
};
const Complete = ({ task }) => {
	const [{ isDragging }, drag] = useDrag(() => ({// if user picks up an item it takes the id, title, comment and saves it in item and passes it on to the drop function
		type: 'task',
		item: { id: task.id, title: task.title, comment: task.comment },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	return ( //returns each task in its div and is referenced as drag
		<div key={task.id} ref={drag} id={task.id}>
			<h3>{task.title}</h3>
			<p>{task.comment}</p>
		</div>
	);
};

export default Project;