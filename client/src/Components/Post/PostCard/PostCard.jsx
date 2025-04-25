import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { createNotificationAction } from "../../../Redux/Notification/Action"; 
import {
  BsBookmark,
  BsBookmarkFill,
  BsDot,
  BsEmojiSmile,
  BsThreeDots,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  isPostLikedByUser,
  isReqUserPost,
  isSavedPost,
  timeDifference,
} from "../../../Config/Logic";
import { createComment } from "../../../Redux/Comment/Action";
import {
  deletePostAction,
  likePostAction,
  savePostAction,
  unLikePostAction,
  unSavePostAction,
} from "../../../Redux/Post/Action";
import CommentModal from "../../Comment/CommentModal";
import "./PostCard.css";
import EditPostModal from "../Create/EditPostModal";
import { IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const PostCard = ({
  userProfileImage,
  username,
  location,
  post,
  createdAt,
}) => {
  const [commentContent, setCommentContent] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { user } = useSelector((store) => store);
  const [isSaved, setIsSaved] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openEditPostModal, setOpenEditPostModal] = useState(false);

  const handleCommentInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const [numberOfLikes, setNumberOfLike] = useState(0);

  const data = {
    jwt: token,
    postId: post.id,
  };

  const handleAddComment = () => {
    const data = {
      jwt: token,
      postId: post.id,
      data: {
        content: commentContent,
      },
    };
    dispatch(createComment(data));
    setCommentContent("");
    
    // Create notification for comment
    if (post.user.id !== user.reqUser.id) { // Only create notification if not own post
      const notification = {
        message: `${user.reqUser.username} commented: ${commentContent}`,
        type: "COMMENT",
        postId: post.id
      };
      dispatch(createNotificationAction(notification, token));
    }
  };

  const handleOnEnterPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const handleLikePost = () => {
    dispatch(likePostAction(data));
    setIsPostLiked(true);
    setNumberOfLike(numberOfLikes + 1);
    
  
    if (post.user.id !== user.reqUser.id) { 
      const notification = {
        message: `${user.reqUser.username} liked your post`,
        type: "LIKE",
        postId: post.id
      };
      dispatch(createNotificationAction(notification, token));
    }
  };

  const handleUnLikePost = () => {
    dispatch(unLikePostAction(data));
    setIsPostLiked(false);
    setNumberOfLike(numberOfLikes - 1);
  };

  const handleSavePost = () => {
    dispatch(savePostAction(data));
    setIsSaved(true);
  };

  const handleUnSavePost = () => {
    dispatch(unSavePostAction(data));
    setIsSaved(false);
  };

  const handleNavigate = (username) => {
    navigate(`/${username}`);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === post.mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === 0 ? post.mediaUrls.length - 1 : prev - 1
    );
  };

  const isVideo = (url) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  useEffect(() => {
    setIsSaved(isSavedPost(user.reqUser, post.id));
    setIsPostLiked(isPostLikedByUser(post, user.reqUser?.id));
    setNumberOfLike(post?.likedByUsers?.length);
  }, [user.reqUser, post]);

  const handleClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleWindowClick = (event) => {
    if (!event.target.matches(".dots")) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleDeletePost = (postId) => {
    const data = {
      jwt: token,
      postId,
    };
    dispatch(deletePostAction(data));
  };

  const isOwnPost = isReqUserPost(post, user.reqUser);

  const handleOpenCommentModal = () => {
    navigate(`/p/${post.id}`);
    onOpen();
  };

  const handleCloseEditPostModal = () => {
    setOpenEditPostModal(false);
  };

  const handleOpenEditPostModal = () => {
    setOpenEditPostModal(true);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <img
            className="user-avatar"
            src={
              post.user.userImage ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt=""
          />
          <div>
            <p className="username" onClick={() => handleNavigate(username)}>
              {post?.user?.username}
            </p>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
        <div className="dropdown">
          <BsThreeDots onClick={handleClick} className="dots" />
          {isOwnPost && (
            <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
              <div className="dropdown-item" onClick={handleOpenEditPostModal}>
                <span>Edit</span>
              </div>
              <div className="dropdown-item delete" onClick={() => handleDeletePost(post.id)}>
                <span>Delete</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media Slider Section */}
      <div className="media-container">
        {post.mediaUrls?.map((url, index) => (
          <div
            key={index}
            className={`${index === currentMediaIndex ? "block" : "hidden"}`}
          >
            {isVideo(url) ? (
              <video
                src={url}
                controls
                className="w-full"
              />
            ) : (
              <img
                src={url}
                alt={`Post media ${index + 1}`}
                className="w-full"
              />
            )}
          </div>
        ))}

        {post.mediaUrls?.length > 1 && (
          <>
            <div className="media-navigation">
              <button className="nav-button" onClick={handlePrevMedia}>
                <ChevronLeftIcon />
              </button>
              <button className="nav-button" onClick={handleNextMedia}>
                <ChevronRightIcon />
              </button>
            </div>
            <div className="media-indicators">
              {post.mediaUrls?.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentMediaIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="action-buttons">
        <div className="action-icons">
          {isPostLiked ? (
            <AiFillHeart
              onClick={handleUnLikePost}
              className="icon-button like"
            />
          ) : (
            <AiOutlineHeart
              onClick={handleLikePost}
              className="icon-button"
            />
          )}
          <FaRegComment
            onClick={handleOpenCommentModal}
            className="icon-button"
          />
          <RiSendPlaneLine className="icon-button" />
        </div>
        <div>
          {isSaved ? (
            <BsBookmarkFill
              onClick={handleUnSavePost}
              className="icon-button"
            />
          ) : (
            <BsBookmark
              onClick={handleSavePost}
              className="icon-button"
            />
          )}
        </div>
      </div>

      <div className="px-4 py-2">
        {numberOfLikes > 0 && (
          <p className="font-semibold">{numberOfLikes} likes</p>
        )}
        <p className="py-2">
          <span className="font-semibold">{post?.user?.username}</span> {post.caption}
        </p>
        {post?.comments?.length > 0 && (
          <p
            onClick={handleOpenCommentModal}
            className="text-gray-500 text-sm py-2 cursor-pointer hover:text-gray-700"
          >
            View all {post?.comments?.length} comments
          </p>
        )}
      </div>

      <div className="commentBox">
        <div className="flex items-center gap-2">
          <BsEmojiSmile className="text-gray-500" />
          <input
            onKeyPress={handleOnEnterPress}
            onChange={handleCommentInputChange}
            value={commentContent}
            className="commentInput"
            type="text"
            placeholder="Add a comment..."
          />
        </div>
      </div>

      <EditPostModal
        onClose={handleCloseEditPostModal}
        isOpen={openEditPostModal}
        onOpen={handleOpenEditPostModal}
        post={post}
      />

      <CommentModal
        handleLikePost={handleLikePost}
        handleSavePost={handleSavePost}
        handleUnSavePost={handleUnSavePost}
        handleUnLikePost={handleUnLikePost}
        isPostLiked={isPostLiked}
        isSaved={isSaved}
        postData={post}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </div>
  );
};

export default PostCard;