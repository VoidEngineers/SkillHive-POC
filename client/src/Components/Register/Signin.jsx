"use client"

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import * as Yup from "yup"
import { signinAction } from "../../Redux/Auth/Action"
import { getUserProfileAction } from "../../Redux/User/Action"
import { FcGoogle } from "react-icons/fc"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
})

const Signin = () => {
  const initialValues = { email: "", password: "" }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, signin } = useSelector((store) => store)
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState("")

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) dispatch(getUserProfileAction(token || signin))
  }, [signin, token, dispatch])

  useEffect(() => {
    if (user?.reqUser?.username && token) {
      navigate(`/${user.reqUser?.username}`)
      toast({
        title: "Sign in successful!",
        description: "Welcome back",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      })
    } else if (user?.error) {
      setAuthError(user.error)
    }
  }, [user.reqUser, user.error, token, navigate, toast])

  const handleSubmit = (values, actions) => {
    setAuthError("")
    dispatch(signinAction(values))

    // We'll let the useEffect handle success, but we'll handle loading state here
    setTimeout(() => {
      actions.setSubmitting(false)
    }, 1000)
  }

  const bgColor = useColorModeValue("white", "gray.700")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const textColor = useColorModeValue("gray.800", "white")
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400")
  const containerBg = useColorModeValue("gray.50", "gray.800")
  const buttonHoverBg = useColorModeValue("gray.50", "gray.700")

  return (
    <Flex minH="100vh" align="center" justify="center" bg={containerBg} p={4}>
      <Stack spacing={8} mx="auto" maxW="lg" w={{ base: "100%", md: "md" }}>
        <Box rounded="lg" bg={bgColor} boxShadow="lg" p={8} borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={6} align="center">

            <Heading fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
              Welcome LearnerIn Platform
            </Heading>

            {authError && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
              {(formikProps) => (
                <Form style={{ width: "100%" }}>
                  <VStack spacing={4} align="flex-start" w="full">
                    <Field name="email">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <FormLabel htmlFor="email" fontWeight="medium">
                            Email
                          </FormLabel>
                          <Input
                            {...field}
                            id="email"
                            placeholder="your.email@example.com"
                            size="lg"
                            borderRadius="md"
                            _focus={{
                              borderColor: "pink.400",
                              boxShadow: "0 0 0 1px pink.400",
                            }}
                          />
                          <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="password">
                      {({ field, form }) => (
                        <FormControl isInvalid={form.errors.password && form.touched.password}>
                          <FormLabel htmlFor="password" fontWeight="medium">
                            Password
                          </FormLabel>
                          <InputGroup size="lg">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              id="password"
                              placeholder="Enter your password"
                              borderRadius="md"
                              _focus={{
                                borderColor: "pink.400",
                                boxShadow: "0 0 0 1px pink.400",
                              }}
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Link
                      alignSelf="flex-end"
                      fontSize="sm"
                      color="pink.500"
                      fontWeight="semibold"
                      _hover={{ color: "pink.600" }}
                    >
                      Forgot password?
                    </Link>

                    <Button
                      type="submit"
                      size="lg"
                      bg="pink.400"
                      color="white"
                      _hover={{ bg: "pink.500" }}
                      width="full"
                      isLoading={formikProps.isSubmitting}
                      loadingText="Signing in"
                      borderRadius="md"
                      mt={2}
                    >
                      Sign In
                    </Button>

                    <Flex align="center" w="full" my={4}>
                      <Divider borderColor={borderColor} />
                      <Text px={3} color={secondaryTextColor} fontWeight="medium" fontSize="sm">
                        OR
                      </Text>
                      <Divider borderColor={borderColor} />
                    </Flex>

                    <Button
                      as="a"
                      href="http://localhost:5454/oauth2/authorization/google"
                      size="lg"
                      width="full"
                      variant="outline"
                      leftIcon={<Icon as={FcGoogle} boxSize={5} />}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ bg: buttonHoverBg }}
                    >
                      Continue with Google
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>

            <Text fontSize="sm" color={secondaryTextColor} textAlign="center" mt={4}>
              By signing in, you agree to our{" "}
              <Link color="pink.500" fontWeight="semibold">
                Terms
              </Link>
              ,{" "}
              <Link color="pink.500" fontWeight="semibold">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link color="pink.500" fontWeight="semibold">
                Cookies Policy
              </Link>
              .
            </Text>
          </VStack>
        </Box>

        <Box p={4} bg={bgColor} borderWidth="1px" borderColor={borderColor} rounded="lg" textAlign="center">
          <Text fontSize="md">
            Don't have an account?{" "}
            <Link
              color="pink.500"
              fontWeight="semibold"
              onClick={() => navigate("/signup")}
              _hover={{ color: "pink.600", textDecoration: "underline" }}
              cursor="pointer"
            >
              Sign Up
            </Link>
          </Text>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Signin
