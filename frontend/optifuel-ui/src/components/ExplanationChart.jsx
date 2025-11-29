import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Text, Paper, Title, Group, Badge } from '@mantine/core';

function ExplanationChart({ explanation }) {
  if (!explanation) return null;

  const data = Object.entries(explanation)
    .map(([name, value]) => ({
      name: name
        .replace('ship_type_', 'Ship: ')
        .replace('route_id_', 'Route: ')
        .replace('fuel_type_', 'Fuel: ')
        .replace('weather_conditions_', 'Weather: ')
        .replace('month_sin', 'Seasonality (Sin)')
        .replace('month_cos', 'Seasonality (Cos)'), 
      value: value,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 8);

  return (
    <Paper withBorder p="md" radius="md" mt="xl" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={4}>AI Reasoning (SHAP Analysis)</Title>
        <Group gap="xs">
            <Badge color="red" variant="light">Increase Consumption</Badge>
            <Badge color="green" variant="light">Decrease Consumption</Badge>
        </Group>
      </Group>
      
      <Text size="sm" c="dimmed" mb="md">
        This chart shows how each factor influenced the prediction relative to the average baseline.
      </Text>
      
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={150} tick={{fontSize: 12}} />
          <Tooltip 
            formatter={(value) => [`${value > 0 ? '+' : ''}${value.toFixed(2)} L`, 'Impact']}
            cursor={{fill: 'transparent'}}
          />
          <ReferenceLine x={0} stroke="#000" />
          <Bar dataKey="value" data={data}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#fa5252' : '#40c057'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default ExplanationChart;