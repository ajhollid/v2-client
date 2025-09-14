import { useParams, Navigate } from "react-router-dom";
import { VStack, HStack, Spinner, Box } from "@chakra-ui/react";
import { StandardText } from "@/components/ui/standardText";
import { ResponseTimeChart } from "@/components/ui/ResponseTimeChart";
import { useGet } from "@/hooks/UseApi";
import { AvgResponseTimeChart } from "@/components/ui/AvgResponseTimeChart";

export const UptimePage = () => {
  const { id } = useParams();

  const { response, error, loading } = useGet<any>(
    `/monitors/${id}?embedChecks=true&range=30m`
  );

  if (!id) {
    return <Navigate to="/uptimes" replace={true} />;
  }

  if (loading) {
    return (
      <VStack alignItems="center" justifyContent="center" height="100vh">
        <Spinner size="xl" color={"gray.contrast"} />
      </VStack>
    );
  }

  const monitor = response?.data?.monitor;
  const stats = response?.data?.stats;

  const lastChecked = (
    (Date.now() - (stats?.lastCheckTimestamp ?? 0)) /
    1000
  ).toFixed(0);

  const activeFor =
    stats.timeOfLastFailure !== 0
      ? (Date.now() - stats.timeOfLastFailure) / 1000
      : 0;

  return (
    <VStack gap={0} align={"start"}>
      <StandardText fontSize="lg">{monitor?.name}</StandardText>
      <HStack>
        <StandardText fontSize="sm">{`{ ${monitor.status} }`}</StandardText>
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
            <StandardText fontSize="m">{`Active for `}</StandardText>
            <StandardText fontSize="sm">{`${activeFor} seconds`}</StandardText>
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
      <HStack width={"100%"}>
        <Box
          flex={1}
          border={"1px solid"}
          borderColor={"gray.contrast"}
          p={2}
          mt={2}
          width="100%"
        />
        <Box
          flex={1}
          border={"1px solid"}
          borderColor={"gray.contrast"}
          p={2}
          mt={2}
          width="100%"
        />
        <AvgResponseTimeChart
          avg={stats?.avgResponseTime}
          max={stats?.maxResponseTime}
        />
      </HStack>
      <ResponseTimeChart checks={response?.data.checks} />
    </VStack>
  );
};
