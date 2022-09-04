import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDrag } from 'react-dnd';
import { useDrop } from 'react-dnd';


import './project.scss';

function Project(){
	let { id } = useParams();
	const { logOut, user } = useUserAuth();
	const [title, setTitle] = useState('');
	const [comment, setComment] = useState('');
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState('');
	const projectsRef = collection(db, 'projects');
	const tasksRef = collection(db, 'tasks');
	const [projectDetails, setProjectDetails] = useState([]);
    const [board,setBoard] = useState([])


    
    const [{isDragging}, drag] = useDrag(() => ({
        type:"task",
        item: {id: tasks[0]},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })    
    }))
    
    const [{isOver},drop] = useDrop(() => ({
        accept: "task",
        drop: (item) => addTaskToDone(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),

        })
    }))
    
    const addTaskToDone = (id) => {
        console.log(id)
        // const taskList = tasks.filter((task) => id === task.id)
        // setBoard((board) => [...board, taskList[0]])
    }

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

	return (
            <div className="newProject">
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
                <div className='done' ref={drop}>
                    {board.map((task) => {
                        return  (
                            <div key={task.id} id={task.id}>
                                <h3>{task.title}</h3>
                                    <p>{task.comment}</p>
                                    <p>{task.status}</p>
                            </div>
                        )
                    })}    
                </div>
            </div> 
	);
};

export default Project;
