import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Authentication/LandingPage';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { useUserAuth } from './context/UserAuthContext';
import ProtectedRoute from './Authentication/ProtectedRoute';
import Dashboard from './Taskr/Dashboard';
import Project from './Taskr/Project';

function App() {
	const user = useUserAuth();

	return (
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
							path="/Project/:projec.id"
							element={
								<ProtectedRoute>
									<Project />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</UserAuthContextProvider>
			</Router>
		</div>
	);
}

export default App;
