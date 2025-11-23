import {
  Title,
  Text,
  Button,
  Container,
  Grid,
  Group,
  Image,
  List,
  ThemeIcon,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconCheck } from "@tabler/icons-react";
import heroIllustration from "../../assets/hero-illustration.png";
import classes from "../../pages/HomePage.module.css";

export function HeroSection() {
  return (
    <Container size="lg">
      <div className={classes.heroWrapper}>
        <Title className={classes.title} ta="center" mb="xl">
          Navigate the Future of Fuel Management with{" "}
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            OptiFuel
          </Text>
        </Title>

        <Grid className={classes.heroGrid} align="center">
          <Grid.Col span={8} mb="xl">
            <Image
              radius="md"
              src={heroIllustration}
              alt="Illustration of a cargo ship with analytics graphs"
            />
          </Grid.Col>

          <Grid.Col span={4}>
            <div className={classes.heroContent}>
              <Title order={3}>From Data to Decisions, Instantly.</Title>
              <Text c="dimmed" mt="md">
                OptiFuel is an intelligent platform designed to replace
                guesswork with certainty. Our advanced machine learning model
                analyzes key voyage parameters to deliver highly accurate fuel
                consumption forecasts, enabling you to optimize costs and
                enhance operational efficiency.
              </Text>
              <List
                mt="md"
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <IconCheck
                      style={{ width: "12px", height: "12px" }}
                      stroke={3}
                    />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>AI-Powered Predictions:</b> Achieve unparalleled accuracy
                  in your fuel planning.
                </List.Item>
                <List.Item>
                  <b>Strategic Monitoring:</b> Instantly identify deviations to
                  prevent waste and control expenses.
                </List.Item>
                <List.Item>
                  <b>Actionable Insights:</b> Turn historical data into a
                  strategic advantage for future voyages.
                </List.Item>
              </List>
            </div>
          </Grid.Col>

          <Grid.Col>
            <Group className={classes.controls} justify="center">
              <Button
                size="xl"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                component={Link}
                to="/predict"
              >
                Get Started
              </Button>
              <Button
                component="a"
                href="#features"
                size="xl"
                variant="default"
                classNames={{
                  root: classes.xxlButtonRoot,
                  label: classes.xxlButtonLabel,
                }}
              >
                Learn More
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </div>
    </Container>
  );
}
