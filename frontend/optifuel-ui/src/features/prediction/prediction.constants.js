export const SHIP_TYPES = [
  "Oil Service Boat",
  "Fishing Trawler",
  "Surfer Boat",
  "Tanker Ship",
];

export const ROUTE_IDS = [
  "Warri-Bonny",
  "Port Harcourt-Lagos",
  "Lagos-Apapa",
  "Escravos-Lagos",
];

export const FUEL_TYPES = ["HFO", "Diesel"];

export const WEATHER_CONDITIONS = ["Calm", "Moderate", "Stormy"];

export const FormFields = {
  DISTANCE: "distance",
  ENGINE_EFFICIENCY: "engine_efficiency",
  SHIP_TYPE: "ship_type",
  ROUTE_ID: "route_id",
  FUEL_TYPE: "fuel_type",
  WEATHER_CONDITIONTS: "weather_conditions",
  MONTH: "month",
};

export const INITIAL_FORM_VALUES = {
  [FormFields.DISTANCE]: 100.0,
  [FormFields.ENGINE_EFFICIENCY]: 100.0,
  [FormFields.SHIP_TYPE]: SHIP_TYPES[0],
  [FormFields.ROUTE_ID]: ROUTE_IDS[0],
  [FormFields.FUEL_TYPE]: FUEL_TYPES[0],
  [FormFields.WEATHER_CONDITIONTS]: WEATHER_CONDITIONS[0],
  [FormFields.MONTH]: 1,
};

export const DEVIATION_THRESHOLDS = {
  CRITICAL: 7,
  WARNING: 3,
  GOOD_LOW: -3,
};

export const DEVIATION_COLORS = {
  CRITICAL: "red",
  WARNING: "yellow",
  GOOD: "green",
  LOW: "blue",
  DEFAULT: "gray",
};
