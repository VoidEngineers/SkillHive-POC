import { useDisclosure } from "@chakra-ui/hooks";
import React, { useEffect, useState } from "react";
import { IoReorderThreeOutline, IoCloseOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router";
import { mainu } from "./SidebarConfig";
import "./Sidebar.css";
import SearchComponent from "../SearchComponent/SearchComponent";
import { useSelector } from "react-redux";
import CreatePostModal from "../Post/Create/CreatePostModal";
import CreateReelModal from "../Create/CreateReel";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("Home");
	const [isSearchBoxVisible, setIsSearchBoxVisible] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user } = useSelector((store) => store);
	const [showDropdown, setShowDropdown] = useState(false);
	const [isCreateReelModalOpen, setIsCreateReelModalOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	// Always use expanded sidebar for better visibility
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	// Detect path changes to set active tab correctly
	useEffect(() => {
		const path = location.pathname;
		if (path === "/") setActiveTab("Home");
		else if (path === "/reels") setActiveTab("Reels");
		else if (path === "/notifications") setActiveTab("Notifications");
		else if (path === "/learning_plan") setActiveTab("Learning Plan");
		else if (path === "/learning-progress")
			setActiveTab("Learning Progress");
		// else if (path === "/about") setActiveTab("About Us");
		else if (path.includes(`/${user.reqUser?.username}`))
			setActiveTab("Profile");
	}, [location, user.reqUser]);

	// Responsive handler
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth <= 768;
			setIsMobile(mobile);
			// Only collapse on very small screens
			if (mobile && window.innerWidth < 480) {
				setIsSidebarCollapsed(true);
			} else {
				setIsSidebarCollapsed(false);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize(); // Call once on mount
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleTabClick = (tab) => {
		setActiveTab(tab);

		if (tab === "Profile") {
			navigate(`/${user.reqUser?.username}`);
		} else if (tab === "Home") {
			navigate("/");
		} else if (tab === "Create Post") {
			onOpen();
		}
		// else if (tab === "About Us") {
		//   navigate("/about");
		// }
		else if (tab === "Reels") {
			navigate("/reels");
		} else if (tab === "Create Reels") {
			handleOpenCreateReelModal();
		} else if (tab === "Notifications") {
			navigate("/notifications");
		} else if (tab === "Create Story") {
			navigate("/create-story");
		} else if (tab === "Learning Plan") {
			navigate("/learning_plan");
		} else if (tab === "Learning Progress") {
			navigate("/learning-progress");
		} else if (tab === "Search") {
			setIsSearchBoxVisible(true);
		} else {
			setIsSearchBoxVisible(false);
		}
	};

	const handleDropdown = () => {
		setShowDropdown(!showDropdown);
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate("/login");
	};

	const handleCloseCreateReelModal = () => {
		setIsCreateReelModalOpen(false);
	};

	const handleOpenCreateReelModal = () => {
		setIsCreateReelModalOpen(true);
	};

	// Animation variants
	const sidebarVariants = {
		expanded: { width: "280px", transition: { duration: 0.3 } },
		collapsed: { width: "80px", transition: { duration: 0.3 } },
	};

	const dropdownVariants = {
		open: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.2 },
		},
		closed: {
			opacity: 0,
			y: 10,
			transition: { duration: 0.2 },
		},
	};

	return (
		<>
			<motion.div
				className='sidebar-container sticky top-0 h-[100vh] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md z-10'
				variants={sidebarVariants}
				initial={isSidebarCollapsed ? "collapsed" : "expanded"}
				animate={isSidebarCollapsed ? "collapsed" : "expanded"}
			>
				<div className='flex flex-col justify-between h-full py-6 px-6'>
					{/* Top section with logo */}
					<div className='flex items-center justify-between mb-8'>
						{!isSidebarCollapsed && (
							<img
								className='h-12 object-contain'
								src='/app_logo.png'
								alt='SkillHive Logo'
							/>
						)}
						{isSidebarCollapsed && (
							<div className='flex justify-center w-full'>
								<img
									className='h-10 w-10 rounded-full object-cover'
									src='/app_logo.png'
									alt='Logo'
								/>
							</div>
						)}
					</div>

					{/* Navigation Menu */}
					<div className='flex-1 overflow-y-auto hide-scrollbar'>
						<nav className='space-y-2'>
							{mainu.map((item) => (
								<motion.div
									key={item.title}
									onClick={() => handleTabClick(item.title)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
										activeTab === item.title
											? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
											: "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
									}`}
								>
									<div className='text-xl'>
										{activeTab === item.title
											? item.activeIcon
											: item.icon}
									</div>

									{!isSidebarCollapsed && (
										<span
											className={`ml-3 text-sm ${
												activeTab === item.title
													? "font-semibold"
													: "font-medium"
											}`}
										>
											{item.title}
										</span>
									)}

									{activeTab === item.title &&
										!isSidebarCollapsed && (
											<motion.div
												className='ml-auto w-1.5 h-5 bg-blue-600 rounded-full'
												layoutId='activeIndicator'
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.2 }}
											/>
										)}
								</motion.div>
							))}
						</nav>
					</div>

					{/* Bottom section with More menu */}
					<div className='mt-4 relative'>
						<motion.div
							onClick={handleDropdown}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={`flex items-center p-3.5 rounded-xl cursor-pointer ${
								showDropdown
									? "bg-gray-100 dark:bg-gray-800"
									: ""
							} hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-800 dark:text-gray-300`}
						>
							<IoReorderThreeOutline className='text-xl' />
							{!isSidebarCollapsed && (
								<span className='ml-3 text-sm font-medium'>
									More
								</span>
							)}
						</motion.div>

						<AnimatePresence>
							{showDropdown && (
								<motion.div
									className='absolute bottom-16 left-0 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-30'
									initial='closed'
									animate='open'
									exit='closed'
									variants={dropdownVariants}
								>
									<div className='py-1'>
										<motion.div
											whileHover={{
												backgroundColor:
													"rgba(243, 244, 246, 1)",
											}}
											whileTap={{
												backgroundColor:
													"rgba(229, 231, 235, 1)",
											}}
											onClick={handleLogout}
											className='flex items-center px-4 py-3 text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer font-medium'
										>
											<FiLogOut className='mr-3 text-gray-700' />
											Log out
										</motion.div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* User profile at bottom */}
					{!isSidebarCollapsed && user?.reqUser && (
						<div className='mt-6 flex items-center p-3.5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60'>
							<img
								src={
									user.reqUser.image ||
									"https://via.placeholder.com/40"
								}
								alt={user.reqUser.username}
								className='w-9 h-9 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700'
							/>
							<div className='ml-3 truncate'>
								<p className='text-sm font-semibold text-gray-900 dark:text-gray-200'>
									{user.reqUser.username}
								</p>
							</div>
						</div>
					)}
				</div>
			</motion.div>

			{/* Search Component Panel */}
			<AnimatePresence>
				{isSearchBoxVisible && (
					<motion.div
						className='fixed inset-0 w-full h-full bg-white dark:bg-gray-900 z-50'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
					>
						<div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
							<h2 className='text-lg font-medium text-gray-900 dark:text-white'>
								Search
							</h2>
							<button
								onClick={() => setIsSearchBoxVisible(false)}
								className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400'
							>
								<IoCloseOutline size={24} />
							</button>
						</div>
						<div className='h-[calc(100vh-64px)] overflow-y-auto'>
							<SearchComponent
								setIsSearchVisible={setIsSearchBoxVisible}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Modals */}
			<CreatePostModal
				onClose={onClose}
				isOpen={isOpen}
				onOpen={onOpen}
			/>
			<CreateReelModal
				onClose={handleCloseCreateReelModal}
				isOpen={isCreateReelModalOpen}
				onOpen={handleOpenCreateReelModal}
			/>
		</>
	);
};

export default Sidebar;
