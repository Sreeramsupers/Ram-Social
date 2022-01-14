import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Container/Home';

const App = () => {
	const navigate = useNavigate();
	useEffect(() => {
		const User =
			localStorage.getItem('user') !== 'undefined'
				? JSON.parse(localStorage.getItem('user'))
				: localStorage.clear();

		if (!User) navigate('/login');
	}, []);
	return (
		<Routes>
			<Route path='login' element={<Login />} />
			<Route path='/*' element={<Home />} />
		</Routes>
	);
};

export default App;
