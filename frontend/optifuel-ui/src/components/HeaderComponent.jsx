import {
  Group,
  Title,
  Button,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconSun, IconMoon } from "@tabler/icons-react";
import classes from "./HeaderComponent.module.css";

import ShipLogo from "../assets/ship-header-logo.svg?react";
import { useAuth } from "../context/AuthContext";

function HeaderComponent() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const authedLinks = (
    <>
      <Button
        component={Link}
        to="/"
        variant="subtle"
        className={classes.navButton}
        fz={18}
      >
        Home
      </Button>
      <Button
        component={Link}
        to="/predict"
        variant="subtle"
        className={classes.navButton}
        fz={18}
      >
        Voyage Forecast
      </Button>
      <Button
        component={Link}
        to="/history"
        variant="subtle"
        className={classes.navButton}
        fz={18}
      >
        Forecast History
      </Button>
    </>
  );

  const guestLinks = (
    <>
      <Button component={Link} to="/login" variant="default">
        Sign In
      </Button>
      <Button
        component={Link}
        to="/register"
        variant="gradient"
        gradient={{ from: "blue", to: "cyan" }}
      >
        Sign Up
      </Button>
    </>
  );

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group component={Link} to="/" className={classes.logoGroup} gap={10}>
        <ShipLogo alt="OptiFuel Logo" className={classes.logoIcon} />

        <Title order={3} className={classes.logoTitle}>
          OptiFuel
        </Title>
      </Group>

      <Group gap={5} visibleFrom="sm">
        {isAuthenticated ? (
          <>
            {authedLinks}
            <Button variant="light" color="red" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          guestLinks
        )}

        <ActionIcon
          onClick={toggleColorScheme}
          variant="default"
          size="lg"
          aria-label="Toggle color scheme"
        >
          {colorScheme === "dark" ? (
            <IconSun size="1.2rem" />
          ) : (
            <IconMoon size="1.2rem" />
          )}
        </ActionIcon>
      </Group>
    </Group>
  );
}

export default HeaderComponent;
