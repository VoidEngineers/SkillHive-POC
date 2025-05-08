import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { isCommentLikedByUser, timeDifference } from "../../Config/Logic";
import { deleteComment, likeComment } from "../../Redux/Comment/Action";
import { BsEmojiSmile, BsPencil, BsThreeDots } from "react-icons/bs";
import EditCommentModal from "./EditCommentModal";
import { MdDelete } from "react-icons/md";
import { editComment } from "../../Redux/Comment/Action";

const CommentCard = ({ comment }) => {
  const [isCommentLiked, setIsCommentLike] = useState(false);
  const { user } = useSelector((store) => store);
  const [commentLikes, setCommentLikes] = useState(0);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const [isEditCommentInputOpen, setIsEditCommentInputOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    setCommentContent(comment?.content);
  }, [comment]);

  const handleLikeComment = () => {
    dispatch(likeComment({ jwt, commentId: comment.id }));
    setIsCommentLike(true);
    setCommentLikes(commentLikes + 1);
  };

  const handleUnLikeComment = () => {
    dispatch(likeComment({ jwt, commentId: comment.id }));
    setIsCommentLike(false);
    setCommentLikes(commentLikes - 1);
  };

  useEffect(() => {
    setCommentLikes(comment?.likedByUsers?.length);
  }, [comment]);

  useEffect(() => {
    setIsCommentLike(isCommentLikedByUser(comment, user.reqUser?.id));
  }, [comment, user.reqUser]);

  const handleClickOnEditComment = () => {
    setIsEditCommentInputOpen(!isEditCommentInputOpen);
  };

  const handleCommnetInputChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleDeleteComment = () => {
    dispatch(deleteComment({ commentId: comment.id, jwt }));
  };

  const handleEditComment = (e) => {
    if(e.key === "Enter"){
      dispatch(
        editComment({ data: { id: comment?.id, content: commentContent }, jwt })
      );
      setIsEditCommentInputOpen(false);
      setCommentContent("");
    }
  };

  return (
    <div className="comment-card py-3 px-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={
              comment?.userDto.userImage ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt={comment?.userDto.username}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{comment.userDto.username}</span>
              <span className="text-sm text-gray-600">{comment.content}</span>
            </div>
            <div className="flex items-center gap-2">
              {isCommentLiked ? (
                <AiFillHeart
                  onClick={handleUnLikeComment}
                  className="text-red-500 hover:opacity-80 cursor-pointer text-sm"
                />
              ) : (
                <AiOutlineHeart
                  onClick={handleLikeComment}
                  className="hover:opacity-80 cursor-pointer text-sm"
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span>{timeDifference(comment?.createdAt)}</span>
            {commentLikes > 0 && <span>{commentLikes} like{commentLikes !== 1 ? 's' : ''}</span>}
            {user?.reqUser?.id === comment?.userDto?.id && (
              <div className="flex items-center gap-2">
                <BsPencil
                  className="cursor-pointer hover:text-gray-700"
                  onClick={handleClickOnEditComment}
                />
                <MdDelete
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeleteComment}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {isEditCommentInputOpen && (
        <div className="mt-2 ml-11">
          <input
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Edit your comment..."
            type="text"
            onKeyPress={handleEditComment}
            onChange={handleCommnetInputChange}
            value={commentContent}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
