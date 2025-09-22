import type { Check } from "../../../types/Check";
import { HStack, Flex } from "@chakra-ui/react";

const BAR_HEIGHT = 50;

export const MonitorHistogram = ({ checks }: { checks: Check[] }) => {
  if (checks.length === 0) return null;

  // Ensure no zero values
  const safeResponses = checks.map((c) => Math.max(c.responseTime, 1));

  const logResponses = safeResponses.map((r) => Math.log10(r));
  const logMin = Math.min(...logResponses);
  const logMax = Math.max(...logResponses);

  return (
    <HStack minHeight={`${BAR_HEIGHT}px`} overflowX="auto" gap={4}>
      {checks.map((check) => {
        const safeResponse = Math.max(check.responseTime, 1);
        const logValue = Math.log10(safeResponse);

        const barHeight =
          logMax === logMin
            ? 100
            : ((logValue - logMin) / (logMax - logMin)) * 100;

        return (
          <Flex
            key={check._id}
            border="1px solid"
            borderColor="gray.contrast"
            height={`${BAR_HEIGHT}px`}
            alignItems="flex-end"
          >
            <Flex
              width="10px"
              height={`${Math.max(barHeight, 5)}%`}
              bg={check.status === "up" ? "green.500" : "red.500"}
            />
          </Flex>
        );
      })}
    </HStack>
  );
};
