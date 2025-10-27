import { AppShell, Title, Container } from "@mantine/core";
import PredictionView from "./features/prediction/PredictionView";

function App() {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      styles={(theme) => ({
        header: {
          backgroundColor: theme.colors.blue[6],
          display: 'flex',
          alignItems: 'center',
          paddingLeft: theme.spacing.md,
        },
        main: {
          backgroundColor:
            theme.colorScheme === "white"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header>
        <Title order={2} style={{ color: "white" }}>
          🚢 OptiFuel
        </Title>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <PredictionView />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
