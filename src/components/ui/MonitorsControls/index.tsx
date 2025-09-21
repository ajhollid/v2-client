import { HStack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const getLink = (type: string) => {
  switch (type) {
    case "uptime":
      return "/uptimes/create";
    default:
      return "/";
  }
};

export const MonitorsControls = ({ type }: { type: string }) => {
  const navigate = useNavigate();
  const onClick = () => {
    const link = getLink(type);
    navigate(link);
  };

  return (
    <HStack justify={"right"}>
      <Button onClick={onClick} variant={"subtle"}>
        Create
      </Button>
    </HStack>
  );
};
