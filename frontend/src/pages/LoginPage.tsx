import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  Link,
  Checkbox,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGoogle, FaGithub, FaApple, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  // Real-time validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return undefined;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return undefined;
  };

  const validateName = (
    name: string,
    fieldName: string,
  ): string | undefined => {
    if (!name) return `${fieldName} is required`;
    if (name.length < 2) return `${fieldName} must be at least 2 characters`;
    return undefined;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError("");

    // Real-time validation
    const newErrors = { ...errors };

    if (field === "email") {
      const emailError = validateEmail(value as string);
      if (emailError) {
        newErrors.email = emailError;
      } else {
        delete newErrors.email;
      }
    }

    if (field === "password") {
      const passwordError = validatePassword(value as string);
      if (passwordError) {
        newErrors.password = passwordError;
      } else {
        delete newErrors.password;
      }

      // Re-validate confirm password if it exists
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(
          value as string,
          formData.confirmPassword,
        );
        if (confirmError) {
          newErrors.confirmPassword = confirmError;
        } else {
          delete newErrors.confirmPassword;
        }
      }
    }

    if (field === "confirmPassword") {
      const confirmError = validateConfirmPassword(
        formData.password,
        value as string,
      );
      if (confirmError) {
        newErrors.confirmPassword = confirmError;
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (field === "firstName") {
      const nameError = validateName(value as string, "First name");
      if (nameError) {
        newErrors.firstName = nameError;
      } else {
        delete newErrors.firstName;
      }
    }

    if (field === "lastName") {
      const nameError = validateName(value as string, "Last name");
      if (nameError) {
        newErrors.lastName = nameError;
      } else {
        delete newErrors.lastName;
      }
    }

    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Sign up specific validations
    if (activeTab === 1) {
      const firstNameError = validateName(
        formData.firstName || "",
        "First name",
      );
      if (firstNameError) newErrors.firstName = firstNameError;

      const lastNameError = validateName(formData.lastName || "", "Last name");
      if (lastNameError) newErrors.lastName = lastNameError;

      const confirmError = validateConfirmPassword(
        formData.password,
        formData.confirmPassword || "",
      );
      if (confirmError) newErrors.confirmPassword = confirmError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, this would make an API call to your authentication service
      console.log(
        activeTab === 0 ? "Login attempt:" : "Sign up attempt:",
        formData,
      );

      // Redirect to dashboard or home page
      navigate("/");
    } catch (error) {
      setSubmitError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would redirect to Cognito Hosted UI
    const cognitoUrl = `https://your-cognito-domain.auth.region.amazoncognito.com/oauth2/authorize?identity_provider=${provider}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=CODE&client_id=your-client-id&scope=email+openid+profile`;

    console.log(`Redirecting to ${provider} OAuth:`, cognitoUrl);
    // window.location.href = cognitoUrl;

    // For demo purposes, just show an alert
    alert(`Would redirect to ${provider} OAuth login`);
  };

  const socialButtons = [
    { name: "Google", icon: FaGoogle, color: "red.500", provider: "Google" },
    { name: "GitHub", icon: FaGithub, color: "gray.800", provider: "GitHub" },
    {
      name: "Apple",
      icon: FaApple,
      color: "gray.900",
      provider: "SignInWithApple",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "blue.600",
      provider: "LinkedIn",
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh">
      <Header />

      <Container maxW="md" py={20} mt={16}>
        <Box
          bg={cardBg}
          p={8}
          borderRadius="xl"
          border="1px"
          borderColor={borderColor}
          boxShadow="lg"
        >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="xl" mb={2} color={headingColor}>
                Welcome to CleverDocs
              </Heading>
              <Text color={textColor}>
                Sign in to your account or create a new one
              </Text>
            </Box>

            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList mb={5}>
                <Tab flex={1}>Login</Tab>
                <Tab flex={1}>Sign Up</Tab>
              </TabList>

              <TabPanels>
                {/* Login Tab */}
                <TabPanel px={0}>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              icon={
                                showPassword ? <ViewOffIcon /> : <ViewIcon />
                              }
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>

                      <HStack justify="space-between">
                        <Checkbox
                          isChecked={formData.rememberMe}
                          onChange={(e) =>
                            handleInputChange("rememberMe", e.target.checked)
                          }
                        >
                          Remember me
                        </Checkbox>
                        <Link color="blue.500" fontSize="sm">
                          Forgot password?
                        </Link>
                      </HStack>

                      {submitError && (
                        <Alert status="error" borderRadius="md">
                          <AlertIcon />
                          {submitError}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        isLoading={isLoading}
                        loadingText="Signing in..."
                        isDisabled={Object.keys(errors).length > 0}
                      >
                        Sign In
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>

                {/* Sign Up Tab */}
                <TabPanel px={0}>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={4}>
                        <FormControl isInvalid={!!errors.firstName}>
                          <FormLabel>First Name</FormLabel>
                          <Input
                            value={formData.firstName || ""}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            placeholder="First name"
                            autoComplete="given-name"
                          />
                          <FormErrorMessage>
                            {errors.firstName}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.lastName}>
                          <FormLabel>Last Name</FormLabel>
                          <Input
                            value={formData.lastName || ""}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            placeholder="Last name"
                            autoComplete="family-name"
                          />
                          <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter your email"
                          autoComplete="email"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.password}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            placeholder="Create a password"
                            autoComplete="new-password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              icon={
                                showPassword ? <ViewOffIcon /> : <ViewIcon />
                              }
                              onClick={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.confirmPassword}>
                        <FormLabel>Confirm Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value,
                              )
                            }
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label={
                                showConfirmPassword
                                  ? "Hide password"
                                  : "Show password"
                              }
                              icon={
                                showConfirmPassword ? (
                                  <ViewOffIcon />
                                ) : (
                                  <ViewIcon />
                                )
                              }
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              variant="ghost"
                              size="sm"
                            />
                          </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage>
                          {errors.confirmPassword}
                        </FormErrorMessage>
                      </FormControl>

                      {submitError && (
                        <Alert status="error" borderRadius="md">
                          <AlertIcon />
                          {submitError}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        isLoading={isLoading}
                        loadingText="Creating account..."
                        isDisabled={Object.keys(errors).length > 0}
                      >
                        Create Account
                      </Button>
                    </VStack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Box>
              <HStack>
                <Divider />
                <Text fontSize="sm" color={textColor} whiteSpace="nowrap">
                  Or continue with
                </Text>
                <Divider />
              </HStack>
            </Box>

            <VStack spacing={3}>
              {socialButtons.map((social) => (
                <Button
                  key={social.name}
                  leftIcon={<social.icon />}
                  onClick={() => handleSocialLogin(social.provider)}
                  variant="outline"
                  size="lg"
                  width="100%"
                  _hover={{
                    bg: useColorModeValue("gray.50", "gray.700"),
                    borderColor: social.color,
                  }}
                >
                  Continue with {social.name}
                </Button>
              ))}
            </VStack>

            <Text fontSize="sm" color={textColor} textAlign="center">
              By signing up, you agree to our{" "}
              <Link color="blue.500">Terms of Service</Link> and{" "}
              <Link color="blue.500">Privacy Policy</Link>
            </Text>
          </VStack>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LoginPage;
