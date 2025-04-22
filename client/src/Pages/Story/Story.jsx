import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import StoryViewer from "../../Components/Story/StoryViewer/StoryViewer";
import { findStoryByUserId } from "../../Redux/Story/Action";

const Story = () => {
  const { story } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("token");
  const { userId } = useParams();

  useEffect(() => {
    const data = { jwt, userId };
    dispatch(findStoryByUserId(data));
  }, [userId, dispatch, jwt]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (!story.stories || story.stories.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No stories found</p>
      </div>
    );
  }

  return (
    <div>
      <StoryViewer stories={story.stories} onClose={handleClose} />
    </div>
  );
};

export default Story;
