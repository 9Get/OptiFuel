import { Paper, Title, Grid, Text } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";

const HISTOGRAM_COLORS = {
  "Saving (>3%)": "#40c057",
  "Normal (+/-3%)": "#228be6",
  "Warning (3-7%)": "#fab005",
  "Critical (>7%)": "#fa5252",
};

function AnalyticsCharts({
  data,
  onDeviationClick,
  onShipClick,
  onWeatherClick,
}) {
  if (!data) return null;

  return (
    <>
      <Grid mb="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Title order={4} mb="md">
              Efficiency by Ship Type
            </Title>
            <Text size="xs" c="dimmed" mb="lg">
              Click bar to filter
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.shipStats}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  dataKey="shipType"
                  type="category"
                  width={100}
                  style={{ fontSize: "11px" }}
                />
                <Tooltip formatter={(val) => `${val.toFixed(2)}%`} />
                <Bar
                  dataKey="avgDeviation"
                  name="Avg Deviation %"
                  onClick={onShipClick}
                  cursor="pointer"
                >
                  {data.shipStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.avgDeviation > 0 ? "#fa5252" : "#40c057"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Title order={4} mb="md">
              Trend: Plan vs Actual
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.trendStats}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1971c2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1971c2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                <YAxis style={{ fontSize: "12px" }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#1971c2"
                  fill="url(#colorActual)"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#82ca9d"
                  fill="transparent"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Title order={4} mb="sm">
              Deviation Distribution
            </Title>
            <Text size="xs" c="dimmed" mb="md">
              Click on a bar to filter the table below
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Click bar to filter
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.histogramStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="range"
                  style={{ fontSize: "10px" }}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: "transparent" }} />

                <Bar
                  dataKey="count"
                  onClick={(data) =>
                    onDeviationClick && onDeviationClick(data.range)
                  }
                  cursor="pointer"
                >
                  {data.histogramStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={HISTOGRAM_COLORS[entry.range] || "#8884d8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Title order={4} mb="sm">
              Weather Impact on Consumption
            </Title>
            <Text size="xs" c="dimmed" mb="md">
              Average actual fuel consumption (L) per weather condition
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Click bar to filter
            </Text>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.weatherStats} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weather" />
                <YAxis />
                <Tooltip
                  formatter={(val) => `${Math.round(val).toLocaleString()} L`}
                />
                <Bar 
                dataKey="avgConsumption" 
                fill="#fab005" 
                radius={[10, 10, 0, 0]}
                onClick={onWeatherClick} 
                cursor="pointer"         
              />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default AnalyticsCharts;
