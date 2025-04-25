import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useDisclosure,
  Box,
  Avatar,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  IconButton,
  Tooltip,
  FormErrorMessage,
  Select,
  useToast,
  InputGroup,
  InputLeftElement,
  Grid,
  GridItem,
  Divider,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  editUserDetailsAction,
  getUserProfileAction,
} from "../../Redux/User/Action";
import ChangeProfilePhotoModal from "./ChangeProfilePhotoModal";
import { uploadToCloudinary } from "../../Config/UploadToCloudinary";
import { FiEdit2, FiSave, FiUser, FiMail, FiGlobe, FiPhone, FiLock, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  bio: Yup.string()
    .max(150, "Bio must be less than 150 characters"),
  website: Yup.string()
    .url("Please enter a valid URL")
    .nullable(),
  mobile: Yup.string()
    .matches(/^[0-9+\-() ]+$/, "Please enter a valid phone number")
    .nullable(),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other", ""], "Please select a valid gender")
    .nullable(),
});

const MotionBox = motion(Box);

const EditProfileForm = () => {
  const { user } = useSelector((store) => store);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");

  const [initialValues, setInitialValues] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    mobile: "",
    gender: "",
    website: "",
    private: false,
  });

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token]);

  useEffect(() => {
    const newValue = {};
    for (let item in initialValues) {
      if (user.reqUser && user.reqUser[item]) {
        newValue[item] = user.reqUser[item];
      }
    }
    formik.setValues(newValue);
  }, [user.reqUser]);

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const data = {
          jwt: token,
          data: { ...values, id: user.reqUser?.id },
        };
        await dispatch(editUserDetailsAction(data));
        toast({
          title: "Profile updated successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate(`/${user.reqUser?.username}`);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error updating profile",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  async function handleProfileImageChange(event) {
    const selectedFile = event.target.files[0];
    setIsLoading(true);
    try {
      const image = await uploadToCloudinary(selectedFile);
      setImageFile(image);
      const data = {
        jwt: token,
        data: { image, id: user.reqUser?.id },
      };
      await dispatch(editUserDetailsAction(data));
      toast({
        title: "Profile photo updated",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => {
        navigate(`/profile/${user.reqUser?.username}`);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error updating profile photo",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="6xl"
      mx="auto"
      p={8}
    >
      <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={8}>
        {/* Left Column - Profile Photo */}
        <GridItem>
          <Card bg={cardBg} shadow="lg" borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4}>
                <Box position="relative">
                  <Avatar
                    size="2xl"
                    src={
                      imageFile ||
                      user.reqUser?.image ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    borderWidth="2px"
                    borderColor="blue.500"
                  />
                  <Tooltip label="Change profile photo">
                    <IconButton
                      icon={<FiCamera />}
                      size="sm"
                      position="absolute"
                      bottom={0}
                      right={0}
                      rounded="full"
                      onClick={onOpen}
                      bg="blue.500"
                      color="white"
                      _hover={{ bg: "blue.600" }}
                      _active={{ bg: "blue.700" }}
                    />
                  </Tooltip>
                </Box>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">
                    {user.reqUser?.username}
                  </Text>
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    fontWeight="medium"
                    onClick={onOpen}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Change Profile Photo
                  </Text>
                  {isLoading && <Spinner size="sm" color="blue.500" />}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Right Column - Form */}
        <GridItem>
          <Card bg={cardBg} shadow="lg" borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Edit Profile</Heading>
              <Text color={textColor} mt={2}>
                Update your profile information and settings
              </Text>
            </CardHeader>
            <CardBody>
              <form onSubmit={formik.handleSubmit}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  <GridItem>
                    <FormControl isInvalid={formik.touched.name && formik.errors.name}>
                      <FormLabel>Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiUser color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Name"
                          {...formik.getFieldProps("name")}
                          size="lg"
                          variant="filled"
                        />
                      </InputGroup>
                      <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isInvalid={formik.touched.username && formik.errors.username}>
                      <FormLabel>Username</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiUser color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Username"
                          {...formik.getFieldProps("username")}
                          size="lg"
                          variant="filled"
                        />
                      </InputGroup>
                      <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                      <FormLabel>Email Address</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiMail color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Email"
                          {...formik.getFieldProps("email")}
                          size="lg"
                          variant="filled"
                          type="email"
                        />
                      </InputGroup>
                      <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isInvalid={formik.touched.mobile && formik.errors.mobile}>
                      <FormLabel>Phone Number</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiPhone color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Phone"
                          {...formik.getFieldProps("mobile")}
                          size="lg"
                          variant="filled"
                          type="tel"
                        />
                      </InputGroup>
                      <FormErrorMessage>{formik.errors.mobile}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isInvalid={formik.touched.website && formik.errors.website}>
                      <FormLabel>Website</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FiGlobe color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Website"
                          {...formik.getFieldProps("website")}
                          size="lg"
                          variant="filled"
                        />
                      </InputGroup>
                      <FormErrorMessage>{formik.errors.website}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isInvalid={formik.touched.gender && formik.errors.gender}>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        placeholder="Select gender"
                        {...formik.getFieldProps("gender")}
                        size="lg"
                        variant="filled"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                      <FormErrorMessage>{formik.errors.gender}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={{ base: 1, md: 2 }}>
                    <FormControl isInvalid={formik.touched.bio && formik.errors.bio}>
                      <FormLabel>Bio</FormLabel>
                      <Textarea
                        placeholder="Bio"
                        {...formik.getFieldProps("bio")}
                        size="lg"
                        variant="filled"
                        rows={4}
                      />
                      <FormErrorMessage>{formik.errors.bio}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  mt={8}
                  isLoading={isSubmitting}
                  leftIcon={<FiSave />}
                  loadingText="Saving..."
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  Save Changes
                </Button>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <ChangeProfilePhotoModal
        handleProfileImageChange={handleProfileImageChange}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </MotionBox>
  );
};

export default EditProfileForm;
