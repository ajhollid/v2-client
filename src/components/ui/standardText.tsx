import { Text } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";
export const StandardText = ({
  fontSize = "md",
  children,
}: {
  fontSize?: TextProps["fontSize"];
  children: React.ReactNode;
}) => {
  return (
    <Text fontSize={fontSize} color="gray.contrast">
      {children}
    </Text>
  );
};
