import React, { useEffect, useState } from "react";
import { TbCircleDashed } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followUserAction, unFollowUserAction } from "../../Redux/User/Action";
import {
  Box,
  Avatar,
  Button,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  useToast,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { FiEdit2, FiMessageSquare, FiPlus, FiUser, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
// import { isReqUser } from '../../Config/Logic'

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const UserDetailCard = ({ user, isRequser, isFollowing }) => {
  const token = localStorage.getItem("token");
  const { post } = useSelector((store) => store);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const [isFollow, setIsFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.700");

  const goToAccountEdit = () => {
    navigate("/account/edit");
  };

  console.log("user --- ", user);
  

  const data = {
    jwt: token,
    userId: user?.id,
  };

  const handleFollowUser = async () => {
    setIsLoading(true);
    try {
      await dispatch(followUserAction(data));
      setIsFollow(true);
      toast({
        title: "Followed successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error following user",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnFollowUser = async () => {
    setIsLoading(true);
    try {
      await dispatch(unFollowUserAction(data));
      setIsFollow(false);
      toast({
        title: "Unfollowed successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error unfollowing user",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsFollow(isFollowing);
  }, [isFollowing]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="4xl"
      mx="auto"
      p={8}
      bg={cardBg}
      rounded="xl"
      shadow="xl"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex direction={{ base: "column", md: "row" }} gap={8}>
        <Box position="relative">
          <Avatar
            size="2xl"
            src={
              user?.image ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            borderWidth="2px"
            borderColor="blue.500"
          />
          {isRequser && (
            <Tooltip label="Edit profile">
              <IconButton
                icon={<FiEdit2 />}
                size="sm"
                position="absolute"
                bottom={0}
                right={0}
                rounded="full"
                onClick={goToAccountEdit}
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _active={{ bg: "blue.700" }}
              />
            </Tooltip>
          )}
        </Box>

        <VStack align="start" spacing={6} flex={1}>
          <HStack spacing={4} align="center" wrap="wrap">
            <Text fontSize="2xl" fontWeight="bold">
              {user?.username}
            </Text>
            {!isRequser && (
              <HStack spacing={2}>
                <MotionButton
                  size="sm"
                  colorScheme={isFollow ? "gray" : "blue"}
                  onClick={isFollow ? handleUnFollowUser : handleFollowUser}
                  variant={isFollow ? "outline" : "solid"}
                  isLoading={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isFollow ? "Following" : "Follow"}
                </MotionButton>
                <MotionButton
                  size="sm"
                  variant="outline"
                  leftIcon={<FiMessageSquare />}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Message
                </MotionButton>
                <Tooltip label="More options">
                  <IconButton
                    icon={<TbCircleDashed />}
                    size="sm"
                    variant="ghost"
                    _hover={{ bg: "gray.100" }}
                  />
                </Tooltip>
              </HStack>
            )}
            {isRequser && (
              <MotionButton
                size="sm"
                colorScheme="blue"
                variant="outline"
                leftIcon={<FiPlus />}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Tools
              </MotionButton>
            )}
          </HStack>

          <HStack spacing={8} py={2} wrap="wrap">
            <Stat>
              <StatLabel color={textColor}>Posts</StatLabel>
              <StatNumber>{post?.reqUserPost?.length || 0}</StatNumber>
              <StatHelpText>
                <FiUser style={{ display: "inline", marginRight: "4px" }} />
                Total posts
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel color={textColor}>Followers</StatLabel>
              <StatNumber>{user?.follower?.length}</StatNumber>
              <StatHelpText>
                <FiUsers style={{ display: "inline", marginRight: "4px" }} />
                People following you
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel color={textColor}>Following</StatLabel>
              <StatNumber>{user?.following?.length}</StatNumber>
              <StatHelpText>
                <FiUsers style={{ display: "inline", marginRight: "4px" }} />
                People you follow
              </StatHelpText>
            </Stat>
          </HStack>

          <VStack align="start" spacing={2}>
            <Text fontSize="lg" fontWeight="bold">
              {user?.name}
            </Text>
            <Text fontSize="md" color={textColor}>
              {user?.bio || "No bio yet"}
            </Text>
          </VStack>
        </VStack>
      </Flex>
    </MotionBox>
  );
};

export default UserDetailCard;
