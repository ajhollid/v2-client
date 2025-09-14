import { useState } from "react";
import { Flex, Field, Input, Button } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/AuthHooks";
import { usePost } from "@/hooks/UseApi";
import { useNavigate } from "react-router-dom";

type LoginData = {
  username: string;
  password: string;
};

export const LoginPage = () => {
  // Hooks
  const { setAuthenticated } = useAuth();

  // Post to login
  const {
    postData,
    loading: isLoading,
    error,
  } = usePost<LoginData, { email: string; password: string }>(
    "/auth/login",
    {},
    () => {
      setAuthenticated(true);
      navigate("/");
    },
    () => {
      setAuthenticated(false);
    }
  );
  const navigate = useNavigate();
  // Local state for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await postData({ email, password });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <Flex width={"100vw"} alignContent={"center"} justifyContent={"center"}>
      <form onSubmit={onSubmit}>
        <Flex
          maxWidth={400}
          alignContent={"center"}
          justifyContent={"center"}
          height="100vh"
          direction={"column"}
          gap={4}
        >
          <Field.Root>
            <Input
              placeholder="Email"
              value={email}
              onChange={onChange}
              name="email"
            />
          </Field.Root>
          <Field.Root>
            <PasswordInput
              placeholder="Password"
              value={password}
              onChange={onChange}
              name="password"
            />
          </Field.Root>
          <Button
            loading={isLoading}
            type="submit"
            colorPalette={"gray"}
            variant="subtle"
          >
            Login
          </Button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </Flex>
      </form>
    </Flex>
  );
};
