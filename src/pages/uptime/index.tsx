import { useParams, Navigate } from "react-router-dom";
import {
  VStack,
  HStack,
  Spinner,
  Box,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { StandardText } from "@/components/ui/standardText";
import { ResponseTimeChart } from "@/components/ui/ResponseTimeChart";
import { useGet } from "@/hooks/UseApi";
import { AvgResponseTimeChart } from "@/components/ui/AvgResponseTimeChart";
import { MonitorMiniHistogram } from "@/components/ui/MonitorMiniHistogram";

interface IMonitorStats {
  monitorId: string;
  avgResponseTime: number;
  maxResponseTime: number;
  totalChecks: number;
  totalUpChecks: number;
  totalDownChecks: number;
  uptimePercentage: number;
  lastCheckTimestamp: number;
  lastResponseTime: number;
  timeOfLastFailure: number;
  currentStreak: number;
  currentStreakStatus: string;
  currentStreakStartedAt: number;
  createdAt: Date;
  updatedAt: Date;
}

export const UptimePage = () => {
  const { id } = useParams();
  const [range, setRange] = useState("30m");

  const { response, error, loading } = useGet<any>(
    `/monitors/${id}?embedChecks=true&range=${range}`
  );
  const {
    response: upResponse,
    error: upError,
    loading: upLoading,
  } = useGet<any>(`/monitors/${id}?embedChecks=true&range=${range}&status=up`);

  const {
    response: downResponse,
    error: downError,
    loading: downLoading,
  } = useGet<any>(
    `/monitors/${id}?embedChecks=true&range=${range}&status=down`
  );

  if (!id) {
    return <Navigate to="/uptimes" replace={true} />;
  }

  const monitor = response?.data?.monitor;
  const stats: IMonitorStats = response?.data?.stats;

  const lastChecked = (
    (Date.now() - (stats?.lastCheckTimestamp ?? 0)) /
    1000
  ).toFixed(0);

  const streakDuration = stats?.currentStreakStartedAt
    ? (Date.now() - stats?.currentStreakStartedAt) / 1000
    : 0;

  const streakStatus = stats?.currentStreakStatus || "unknown";

  return (
    <VStack gap={0} align={"start"}>
      <StandardText fontSize="lg">{monitor?.name}</StandardText>
      <HStack>
        <StandardText fontSize="sm">{`{ ${monitor?.status} }`}</StandardText>
        <StandardText fontSize="sm">{monitor?.url}</StandardText>
        <StandardText fontSize="sm">&middot;</StandardText>
        <StandardText fontSize="sm">{`Checking every ${monitor?.interval} ms`}</StandardText>
      </HStack>
      <HStack width={"100%"}>
        <Box
          flex={1}
          border={"1px solid"}
          borderColor={"gray.contrast"}
          p={2}
          mt={2}
        >
          <VStack gap={0} align={"start"}>
            <StandardText fontSize="m">{`${streakStatus} for `}</StandardText>
            <StandardText fontSize="sm">{`${streakDuration} seconds`}</StandardText>
          </VStack>
        </Box>
        <Box
          flex={1}
          border={"1px solid"}
          borderColor={"gray.contrast"}
          p={2}
          mt={2}
        >
          <VStack gap={0} align={"start"}>
            <StandardText fontSize="m">{`Last checked`}</StandardText>
            <StandardText fontSize="sm">{`${lastChecked} seconds ago`}</StandardText>
          </VStack>
        </Box>
        <Box
          flex={1}
          border={"1px solid"}
          borderColor={"gray.contrast"}
          p={2}
          mt={2}
        >
          <VStack gap={0} align={"start"}>
            <StandardText fontSize="m">{`Last response time`}</StandardText>
            <StandardText fontSize="sm">{`${
              stats?.lastResponseTime ?? 0
            } ms`}</StandardText>
          </VStack>
        </Box>
      </HStack>
      <HStack width={"100%"} justify={"end"} mt={1}>
        <StandardText fontSize="sm">View data for most recent:</StandardText>
        <ButtonGroup variant="outline" attached>
          <Button
            color={range === "30m" ? "gray.100" : "gray.contrast"}
            bg={range === "30m" ? "gray.contrast" : ""}
            variant={range === "30m" ? "solid" : "outline"}
            _hover={
              range === "30m"
                ? { color: "gray.100" }
                : { color: "gray.100", bg: "gray.contrast" }
            }
            size="sm"
            onClick={() => setRange("30m")}
          >
            30 mins
          </Button>
          <Button
            color={range === "24h" ? "gray.100" : "gray.contrast"}
            bg={range === "24h" ? "gray.contrast" : ""}
            variant={range === "24h" ? "solid" : "outline"}
            _hover={
              range === "24h"
                ? { color: "gray.100" }
                : { color: "gray.100", bg: "gray.contrast" }
            }
            size="sm"
            onClick={() => setRange("24h")}
          >
            24 hours
          </Button>
          <Button
            color={range === "7d" ? "gray.100" : "gray.contrast"}
            bg={range === "7d" ? "gray.contrast" : ""}
            variant={range === "7d" ? "solid" : "outline"}
            _hover={
              range === "7d"
                ? { color: "gray.100" }
                : { color: "gray.100", bg: "gray.contrast" }
            }
            onClick={() => setRange("7d")}
            size="sm"
          >
            7 days
          </Button>
          <Button
            color={range === "30d" ? "gray.100" : "gray.contrast"}
            bg={range === "30d" ? "gray.contrast" : ""}
            variant={range === "30d" ? "solid" : "outline"}
            _hover={
              range === "30d"
                ? { color: "gray.100" }
                : { color: "gray.100", bg: "gray.contrast" }
            }
            onClick={() => setRange("30d")}
            size="sm"
          >
            30 days
          </Button>
        </ButtonGroup>
      </HStack>
      <HStack width={"100%"} height={"300px"}>
        <MonitorMiniHistogram
          loading={upLoading}
          checks={upResponse?.data?.checks || []}
          status="up"
          max={stats?.maxResponseTime}
        />
        <MonitorMiniHistogram
          loading={downLoading}
          checks={downResponse?.data?.checks || []}
          status="down"
          max={stats?.maxResponseTime}
        />
        <AvgResponseTimeChart
          avg={stats?.avgResponseTime}
          max={stats?.maxResponseTime}
        />
      </HStack>
      <ResponseTimeChart checks={response?.data.checks} loading={loading} />
    </VStack>
  );
};
