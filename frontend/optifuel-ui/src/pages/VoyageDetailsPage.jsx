import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Title, Button, Group, Paper, Text, Grid,
  NumberInput, Badge, Loader, Alert, RingProgress, Center, Stack, Divider, ThemeIcon
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconAlertCircle, IconShip, IconMapPin, IconCalendar, IconCloud, IconBrain  } from '@tabler/icons-react';

import { getVoyageById, updateVoyageActual, getVoyageExplanation  } from '../services/apiService';
import { calculateDeviation, getDeviationColor } from '../features/prediction/prediction.utils';
import ExplanationChart from '../components/ExplanationChart';

function VoyageDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [actualInput, setActualInput] = useState('');

  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    const fetchVoyage = async () => {
      try {
        const data = await getVoyageById(id);
        setVoyage(data);
        
        if (data.actualFuelConsumption) {
          setActualInput(data.actualFuelConsumption);
        }
      } catch (err) {
        setError('Voyage not found or access denied.');
      } finally {
        setLoading(false);
      }
    };
    fetchVoyage();
  }, [id]);

  const handleSave = async () => {
    if (!actualInput) return;
    setSaving(true);
    try {
      const updatedVoyage = await updateVoyageActual(id, Number(actualInput));
      setVoyage(updatedVoyage);
      notifications.show({
        title: 'Updated',
        message: 'Actual fuel consumption saved successfully.',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update voyage.',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExplain = async () => {
    setLoadingExplanation(true);
    try {
      const data = await getVoyageExplanation(id);
      setExplanation(data);
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to generate explanation.',
        color: 'red',
      });
    } finally {
      setLoadingExplanation(false);
    }
  };

  if (loading) return <Center h={400}><Loader /></Center>;
  if (error) return (
    <Container mt="xl">
        <Alert icon={<IconAlertCircle />} title="Error" color="red">{error}</Alert>
        <Button mt="md" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/history')}>Back to History</Button>
    </Container>
  );
  if (!voyage) return null;

  const predicted = voyage.predictedFuelConsumption;
  const actual = Number(actualInput);
  const deviation = calculateDeviation(actual, predicted);
  const badgeColor = getDeviationColor(deviation);
  const hasActual = actual > 0;

  const InfoRow = ({ icon: Icon, label, value }) => (
    <Group wrap="nowrap">
      <ThemeIcon variant="light" size="md" color="gray"><Icon size="1rem" /></ThemeIcon>
      <div>
        <Text size="xs" c="dimmed">{label}</Text>
        <Text size="sm" fw={500}>{value}</Text>
      </div>
    </Group>
  );

  return (
    <Container size="lg" py="xl">
      <Group mb="lg">
        <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/history')} color="gray">
          Back
        </Button>
        <Title order={2}>Voyage #{voyage.id} Details</Title>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper withBorder p="md" radius="md" shadow="sm">
            <Title order={4} mb="md">Voyage Parameters</Title>
            <Stack gap="lg">
              <Group grow>
                <InfoRow icon={IconCalendar} label="Date Created" value={new Date(voyage.createdAt).toLocaleString()} />
                <InfoRow icon={IconMapPin} label="Route" value={voyage.routeId} />
              </Group>
              <Divider />
              <Group grow>
                <InfoRow icon={IconShip} label="Ship Type" value={voyage.shipType} />
                <InfoRow icon={IconCloud} label="Weather" value={voyage.weatherConditions} />
              </Group>
              <Divider />
              <Group grow>
                <InfoRow icon={IconMapPin} label="Distance" value={`${voyage.distance} nm`} />
                <InfoRow icon={IconShip} label="Engine Efficiency" value={`${voyage.engineEfficiency}%`} />
                <InfoRow icon={IconShip} label="Fuel Type" value={voyage.fuelType} />
              </Group>
            </Stack>
          </Paper>

          {explanation ? (
             <ExplanationChart explanation={explanation} />
          ) : (
             <Paper withBorder p="md" radius="md" mt="md" bg="gray.0">
                <Group justify="space-between">
                    <div>
                        <Text fw={500}>Why this prediction?</Text>
                        <Text size="xs" c="dimmed">Use AI to analyze factors influencing this result.</Text>
                    </div>
                    <Button 
                        variant="light" 
                        leftSection={<IconBrain size={16}/>}
                        onClick={handleExplain}
                        loading={loadingExplanation}
                    >
                        Explain Prediction
                    </Button>
                </Group>
             </Paper>
          )}
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper withBorder p="md" radius="md" shadow="sm" h="100%">
            <Title order={4} mb="md">Performance Monitoring</Title>
            
            <Stack align="center" my="xl">
                <RingProgress
                    size={160}
                    thickness={16}
                    roundCaps
                    
                    sections={[{ value: 100, color: hasActual ? badgeColor : 'blue' }]}
                    label={
                        <Stack gap={0} align="center">
                            <Text size="xs" c="dimmed">Predicted</Text>
                            <Text size="xl" fw={700} c="blue">
                                {predicted.toLocaleString()} L
                            </Text>
                        </Stack>
                    }
                />
            </Stack>

            <NumberInput
                label="Actual Consumption (L)"
                description="Enter the actual value from the voyage report"
                placeholder="e.g. 4500"
                value={actualInput}
                onChange={setActualInput}
                min={0}
                mb="md"
            />

            {hasActual && (
                <Paper withBorder p="sm" bg="var(--mantine-color-body)" mb="md">
                    <Group justify="space-between">
                        <Text size="sm">Deviation:</Text>
                        <Badge color={badgeColor} size="lg" variant="filled">
                            {deviation > 0 ? '+' : ''}{deviation.toFixed(2)}%
                        </Badge>
                    </Group>
                    <Group justify="space-between" mt={5}>
                        <Text size="sm">Difference:</Text>
                        <Text size="sm" fw={700} c={badgeColor}>
                             {(actual - predicted) > 0 ? '+' : ''}{(actual - predicted).toLocaleString()} L
                        </Text>
                    </Group>
                </Paper>
            )}

            <Button 
                fullWidth 
                onClick={handleSave} 
                loading={saving}
                disabled={!actualInput || Number(actualInput) === voyage.actualFuelConsumption}
            >
                Save Results
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default VoyageDetailsPage;