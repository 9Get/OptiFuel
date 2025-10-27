import { useForm } from "@mantine/form";
import { Button, NumberInput, Select, SimpleGrid } from "@mantine/core";
import {
  FormFields,
  INITIAL_FORM_VALUES,
  SHIP_TYPES,
  ROUTE_IDS,
  FUEL_TYPES,
  WEATHER_CONDITIONS,
} from "../features/prediction/prediction.constants";

function PredictionForm({
  onPredict,
  disabled = false,
  initialValues = INITIAL_FORM_VALUES,
}) {
  const form = useForm({
    initialValues,
    validate: {
      [FormFields.DISTANCE]: (value) =>
        value > 0 ? null : "Distance must be positive",
      [FormFields.ENGINE_EFFICIENCY]: (value) =>
        value >= 1 && value <= 100
          ? null
          : "Efficiency must be between 1 and 100",
      [FormFields.MONTH]: (value) =>
        value >= 1 && value <= 12 ? null : "Month must be between 1 and 12",
    },
  });

  const handleSubmit = async (formData) => {
    onPredict(formData);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <fieldset
        disabled={disabled}
        style={{ border: "none", padding: 0, margin: 0 }}
      >
        <SimpleGrid
          cols={2}
          spacing="lg"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <NumberInput
            label="Distance (Nautical Miles)"
            placeholder="e.g., 128.52"
            precision={2}
            min={0}
            {...form.getInputProps(FormFields.DISTANCE)}
            required
          />

          <NumberInput
            label="Engine Efficiency (%)"
            placeholder="e.g., 92.98"
            precision={2}
            min={1}
            max={100}
            {...form.getInputProps(FormFields.ENGINE_EFFICIENCY)}
            required
          />
          <Select
            label="Ship Type"
            placeholder="Select ship type"
            data={SHIP_TYPES}
            {...form.getInputProps(FormFields.SHIP_TYPE)}
            required
            searchable
          />
          <Select
            label="Route"
            placeholder="Select route"
            data={ROUTE_IDS}
            {...form.getInputProps(FormFields.ROUTE_ID)}
            required
            searchable
          />
          <Select
            label="Fuel Type"
            placeholder="Select fuel type"
            data={FUEL_TYPES}
            {...form.getInputProps(FormFields.FUEL_TYPE)}
            required
          />
          <Select
            label="Weather Conditions"
            data={WEATHER_CONDITIONS}
            {...form.getInputProps(FormFields.WEATHER_CONDITIONTS)}
            required
          />
          <NumberInput
            label="Month"
            placeholder="1-12"
            min={1}
            max={12}
            step={1}
            allowDecimal={false}
            {...form.getInputProps(FormFields.MONTH)}
            required
          />
        </SimpleGrid>
        <Button type="submit" fullWidth mt="xl" size="md" loading={disabled}>
          Get Prediction
        </Button>
      </fieldset>
    </form>
  );
}

export default PredictionForm;
