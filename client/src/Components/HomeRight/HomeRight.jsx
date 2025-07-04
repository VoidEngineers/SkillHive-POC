import { useSelector } from "react-redux";
import SuggestionsUserCard from "./SuggestionsUserCard";

const HomeRight = ({ suggestedUser }) => {
	const { user } = useSelector((store) => store);
	return (
		<div>
			<div>
				<div className='flex justify-between items-center rounded-lg border py-8 px-4 w-full border-slate-400'>
					<div className='flex items-center '>
						<img
							className='w-12 h-12 rounded-full'
							src={
								user.reqUser?.image ||
								"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
							}
							alt=''
						/>
						<div className='ml-3'>
							<p>{user.reqUser?.username}</p>
							<p className='opacity-70'>
								{user.reqUser?.username}
							</p>
						</div>
					</div>
					<p className='text-blue-600 font-semibold'>switch</p>
				</div>
				<div className='flex justify-between py-5 items-center'>
					<p className='font-semibold opacity-70'>
						Suggestions for you
					</p>
					<p className='text-xs font-semibold opacity-95'>View All</p>
				</div>

				<div className='space-y-5'>
					{suggestedUser.map((item, index) => (
						<SuggestionsUserCard
							key={index}
							image={
								item.userImage ||
								"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
							}
							username={item.username}
							description={"Follows you"}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default HomeRight;
