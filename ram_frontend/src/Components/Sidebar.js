import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { categories } from '../utils/data';

import { logo, logoWhite, logoBlack } from '../assets';
import { AiOutlineLogout } from 'react-icons/ai';

const isNotActiveStyle =
	'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
	'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize bg-white';

// const categories = [
// 	{ name: 'Animals' },
// 	{ name: 'Wallpapers' },
// 	{ name: 'Photography' },
// 	{ name: 'Gaming' },
// 	{ name: 'Coding' },
// 	{ name: 'Other' },
// ];

const Sidebar = ({ user, closeToggle }) => {
	const navigate = useNavigate();

	const handleCloseSidebar = () => {
		if (closeToggle) closeToggle(false);
	};

	const logoutUser = () => {
		localStorage.clear();
		window.location.reload();
	};

	return (
		<div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar '>
			<div className='flex flex-col'>
				<div className='shadow-md mb-7 '>
					<Link
						to='/'
						className='flex px-5 gap-2 my-6 pt-1 w-275 items-center'
						onClick={handleCloseSidebar}>
						<img src={logoBlack} alt='Logo' className='w-full' />
					</Link>
				</div>
				<div className='flex flex-col gap-5'>
					<NavLink
						to='/'
						onClick={handleCloseSidebar}
						className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className='mt-2 px-5 text-lg 2xl:text-xl font-bold'>Discover Categories</h3>
					{categories.slice(0, categories.length - 1).map((category) => (
						<NavLink
							onClick={handleCloseSidebar}
							to={`category/${category.name}`}
							className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
							key={category.name}>
							<img
								src={category.image}
								alt={`${category.name}'s Image`}
								className='w-10 h-10 rounded-full object-cover'
							/>
							{category.name}
						</NavLink>
					))}
				</div>
			</div>
			{user && (
				<div>
					<h3 className='mt-10 mb-3 px-5 text-lg 2xl:text-xl font-bold'>Your Details</h3>
					<Link
						to={`user-profile/${user._id}`}
						onClick={handleCloseSidebar}
						className='flex gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3'>
						<img src={user.image} alt='User Logo' className='w-10 h-10 rounded-full' />
						<p>{user.userName}</p>

						<GoogleLogout
							clientId={process.env.REACT_APP_GOOGLE_API}
							render={(renderProps) => (
								<button
									type='button'
									onClick={renderProps.onClick}
									disabled={renderProps.disabled}
									className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md flex gap-2 items-center justify-start'>
									<AiOutlineLogout color='red' />
								</button>
							)}
							onLogoutSuccess={logoutUser}
							cookiePolicy='single_host_origin'
						/>
					</Link>
				</div>
			)}
		</div>
	);
};

export default Sidebar;
