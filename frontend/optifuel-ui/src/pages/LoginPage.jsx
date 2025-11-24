import { useForm } from "@mantine/form";
import {
  Button,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Container,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/apiService";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must have at least 6 characters",
    },
  });

  const handleSubmit = async (values) => {
    try {
      const response = await loginUser(values);

      if (response.token) {
        login(response.token);

        notifications.show({
          title: "Success",
          message: "You have logged in successfully!",
          color: "green",
        });
        
        navigate("/");
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      notifications.show({
        title: "Login Failed",
        message: error.message,
        color: "red",
      });
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            {...form.getInputProps("email")}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            required
            mt="md"
          />
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginPage;
