import { useForm } from "@mantine/form";
import {
  Button,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Container,
  Text,
  Anchor,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/apiService";

function RegisterPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) =>
        value.length < 3 ? "Username must be at least 3 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      const { username, email, password } = values;
      await registerUser({ username, email, password });

      notifications.show({
        title: "Registration Successful",
        message: "Your account has been created. Please sign in.",
        color: "green",
      });

      navigate("/login");
    } catch (error) {
      notifications.show({
        title: "Registration Failed",
        message: error.message,
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an Account</Title>

      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Sign In
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder="JohnDoe"
            {...form.getInputProps("username")}
            required
          />
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            {...form.getInputProps("email")}
            required
            mt="md" 
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            required
            mt="md"
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps("confirmPassword")}
            required
            mt="md"
          />

          <Button type="submit" fullWidth mt="xl">
            Sign Up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
