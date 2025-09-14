import type { Check } from "../../../types/Check";
import { HStack, Flex } from "@chakra-ui/react";

const BAR_HEIGHT = 50;

export const MonitorHistogram = ({ checks }: { checks: Check[] }) => {
  const maxResponseTime = Math.max(...checks.map((c) => c.responseTime), 1);

  return (
    <HStack minHeight={`${BAR_HEIGHT}px`} overflowX="auto" gap={4}>
      {checks
        .map((check) => {
          const barHeight = (check.responseTime / maxResponseTime) * 100;
          return (
            <Flex
              key={check._id}
              border={"1px solid"}
              borderColor="gray.contrast"
              height={`${BAR_HEIGHT}px`}
              alignItems="flex-end"
            >
              <Flex
                width="10px"
                height={`${barHeight}%`}
                bg={check.status === "up" ? "green.500" : "red.500"}
              />
            </Flex>
          );
        })
        .reverse()}
    </HStack>
  );
};
