import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import classes from "./App.module.css";

import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";

function App() {
  return (
    <AppShell padding="md" header={{ height: 60 }} footer={{ height: 60 }}>
      <AppShell.Header className={classes.header}>
        <HeaderComponent />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <FooterComponent />
    </AppShell>
  );
}

export default App;
