import { Alert, Card, Center, RingProgress, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

function PredictionResult({ result }) {
  if (!result) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Waiting for Prediction"
        color="gray"
        mt="xl"
      >
        Submit the form to see the prediction result here.
      </Alert>
    );
  }

  const predicted = result.predicted_fuel_consumption;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
      <Title order={3} ta="center">
        Prediction Result
      </Title>
      <Center my="lg">
        <RingProgress
          sections={[{ value: 100, color: "blue" }]}
          size={180}
          thickness={18}
          roundCaps
          label={
            <Text с="blue" weight={700} align="center" size="xl">
              {predicted.toLocaleString()} L
            </Text>
          }
        />
      </Center>

      <Text ta="center" size="sm" color="dimmed">
        Predicted Fuel Consumption
      </Text>
    </Card>
  );
}

export default PredictionResult;
