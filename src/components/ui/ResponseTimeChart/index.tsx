import { Box, useToken } from "@chakra-ui/react";

import type { Check } from "../../../types/Check";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StandardText } from "../standardText";

export const ResponseTimeChart = ({ checks }: { checks: Check[] }) => {
  const [grayContrast] = useToken("colors", ["gray.contrast"]);
  return (
    <Box
      border={"1px solid"}
      borderColor={"gray.contrast"}
      p={2}
      mt={2}
      width="100%"
    >
      <Box pt={2} pb={2} mb={2}>
        <StandardText fontSize="2xl">Response Time</StandardText>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={checks.slice().reverse()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="_id"
            tickFormatter={(value, index) =>
              index === 0 ? "" : new Date(value).toLocaleTimeString()
            }
          />
          <YAxis tickFormatter={(value) => `${value} ms`} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="avgResponseTime"
            stroke={grayContrast}
            fill={grayContrast}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
