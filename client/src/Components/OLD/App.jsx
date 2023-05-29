import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Aside,
  Text,
  MediaQuery,
  Burger,
} from '@mantine/core';

import './App.css'

import ApplicationHeader from './Components/ApplicationHeader';
import ApplicationNavbar from './Components/ApplicationNavbar';
import ApplicationSidebar from './Components/ApplicationSidebar';

export default function App() {
  const [opened, setOpened] = useState(false);
  return (
    <AppShell

      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <ApplicationNavbar />
        </Navbar>
      }
      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 350, lg: 350 }}>
            <ApplicationSidebar />
          </Aside>
        </MediaQuery>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>

            <ApplicationHeader />
          </div>
        </Header>
      }
    >
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  );
}
