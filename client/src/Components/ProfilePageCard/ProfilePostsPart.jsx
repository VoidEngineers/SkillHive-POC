import React, { useEffect, useState } from "react";
import { BsBookmark, BsGrid3X3, BsCollection } from "react-icons/bs";
import { RiVideoLine } from "react-icons/ri";
import { BiUserPin } from "react-icons/bi";
import ReqUserPostCard from "./ReqUserPostCard";
import { useDispatch, useSelector } from "react-redux";
import { reqUserPostAction } from "../../Redux/Post/Action";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePostsPart = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Post");
  const [isLoading, setIsLoading] = useState(true);
  const { post } = useSelector((store) => store);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  // Initialize reqUserPost as an empty array if it's undefined
  const reqUserPost = Array.isArray(post?.reqUserPost) ? post.reqUserPost : [];

  const tabs = [
    {
      tab: "Post",
      icon: <BsGrid3X3 />,
      label: "Posts",
    },
    { 
      tab: "Reels", 
      icon: <RiVideoLine />, 
      label: "Reels"
    },
    { 
      tab: "Saved", 
      icon: <BsBookmark />, 
      label: "Saved"
    },
    {
      tab: "Tagged",
      icon: <BiUserPin />,
      label: "Tagged"
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const data = {
      jwt: token,
      userId: user?.id,
    };
    dispatch(reqUserPostAction(data));
    
    // Add a slight delay to simulate loading and make transitions smoother
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [user, post.createdPost, dispatch, token]);

  // Animation variants
  const tabVariants = {
    inactive: { opacity: 0.6, y: 0 },
    active: { opacity: 1, y: 0 },
    hover: { opacity: 0.8, y: -2 }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getContent = () => {
    if (isLoading) {
      return (
        <div className="py-16 w-full">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <BsCollection className="text-4xl text-gray-300 dark:text-gray-600 mb-4" />
              <div className="h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-3"></div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "Post" && (!reqUserPost || reqUserPost.length === 0)) {
      return (
        <EmptyState 
          icon={<BsGrid3X3 className="text-4xl mb-4" />}
          title="No Posts Yet"
          message="When you share photos and videos, they'll appear here."
        />
      );
    }

    if (activeTab === "Saved" && (!user?.savedPost || user.savedPost.length === 0)) {
      return (
        <EmptyState 
          icon={<BsBookmark className="text-4xl mb-4" />}
          title="No Saved Posts"
          message="Save photos and videos that you want to see again."
        />
      );
    }

    if (activeTab === "Reels") {
      return (
        <EmptyState 
          icon={<RiVideoLine className="text-4xl mb-4" />}
          title="No Reels Yet"
          message="Reels are short, entertaining videos on Cake Shop."
        />
      );
    }

    if (activeTab === "Tagged") {
      return (
        <EmptyState 
          icon={<BiUserPin className="text-4xl mb-4" />}
          title="No Tagged Posts"
          message="Photos and videos you're tagged in will appear here."
        />
      );
    }

    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-4"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {activeTab === "Post" && reqUserPost.map((item, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ReqUserPostCard post={item} />
          </motion.div>
        ))}
        
        {activeTab === "Saved" && Array.isArray(user?.savedPost) && user.savedPost.map((item, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ReqUserPostCard post={item} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="max-w-5xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Tab Navigation */}
      <div className="relative mb-6">
        <div className="border-t border-gray-200 dark:border-gray-700"></div>
        <div className="flex justify-center -mt-px">
          {tabs.map((item) => (
            <motion.div
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              initial="inactive"
              animate={activeTab === item.tab ? "active" : "inactive"}
              whileHover="hover"
              variants={tabVariants}
              className={`flex flex-col items-center px-6 pt-3 pb-2 cursor-pointer relative ${
                activeTab === item.tab 
                  ? "text-blue-500 dark:text-blue-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <div className="text-xl mb-1">
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {activeTab === item.tab && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Reusable empty state component
const EmptyState = ({ icon, title, message }) => (
  <motion.div 
    className="flex flex-col items-center justify-center py-16 text-center px-4"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <div className="text-gray-400 dark:text-gray-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
      {message}
    </p>
  </motion.div>
);

export default ProfilePostsPart;