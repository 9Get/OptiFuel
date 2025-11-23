import { AppShell, Text, Anchor, Group } from "@mantine/core";
import classes from "./FooterComponent.module.css";

function FooterComponent() {
  return (
    <AppShell.Footer className={classes.footer}>
      <Text c="dimmed" size="sm">
        © {new Date().getFullYear()} OptiFuel. All rights reserved.
      </Text>

      <Group gap="xs" justify="flex-end" wrap="nowrap">
        <Anchor c="dimmed" href="#" size="sm">
          Privacy Policy
        </Anchor>
        <Anchor c="dimmed" href="#" size="sm">
          Terms of Service
        </Anchor>
      </Group>
    </AppShell.Footer>
  );
}

export default FooterComponent;