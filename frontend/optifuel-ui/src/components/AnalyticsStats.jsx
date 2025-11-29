import {
  Paper,
  Group,
  Text,
  SimpleGrid,
  RingProgress,
  Center,
  Stack,
} from "@mantine/core";
import {
  IconChartBar,
  IconGasStation,
  IconAlertTriangle,
} from "@tabler/icons-react";

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {title}
          </Text>
          <Text fw={700} fz="xl">
            {value}
          </Text>
        </div>
        <Icon size="1.4rem" stroke={1.5} color={color} />
      </Group>
    </Paper>
  );
}

function AnalyticsStats({ data }) {
  if (!data) return null;

  const deviationColor =
    data.globalAverageDeviation > 5
      ? "red"
      : data.globalAverageDeviation < 0
      ? "green"
      : "blue";

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} mt="md" mb="xl">
      <StatCard
        title="Total Voyages"
        value={data.totalVoyages}
        icon={IconChartBar}
        color="blue"
      />
      <StatCard
        title="Total Fuel Predicted"
        value={`${data.totalPredictedVolume.toLocaleString()} L`}
        icon={IconGasStation}
        color="cyan"
      />

      <Paper withBorder p="xs" radius="md">
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[
              {
                value: Math.min(Math.abs(data.globalAverageDeviation) * 2, 100),
                color: deviationColor,
              },
            ]}
            label={
              <Center>
                <IconAlertTriangle size="1.2rem" stroke={1.5} />
              </Center>
            }
          />
          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              Avg Deviation
            </Text>
            <Text fw={700} size="xl" c={deviationColor}>
              {data.globalAverageDeviation > 0 ? "+" : ""}
              {data.globalAverageDeviation.toFixed(2)}%
            </Text>
          </div>
        </Group>
      </Paper>
    </SimpleGrid>
  );
}

export default AnalyticsStats;
