import { useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
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
  const [commentContent, setCommentContent] = useState("");
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
  const dropdownRef = useRef(null);

  const handleCommentInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const [numberOfLikes, setNumberOfLike] = useState(0);

  const data = {
    jwt: token,
    postId: post.id,
  };

  const handleAddComment = () => {
    if (!commentContent.trim()) return;
    
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
    if (post.user.id !== user.reqUser.id) {
      // Only create notification if not own post
      const notification = {
        message: `${user.reqUser.username} commented: ${commentContent}`,
        type: "COMMENT",
        postId: post.id,
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
        postId: post.id,
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
    setCurrentMediaIndex((prev) =>
      prev === post.mediaUrls.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? post.mediaUrls.length - 1 : prev - 1
    );
  };

  const isVideo = (url) => {
    return url?.match(/\.(mp4|webm|ogg)$/i);
  };

  useEffect(() => {
    setIsSaved(isSavedPost(user.reqUser, post.id));
    setIsPostLiked(isPostLikedByUser(post, user.reqUser?.id));
    setNumberOfLike(post?.likedByUsers?.length);
  }, [user.reqUser, post]);

  // Check if current user is the post author
  const isOwnPost = post.user.id === user.reqUser?.id;

  // Toggle dropdown visibility
  const handleToggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle delete post
  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePostAction({
        jwt: token,
        postId: post.id
      }));
      setShowDropdown(false);
    }
  };

  // Handle edit post
  const handleOpenEditPostModal = () => {
    setOpenEditPostModal(true);
    setShowDropdown(false);
  };

  const handleCloseEditPostModal = () => {
    setOpenEditPostModal(false);
  };

  // Handle comment modal
  const handleOpenCommentModal = () => {
    navigate(`/p/${post.id}`);
    onOpen();
  };

  // For debugging
  useEffect(() => {
    console.log("Is own post?", isOwnPost);
    console.log("Current user ID:", user.reqUser?.id);
    console.log("Post user ID:", post.user?.id);
  }, [isOwnPost, user.reqUser, post]);

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

        {/* Dropdown menu for edit/delete */}
        <div className="dropdown" ref={dropdownRef}>
          <div className="dots" onClick={handleToggleDropdown}>
            <BsThreeDots size={20} />
          </div>
          
          {/* Only show dropdown if it's visible AND it's the user's own post */}
          {showDropdown && isOwnPost && (
            <div className="dropdown-content">
              <div className="dropdown-item" onClick={handleOpenEditPostModal}>
                Edit
              </div>
              <div className="dropdown-item delete" onClick={handleDeletePost}>
                Delete
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Media content */}
      <div className="media-container">
        {post.mediaUrls?.map((url, index) => (
          <div
            key={index}
            className={`${index === currentMediaIndex ? "block" : "hidden"}`}
          >
            {isVideo(url) ? (
              <video src={url} controls className="w-full" />
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
                  className={`indicator ${
                    index === currentMediaIndex ? "active" : ""
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
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
            <BsBookmark onClick={handleSavePost} className="icon-button" />
          )}
        </div>
      </div>

      {/* Post details */}
      <div className="px-4 py-2">
        {numberOfLikes > 0 && (
          <p className="font-semibold">{numberOfLikes} likes</p>
        )}
        <p className="py-2">
          <span className="font-semibold">{post?.user?.username}</span>{" "}
          {post.caption}
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

      {/* Comment input */}
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

      {/* Modals */}
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