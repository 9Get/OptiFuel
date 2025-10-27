import { useState } from "react";
import {
  Alert,
  Box,
  Grid,
  GridCol,
  LoadingOverlay,
  Stack,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import PredictionForm from "../../components/PredictionForm";
import PredicitonResult from "../../components/PredictionResult";
import api from "../../services/api";

const PredictionView = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualConsumption, setActualConsumption] = useState("");

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setActualConsumption("");

    try {
      const predictionResult = await api.predictFuelConsumption(formData);

      setResult(predictionResult);
      notifications.show({
        title: "Success",
        message: "Prediction received successfully!",
        color: "green",
      });
    } catch (apiError) {
      setError(apiError.message);
      notifications.show({
        title: "Error",
        message: apiError.message,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid justify="center">
      <GridCol span={{ base: 12, md: 7, lg: 8 }}>
        <Stack gap="xl">
          <Box pos="relative">
            <LoadingOverlay
              visible={isLoading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
            />

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
            <PredictionForm onPredict={handlePredict} disabled={isLoading} />
          </Box>
          <PredicitonResult
            result={result}
            actualConsumption={actualConsumption}
            setActualConsumption={setActualConsumption}
          />
        </Stack>
      </GridCol>
    </Grid>
  );
};

export default PredictionView;
