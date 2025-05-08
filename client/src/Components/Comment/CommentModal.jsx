import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import {
  BsBookmark,
  BsBookmarkFill,
  BsEmojiSmile,
  BsPencil,
  BsThreeDots,
} from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { timeDifference } from "../../Config/Logic";
import { createComment, getAllComments } from "../../Redux/Comment/Action";
import { findPostByIdAction } from "../../Redux/Post/Action";
import CommentCard from "./CommentCard";
import "./CommentModal.css";

const CommentModal = ({
  isOpen,
  onClose,
  onOpen,
  postData,
  handleLikePost,
  handleUnLikePost,
  handleSavePost,
  handleUnSavePost,
  isPostLiked,
  isSaved,
}) => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("token");
  const { post, comments, user } = useSelector((store) => store);
  const [commentContent, setCommentContent] = useState("");
  const { postId } = useParams();
  const navigate = useNavigate();

  // console.log("coments ---- ",comments)

  useEffect(() => {
    if (postId) {
      dispatch(
        findPostByIdAction({
          jwt,
          postId,
        })
      );
      dispatch(getAllComments({jwt,postId}))
    }
  }, [postId, comments?.createdComment, comments?.deletedComment, comments?. updatedComment]);

  const handleAddComment = () => {
    if (!commentContent.trim()) return;
    const data = {
      jwt,
      postId,
      data: {
        content: commentContent,
      },
    };
    dispatch(createComment(data));
    setCommentContent("");
  };

  const handleCommnetInputChange = (e) => {
    setCommentContent(e.target.value);
  };
  const handleOnEnterPress = (e) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  
  return (
    <Modal size={"4xl"} onClose={handleClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody className="p-0">
          <div className="flex h-[75vh]">
            <div className="w-[45%] flex items-center justify-center bg-gray-100">
              <img
                className="max-h-full max-w-full object-contain"
                src={post.singlePost?.image}
                alt="Post"
              />
            </div>
            <div className="w-[55%] flex flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={
                        post?.singlePost?.user?.image ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={post?.singlePost?.user?.username}
                    />
                    <div>
                      <p className="font-semibold text-sm">{post?.singlePost?.user?.username}</p>
                      <p className="text-xs text-gray-500">{post?.singlePost?.location}</p>
                    </div>
                  </div>
                  <BsThreeDots className="cursor-pointer hover:text-gray-600" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto comments">
                {comments.comments?.length > 0 ? (
                  comments.comments?.map((item) => (
                    <CommentCard key={item.id} comment={item} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No comments yet
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-4">
                    {isPostLiked ? (
                      <AiFillHeart
                        onClick={handleUnLikePost}
                        className="text-2xl hover:opacity-80 cursor-pointer text-red-500"
                      />
                    ) : (
                      <AiOutlineHeart
                        onClick={handleLikePost}
                        className="text-2xl hover:opacity-80 cursor-pointer"
                      />
                    )}
                    <FaRegComment className="text-2xl hover:opacity-80 cursor-pointer" />
                    <RiSendPlaneLine className="text-2xl hover:opacity-80 cursor-pointer" />
                  </div>
                  <div>
                    {isSaved ? (
                      <BsBookmarkFill
                        onClick={() => handleUnSavePost(post.singlePost?.id)}
                        className="text-2xl hover:opacity-80 cursor-pointer"
                      />
                    ) : (
                      <BsBookmark
                        onClick={() => handleSavePost(post.singlePost?.id)}
                        className="text-2xl hover:opacity-80 cursor-pointer"
                      />
                    )}
                  </div>
                </div>

                {post.singlePost?.likedByUsers?.length > 0 && (
                  <p className="text-sm font-semibold mb-2">
                    {post.singlePost?.likedByUsers?.length} like{post.singlePost?.likedByUsers?.length !== 1 ? 's' : ''}
                  </p>
                )}

                <p className="text-xs text-gray-500 mb-4">
                  {timeDifference(post?.singlePost?.createdAt)}
                </p>

                <div className="flex items-center gap-2">
                  <BsEmojiSmile className="text-xl text-gray-500" />
                  <input
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a comment..."
                    type="text"
                    onKeyPress={handleOnEnterPress}
                    onChange={handleCommnetInputChange}
                    value={commentContent}
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentModal;
