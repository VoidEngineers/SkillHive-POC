import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "../../Components/ProtectedRoute/ProtectedRoute";

import StoryPage from "../../Components/Demo/Demo";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { getUserProfileAction } from "../../Redux/User/Action";
import Auth from "../Auth/Auth";
import EditProfilePage from "../EditProfile/EditProfilePage";
import HomePage from "../HomePage/HomePage";
import Profile from "../Profile/Profile";
import Story from "../Story/Story";
import ReelViewer from "../ReelViewer/ReelViewer";
import CreateStory from "../../Components/Story/CreateStory";
import Notification from "../../Components/Notification/Notification";
import LearningPlan from "../../Components/LearningPlan/LearningPlan";
import LearningProgress from "../../Components/LearningProgress/LearningProgress";
import AboutUs from "../AboutUs/AboutUs";
import OAuthSuccess from "../Auth/OAuthSuccess"; 




const Routers = () => {
  const location =useLocation();
  const reqUser = useSelector(store=>store.user.reqUser);
  const token=localStorage.getItem("token");
  const dispatch=useDispatch();

  useEffect(()=>{
    if (token) {
      dispatch(getUserProfileAction(token));
    }
  },[token, dispatch])
  return (
    <div>
      {}

{(location.pathname !== "/login" && location.pathname !=="/signup")&& (
    <div className="flex">
      {location.pathname!=="/reels" && <div className="sidebarBox border border-l-slate-500 w-[20%]">
        <Sidebar />
      </div>}
      <div className="w-full">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/p/:postId" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/p/:postId/edit" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/:username" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/demo" element={
            <ProtectedRoute>
              <StoryPage />
            </ProtectedRoute>
          } />
          <Route path="/story/:userId" element={
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          } />
          <Route path="/account/edit" element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/reels" element={
            <ProtectedRoute>
              <ReelViewer />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          } />
          <Route path="/create-story" element={
            <ProtectedRoute>
              <CreateStory />
            </ProtectedRoute>
          } />
          <Route path="/learning_plan" element={
            <ProtectedRoute>
              <LearningPlan />
            </ProtectedRoute>
          } />
          <Route path="/learning-progress" element={
            <ProtectedRoute>
              <LearningProgress />
            </ProtectedRoute>
          } />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
        </Routes>
      </div>
    </div>
  )}
  {(location.pathname === "/login" || location.pathname==="/signup") && (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
    </Routes>
  )}
    </div>
    
  );
};

export default Routers;
