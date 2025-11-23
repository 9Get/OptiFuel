import { useState } from "react";
import { Container, Grid, LoadingOverlay, Title, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import PredictionForm from "../components/PredictionForm";
import PredictionResult from "../components/PredictionResult";
import { getPrediction } from "../services/apiService";

function ForecastPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const predictionResult = await getPrediction(formData);
      setResult(predictionResult);
      notifications.show({
        title: "Prediction Successful",
        message: "Fuel consumption prediction received successfully.",
        color: "green",
      });
    } catch (apiError) {
      const errorMessage = apiError.message || "An unexpected error occurred.";
      setError(errorMessage);
      notifications.show({
        title: "Prediction Failed",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="lg" py="xl">
      <Title order={1} ta="center" mb="xl">
        Public Fuel Forecaster
      </Title>

      {error && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
          withCloseButton
          onClose={() => setError(null)}
          mb="md"
        >
          {error}
        </Alert>
      )}

      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} zIndex={1000} radius="sm" blur={2} />
            <PredictionForm onPredict={handleFormSubmit} isLoading={isLoading} />
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <PredictionResult result={result} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ForecastPage;
