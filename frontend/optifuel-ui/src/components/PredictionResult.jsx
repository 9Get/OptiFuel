import {
  Alert,
  Badge,
  Card,
  Center,
  Group,
  NumberInput,
  RingProgress,
  Text,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  calculateDeviation,
  getDeviationColor,
} from "../features/prediction/prediction.utils";

export const PredictionPlaceholder = () => (
  <Alert
    icon={<IconAlertCircle size="1rem" />}
    title={"Waiting for Prediction"}
    color="gray"
    mt="xl"
  >
    Submit the form to see the prediction result here.
  </Alert>
);

const PredictionDisplay = ({ value }) => (
  <>
    <Title order={3} align="center">
      Prediction Result
    </Title>
    <Center>
      <RingProgress
        sections={[{ value: 100, color: "blue" }]}
        size={180}
        thickness={18}
        roundCaps
        label={
          <Text c="blue" fw={700} ta="center" size="xl">
            {value.toLocaleString(undefined, { maximumFractionDigits: 0 })} L
          </Text>
        }
      />
    </Center>

    <Text align="center" size="sm" c="dimmed" mt="md">
      Predicted Fuel Consumption
    </Text>
  </>
);

const DeviationCalculator = ({
  predictedValue,
  actualValue,
  onActualValueChange,
}) => {
  const deviation = calculateDeviation(Number(actualValue), predictedValue);
  const deviationColor = getDeviationColor(deviation);
  const showDeviation = actualValue > 0;

  return (
    <>
      <NumberInput
        label="Enter Actual Consumption (Optional)"
        placeholder="e.g., 4461.44"
        precision={2}
        min={0}
        value={actualValue}
        onChange={onActualValueChange}
        mt="xl"
      />

      {showDeviation > 0 && (
        <Group justify="center" mt="md">
          <Text>Deviation:</Text>
          <Badge color={deviationColor} size="lg" variant="filled">
            {deviation.toFixed(2)}%
          </Badge>
        </Group>
      )}
    </>
  );
};

function PredictionResult({ result, actualConsumption, setActualConsumption }) {
  if (!result) {
    return <PredictionPlaceholder />;
  }

  const predictedValue = result.predicted_fuel_consumption;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <PredictionDisplay value={predictedValue} />
      <DeviationCalculator
        predictedValue={predictedValue}
        actualValue={actualConsumption}
        onActualValueChange={setActualConsumption}
      />
    </Card>
  );
}

export default PredictionResult;
