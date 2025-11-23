import { Title, Text, Container, SimpleGrid, ThemeIcon } from "@mantine/core";
import { IconGauge, IconSparkles, IconTable } from "@tabler/icons-react";

const features = [
  {
    icon: IconSparkles,
    title: "Accurate Voyage Forecasting",
    descryption:
      "Leverage the power of machine learning to get precise fuel consumption predictions. Plan your budgets with confidence and optimize routes before the voyage even begins.",
  },
  {
    icon: IconGauge,
    title: "Intelligent Anomaly Detection",
    descryption:
      "Go beyond simple tracking. Our system establishes a dynamic baseline for every trip and automatically flags significant deviations, helping you identify inefficiencies or potential fraud.",
  },
  {
    icon: IconTable,
    title: "Data-Driven Insights",
    descryption:
      "Unlock the story behind your data. With a comprehensive history of all forecasts and outcomes, you can identify underperforming vessels, evaluate the impact of weather, and make smarter operational decisions.",
  },
];

export function FeaturesSection() {
  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ from: "blue", to: "cyan" }}
      >
        <feature.icon style={{ width: "26px", height: "26px" }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.descryption}
      </Text>
    </div>
  ));

  return (
    <Container size="lg" py="xl" id="features">
      <Title order={2} ta="center" mt="sm">
        Navigate with Confidence and Clarity
      </Title>
      <Text c="dimmed" ta="center" mt="md" mb="xl">
        OptiFuel transforms complex operational data into clear, actionable
        intelligence. Stop guessing, start optimizing.
      </Text>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
