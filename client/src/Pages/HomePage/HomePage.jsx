import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HomeRight from "../../Components/HomeRight/HomeRight";
import PostCard from "../../Components/Post/PostCard/PostCard";
import StoryCircle from "../../Components/Story/StoryCircle/StoryCircle";

import { hasStory, timeDifference } from "../../Config/Logic";
import { findUserPost } from "../../Redux/Post/Action";
import {
	findByUserIdsAction,
	getUserProfileAction,
} from "../../Redux/User/Action";
import "./HomePage.css";

const suggestedUsers = [
	{
		id: 1,
		userImage: "/images/us1.jpg",
		username: "John Doe",
		description: "Web Developer",
	},
	{
		id: 2,
		userImage: "/images/us2.jpg",
		username: "Jaden Smith",
		description: "Graphic Designer",
	},
	{
		id: 3,
		userImage: "/images/us3.jpg",
		username: "darkknight",
		description: "Content Writer",
	},
];

const HomePage = () => {
	const dispatch = useDispatch();
	const [userIds, setUserIds] = useState([]);
	const token = localStorage.getItem("token");
	const reqUser = useSelector((store) => store.user.reqUser);
	const { user, post } = useSelector((store) => store);
	const [suggestedUser, setSuggestedUser] = useState([]);
	const navigate = useNavigate();

	// console.log("timestamp - :",timeDifference("2023-04-01T08:59:00.959826"))

	useEffect(() => {
		dispatch(getUserProfileAction(token));
	}, [token]);

	useEffect(() => {
		if (reqUser) {
			const newIds = reqUser?.following?.map((user) => user.id);
			setUserIds([reqUser?.id, ...newIds]);
			// setSuggestedUser(suggetions(reqUser));
			setSuggestedUser(suggestedUsers);
		}

		// else{
		//   navigate("/login")
		// }
		// else setUserIds([reqUser?.id])
	}, [reqUser]);

	useEffect(() => {
		const data = {
			userIds: [userIds].join(","),
			jwt: token,
		};

		if (userIds.length > 0) {
			dispatch(findUserPost(data));
			dispatch(findByUserIdsAction(data));
		}
	}, [userIds, post.createdPost, post.deletedPost, post.updatedPost]);

	const storyUsers = hasStory(user.userByIds);

	return (
		<div className=' '>
			<div className='mt-10 flex w-[100%] justify-center'>
				<div className='flex flex-col w-[55%] px-10 items-center'>
					{storyUsers.length > 0 && (
						<div className='flex  space-x-2 border p-4 rounded-md justify-start w-full mb-[3rem]'>
							{storyUsers.map((item, index) => (
								<StoryCircle
									key={index}
									image={
										item?.image ||
										"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
									}
									username={item?.username}
									userId={item?.id}
								/>
							))}
						</div>
					)}
					<div className='space-y-10 postsBox w-full'>
						{post.userPost?.length > 0 &&
							post?.userPost?.map((item) => (
								<PostCard
									userProfileImage={
										item.user.userImage
											? item.user.userImage
											: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
									}
									username={item?.user?.username}
									location={item?.location}
									postImage={item?.image}
									createdAt={timeDifference(item?.createdAt)}
									postId={item?.id}
									post={item}
								/>
							))}
					</div>
				</div>
				<div className='w-[30%] '>
					<HomeRight suggestedUser={suggestedUser} />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
