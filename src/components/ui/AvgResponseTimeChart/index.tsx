import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Box, useToken } from "@chakra-ui/react";
import { StandardText } from "@/components/ui/standardText";
export const AvgResponseTimeChart = ({
  avg,
  max,
}: {
  avg: number;
  max: number;
}) => {
  const [grayContrast, gray100] = useToken("colors", [
    "gray.contrast",
    "gray.100",
  ]);
  const chartData = [
    { name: "avg", value: avg, color: grayContrast },
    { name: "max", value: max - avg, color: gray100 },
  ];
  return (
    <Box
      flex={1}
      height="300px"
      overflow="hidden"
      position="relative"
      border={"1px solid"}
      borderColor={"gray.contrast"}
      p={2}
      mt={2}
      width="100%"
    >
      <Box pt={2} pb={2} mb={2}>
        <StandardText fontSize="2xl">Response Time</StandardText>
      </Box>
      <Box width="100%" height="600px" position="absolute" bottom={0}>
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius={"60%"}
              stroke={grayContrast}
              strokeWidth={1}
              dataKey="value"
              cy={"100%"}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};
