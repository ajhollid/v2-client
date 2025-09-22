import type { GroupedCheck } from "@/types/Check";
import { Box, HStack, VStack, Flex, Spinner } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { StandardText } from "../standardText";
export const MonitorMiniHistogram = ({
  checks,
  status,
  max,
  loading,
}: {
  checks: GroupedCheck[];
  status: string;
  max: number;
  loading?: boolean;
}) => {
  return (
    <Box
      flex={1}
      border={"1px solid"}
      borderColor={"gray.contrast"}
      p={2}
      mt={2}
      width="100%"
      height={"100%"}
    >
      {loading && (
        <VStack height={"100%"} justify={"center"} align={"center"}>
          <Spinner size="xl" color="gray.contrast" />
        </VStack>
      )}

      {!loading && checks?.length === 0 && (
        <VStack height={"100%"} justify={"center"} align={"center"}>
          <StandardText fontSize="sm">{`No ${status} checks in the last 30 minutes`}</StandardText>
        </VStack>
      )}

      {!loading && checks?.length > 0 && (
        <HStack
          height={"100%"}
          justify={"flex-start"}
          align={"flex-end"}
          gap={1}
        >
          {checks
            .slice()
            .reverse()
            .map((check) => {
              const safeValue = Math.max(check.avgResponseTime, 1);
              const logValue = Math.log10(safeValue);
              const logMin = Math.log10(
                Math.max(
                  Math.min(
                    ...checks.map((c) => Math.max(c.avgResponseTime, 1))
                  ),
                  1
                )
              );
              const logMax = Math.log10(
                Math.max(...checks.map((c) => Math.max(c.avgResponseTime, 1)))
              );

              const heightPct =
                logMax === logMin
                  ? 100
                  : Math.max(
                      ((logValue - logMin) / (logMax - logMin)) * 100,
                      5
                    );

              return (
                <Tooltip
                  content={
                    <VStack align={"start"} gap={0}>
                      <StandardText fontSize="xs">{`Avg response time: ${check?.avgResponseTime.toFixed(
                        2
                      )} ms`}</StandardText>
                      <StandardText fontSize="xs">{`Checks: ${check?.count}`}</StandardText>
                      <StandardText fontSize="xs">{`Bucket time: ${check?._id}`}</StandardText>
                    </VStack>
                  }
                  openDelay={10}
                  closeDelay={10}
                >
                  <Flex
                    height={`${heightPct}%`}
                    maxWidth={"10px"}
                    width={(1 / checks?.length) * 100 + "%"}
                    bg={"gray.contrast"}
                    gap={2}
                  />
                </Tooltip>
              );
            })}
        </HStack>
      )}
    </Box>
  );
};
