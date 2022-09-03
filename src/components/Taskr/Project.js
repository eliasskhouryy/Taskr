import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Project = () => {
	let { id } = useParams();
	const [AddItem, setAddItem] = useState([]);
	const [Brain, setBrain] = useState(['CHicken', 'Eggs']);
	const [Ongoing, setOngoing] = useState([]);
	const [Completed, setCompleted] = useState([]);
	const projectsRef = collection(db, 'projects');
	const [projectDetails, setProjectDetails] = useState([]);

	useEffect(() => {
		const getProjectDetails = async () => {
			const data = await getDocs(projectsRef);
			setProjectDetails(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
		};
		getProjectDetails();
	}, []);
	console.log(id);

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
        <DndProvider backend={HTML5Backend}>
            <div className="newProject">
                {projectDetails.map((project) => {
                    return <h1>{project.id === id ? project.title : ''}</h1>;
                })}
                <div className="tasks">
                    <div className="header">
                        <form onSubmit={() => setBrain(Brain)}>
                            <input placeholder="Brainstorming" />
                            <button type="submit">Add Idea</button>
                        </form>
                    </div>
                    <div className="header">
                        <form onSubmit={() => setAddItem(AddItem)}>
                            <input placeholder="New Task" />
                            <button type="submit">Add Task</button>
                        </form>
                    </div>
                    <div className="header">
                        <form onSubmit={() => setOngoing(Ongoing)}>
                            <input placeholder="On going Task" />
                            <button type="submit">Add ongoing Task</button>
                        </form>
                    </div>
                    <div className="header">
                        <form onSubmit={() => setCompleted(Completed)}>
                            <input placeholder="Finished Task" />
                            <button type="submit">Add Completed Tasks</button>
                        </form>
                    </div>
                </div>
            </div>
        </DndProvider>
	);
};

export default Project;
