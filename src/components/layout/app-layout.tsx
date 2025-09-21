import { Box, Flex, Button, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { usePost } from "@/hooks/UseApi";
import { useAuth } from "@/hooks/AuthHooks";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { setAuthenticated } = useAuth();

  const { post, error, loading: apiLoading } = usePost("/auth/logout");

  const handleLogout = async () => {
    await post({});
    setAuthenticated(false);
  };

  // if (loading) {
  //   return (
  //     <Flex minH="100vh" align="center" justify="center">
  //       <Spinner size="xl" color="gray.contrast" />
  //     </Flex>
  //   );
  // }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        bg="gray.100"
        p={4}
        minW="200px"
        borderRight="1px solid"
        borderColor="gray.contrast"
        borderCollapse={"collapse"}
      >
        <Flex align="stretch" direction="column" height="100%">
          <Button as={Link} to="/" colorPalette="gray" variant="subtle" mb={4}>
            Monitors
          </Button>
          <div style={{ flex: 1 }}></div>
          <Button
            loading={apiLoading}
            onClick={handleLogout}
            colorPalette={"gray"}
            variant={"subtle"}
          >
            Logout
          </Button>
        </Flex>
      </Box>
      {/* Main Content */}
      <Box flex="1" pt={4} pb={4} pl={20} pr={20} bg={"gray.100"}>
        {children}
      </Box>
    </Flex>
  );
};
