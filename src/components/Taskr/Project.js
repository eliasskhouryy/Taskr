import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';
import NavBar from './NavBar';
import ModeCommentRoundedIcon from '@mui/icons-material/ModeCommentRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import './project.scss';

function Project() {
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
	const [board, setBoard] = useState([]);
	const [modal, setModal] = useState(false);
	const inProcessRef = collection(db, 'inProcess');
	const [inProcess, setInProcess] = useState(["ehde"]);

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
			drop:(item) => addTaskToDone(item.id, item.title, item.comment),
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		}));

		const [{ isOver1 }, drop1] = useDrop(() => ({
			accept: 'task',
			drop:(item) => addTaskToInProcess(item.id, item.title, item.comment),
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		}));

	const addTaskToDone = async (taskId, title, comment) => {
		console.log('done')
		handleDelete(taskId);
		// const taskList = window.TASKS.filter((task) => (task.taskId === id ? task.taskId : ''));
		await addDoc(completeTasksRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });
	};
	const addTaskToInProcess = async (taskId, title, comment) => {
		console.log('process')
		handleDelete(taskId);
		// const taskList = window.TASKS.filter((task) => (task.taskId === id ? task.taskId : ''));
		await addDoc(inProcessRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });
	};


	const addTask = async (e) => {
		e.preventDefault();
		await addDoc(tasksRef, { projectId: id, title: title, comment: comment, status: false, userEmail: user.email, time: new Date().getTime() });
		setTitle('');
		setComment('');
	};

	const addChat = async (e) => {
		e.preventDefault();

		await addDoc(chatRef, { projectId: id, message: message, userEmail: user.email, time: new Date().getTime() });
		setMessage('');
	};

	return (
		<div className="projectBody">
			<NavBar mainTitle={'Project'} />

			<div className="newProject">
				<div className="addTask">
					<h2 className="h3">Tasks</h2>
					<div className="taskList">
						{allTasks
							.sort((objA, objB) => Number(objA.time) - Number(objB.time))
							.map((task) => {
								if (id === task.projectId) {
									return (
										<div className="listTask">
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
				<div className='process'>
				<h2>In Process</h2>
					<div className="donely taskList" ref={drop1}>
						{inProcess
							.sort((objA, objB) => Number(objA.time) - Number(objB.time))
							.map((task) =>
								id === task.projectId ? (
									<div className="listTask task">
											<Process task={task}  />
									</div>
								) : (
									''
								)
							)}
					</div>
				</div>
				<div className="done">
					<h2>Completed</h2>
					<div className="donely" ref={drop}>
						{completeTasks
							.sort((objA, objB) => Number(objA.time) - Number(objB.time))
							.map((task) =>
								id === task.projectId ? (
									<div className="task" key={task.id} id={task.id}>
										<h3>{id === task.projectId && task.title}</h3>
										<p>{id === task.projectId && task.comment}</p>
										<p>{id === task.projectId && task.status}</p>

										{id === task.projectId && task.userEmail ? (
											<p>
												<i>Completed by: </i> {task.userEmail}
											</p>
										) : (
											''
										)}
									</div>
								) : (
									''
								)
							)}
					</div>
				</div>
				<ModeCommentRoundedIcon className="chatButton" onClick={() => setModal(!modal)} />
				{modal && (
					<div className="chatBox">
						<div className="chatScreen">
							{chat
								.sort((objA, objB) => Number(objA.time) - Number(objB.time))
								.map((item) => {
									return (
										<div>
											{' '}
											{id === item.projectId && (
												<div>{item.userEmail === user.email ? <p className="currentUser">{item.message}</p> : <p className="otherUser">{item.message}</p>}</div>
											)}
										</div>
									);
								})}
						</div>
						<div className="chatForm">
							<form onSubmit={addChat}>
								<input value={message} onChange={(e) => setMessage(e.target.value)} required type="text" />
								<button>
									<SendRoundedIcon className="send" />
								</button>
							</form>
						</div>
					</div>
				)}
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
		item: { id: task.id, title: task.title, comment: task.comment },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));
	
	return (
		<div key={task.id} ref={drag} id={task.id}>
			<h3>{task.title}</h3>
			<p>{task.comment}</p>
			<p>
				<i>created by: </i>
				{task.userEmail}
			</p>
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
	const handleDelete = async (id) => {
		const inProcessRef = doc(db, 'inProcess', id);
		try {
			await deleteDoc(inProcessRef);
		} catch (err) {
			alert(err);
		}
	};
	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'task',
		item: { id: task.id, title: task.title, comment: task.comment },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));
	
	return (
		<div key={task.id} ref={drag} id={task.id}>
			<h3>{task.title}</h3>
			<p>{task.comment}</p>
			<p>
				<i>In Process by: </i>
				{task.userEmail}
			</p>
			<div
				className="close"
				onClick={() => {
					handleDelete(task.id);
				}}
			></div>
		</div>
	);
};

export default Project;
