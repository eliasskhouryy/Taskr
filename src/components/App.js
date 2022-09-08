import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Authentication/LandingPage';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { useUserAuth } from './context/UserAuthContext';
import ProtectedRoute from './Authentication/ProtectedRoute';
import Dashboard from './Taskr/Dashboard';
import Project from './Taskr/Project';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GroupProject from './Taskr/GroupProject';

function App() {
	const user = useUserAuth();

	return (
		<DndProvider debugMode={true} backend={HTML5Backend}>
			<div className="App">
				<Router>
					<UserAuthContextProvider>
						<Routes>
							<Route exact path="/" element={<LandingPage />} />
							<Route />
							<Route
								path="/dashboard"
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/Project/:id"
								element={
									<ProtectedRoute>
										<Project />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/GroupProject/:id"
								element={
									<ProtectedRoute>
										<GroupProject />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</UserAuthContextProvider>
				</Router>
			</div>
		</DndProvider>
	);
}

export default App;
