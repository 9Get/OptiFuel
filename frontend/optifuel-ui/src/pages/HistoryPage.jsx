import { useState, useEffect } from "react";
import {
  Table,
  Title,
  Container,
  Alert,
  Loader,
  Center,
  Group,
  Pagination,
  UnstyledButton,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconSelector,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../services/apiService";
import classes from "./HistoryPage.module.css";

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function HistoryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ items: [], metadata: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    sortBy: "CreatedAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getHistory(queryParams);
        setData(response);
      } catch (err) {
        setError(err.message || "Failed to fetch prediction history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [queryParams]);

  const handleSort = (field) => {
    const isAsc =
      queryParams.sortBy === field && queryParams.sortOrder === "asc";
    setQueryParams({
      ...queryParams,
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
      page: 1,
    });
  };

  const rows = data.items.map((row) => (
    <Table.Tr
      key={row.id}
      onClick={() => navigate(`/voyages/${row.id}`)}
      className={classes.tableRow}
    >
      <Table.Td>{new Date(row.createdAt).toLocaleDateString()}</Table.Td>

      <Table.Td>{row.shipType}</Table.Td>
      <Table.Td>{row.routeId}</Table.Td>

      <Table.Td>{row.distance} nm</Table.Td>
      <Table.Td>{row.engineEfficiency}%</Table.Td>
      <Table.Td>{row.fuelType}</Table.Td>
      <Table.Td>{row.weatherConditions}</Table.Td>

      <Table.Td fw={700}>
        {row.predictedFuelConsumption.toLocaleString()}
      </Table.Td>
      <Table.Td>
        {row.actualFuelConsumption
          ? row.actualFuelConsumption.toLocaleString()
          : "—"}
      </Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        Forecast History
      </Title>

      <Table.ScrollContainer minWidth={1000}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={queryParams.sortBy === "CreatedAtUtc"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("CreatedAtUtc")}
              >
                Date
              </Th>

              <Th
                sorted={queryParams.sortBy === "ShipType"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("ShipType")}
              >
                Ship
              </Th>
              <Th
                sorted={queryParams.sortBy === "RouteId"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("RouteId")}
              >
                Route
              </Th>

              <Th
                sorted={queryParams.sortBy === "Distance"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("Distance")}
              >
                Dist.
              </Th>
              <Th
                sorted={queryParams.sortBy === "EngineEfficiency"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("EngineEfficiency")}
              >
                Eff.
              </Th>
              <Th
                sorted={queryParams.sortBy === "FuelType"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("FuelType")}
              >
                Fuel
              </Th>
              <Th
                sorted={queryParams.sortBy === "WeatherConditions"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("WeatherConditions")}
              >
                Weather
              </Th>

              {/* STATS */}
              <Th
                sorted={queryParams.sortBy === "PredictedFuelConsumption"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("PredictedFuelConsumption")}
              >
                Predicted (L)
              </Th>
              <Th
                sorted={queryParams.sortBy === "ActualFuelConsumption"}
                reversed={queryParams.sortOrder === "desc"}
                onSort={() => handleSort("ActualFuelConsumption")}
              >
                Actual (L)
              </Th>

              {/* <Table.Th>Dev %</Table.Th> */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <Center>No history found.</Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {data.metadata && data.metadata.totalPageCount > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            total={data.metadata.totalPageCount}
            value={queryParams.page}
            onChange={(newPage) =>
              setQueryParams({ ...queryParams, page: newPage })
            }
          />
        </Group>
      )}
    </Container>
  );
}

export default HistoryPage;
