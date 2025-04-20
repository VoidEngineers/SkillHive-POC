import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StoryProgressBar from '../../Demo/StoryProgress';
import { IoClose } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const StoryViewerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  position: relative;
`;

const StoryImage = styled.img`
  max-height: 90vh;
  max-width: 90vw;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
  z-index: 100;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  &.left {
    left: 20px;
  }
  
  &.right {
    right: 20px;
  }
`;

const ProgressBarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  gap: 4px;
  z-index: 10;
`;

const StoryCaption = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 16px;
  max-width: 80%;
  text-align: center;
  backdrop-filter: blur(4px);
`;

function StoryViewer({ stories, onClose }) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNextStory = () => {
    if (currentStoryIndex < stories?.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setActiveIndex(activeIndex + 1);
    } else if (currentStoryIndex === stories?.length - 1) {
      setCurrentStoryIndex(0);
      setActiveIndex(0);
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      handleNextStory();
    } else if (event.key === 'ArrowLeft') {
      handlePrevStory();
    } else if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNextStory();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentStoryIndex]);

  return (
    <StoryViewerContainer tabIndex={0} onKeyDown={handleKeyDown}>
      <CloseButton onClick={onClose} title="Close (Esc)">
        <IoClose />
      </CloseButton>
      
      <NavigationButton className="left" onClick={handlePrevStory} title="Previous (←)">
        <IoIosArrowBack />
      </NavigationButton>
      
      <StoryImage src={stories?.[currentStoryIndex]?.image} alt="story" />
      
      <NavigationButton className="right" onClick={handleNextStory} title="Next (→)">
        <IoIosArrowForward />
      </NavigationButton>
      
      <ProgressBarContainer>
        {stories?.map((story, index) => (
          <StoryProgressBar
            key={index}
            duration={5000}
            index={index}
            activeIndex={activeIndex}
          />
        ))}
      </ProgressBarContainer>
      
      {stories?.[currentStoryIndex]?.captions && (
        <StoryCaption>
          {stories[currentStoryIndex].captions}
        </StoryCaption>
      )}
    </StoryViewerContainer>
  );
}

export default StoryViewer;