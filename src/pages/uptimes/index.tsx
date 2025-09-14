import { useGet } from "@/hooks/UseApi";
import type { ApiResponse } from "@/types/ApiResponse";
import type { IMonitor } from "@/types/Monitor";
import { useNavigate } from "react-router-dom";
import { Grid, GridItem, Stack, Spinner, Text } from "@chakra-ui/react";
import { MonitorHistogram } from "@/components/ui/MonitorHistogram";
export const UptimesPage = () => {
  const { response, error, loading } = useGet<ApiResponse>(
    "/monitors?embedChecks=true"
  );
  const navigate = useNavigate();

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <Spinner size="xl" color={"gray.contrast"} />
      </Stack>
    );
  }

  return (
    <Stack>
      {response?.data?.map((monitor: IMonitor) => {
        return (
          <Grid
            key={monitor._id}
            templateColumns="1fr 9fr"
            gap={4}
            cursor={"pointer"}
            onClick={() => {
              navigate(`/uptime/${monitor._id}`);
            }}
          >
            <GridItem alignContent={"center"} overflow={"hidden"}>
              <Text color="gray.contrast" truncate>
                {monitor.name}
              </Text>
            </GridItem>
            <GridItem>
              <MonitorHistogram key={monitor._id} checks={monitor.checks} />
            </GridItem>
          </Grid>
        );
      })}
    </Stack>
  );
};
