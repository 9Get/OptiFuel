import { Title, Text, Container, SimpleGrid } from "@mantine/core";
import classes from "../../pages/HomePage.module.css";

export function HowItWorksSection() {
  return (
    <div className={classes.howItWorksSection}>
      <Container size="lg" py="xl">
        <Title order={2} ta="center" c="white">
          How It Works: A Simple Three-Step Process
        </Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          <div>
            <Text c="white" fw={700} fz="xl">
              1. Input Parameters
            </Text>
            <Text c="gray.4">
              Provide key details about the upcoming voyage, such as distance,
              vessel type, and expected weather conditions through our intuitive
              interface.
            </Text>
          </div>
          <div>
            <Text c="white" fw={700} fz="xl">
              2. Receive AI Forecast
            </Text>
            <Text c="gray.4">
              Our machine learning model instantly analyzes the inputs against
              historical data to deliver a highly accurate fuel consumption
              forecast.
            </Text>
          </div>
          <div>
            <Text c="white" fw={700} fz="xl">
              3. Monitor & Analyze
            </Text>
            <Text c="gray.4">
              For registered users, compare the forecast with actual results,
              track performance over time, and gain valuable insights through
              your personal dashboard.
            </Text>
          </div>
        </SimpleGrid>
      </Container>
    </div>
  );
}
