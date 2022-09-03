import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function CreateProject() {
	const [project, setProject] = useState('');
	const projectsRef = collection(db, 'projects');
	const { logOut, user } = useUserAuth();

	const addProject = async () => {
		await addDoc(projectsRef, { userId: user.uid, title: project });
	};

	return (
		<div>
			<h2>Add a new Project </h2>
			<input type="text" onChange={(e) => setProject(e.target.value)} />
			<button onClick={addProject}>add</button>
		</div>
	);
}
