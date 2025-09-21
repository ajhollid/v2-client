import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Field, Input, Button } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/AuthHooks";
import { usePost } from "@/hooks/UseApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
type LoginData = {
  username: string;
  password: string;
};

const formSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export const LoginPage = () => {
  // Hooks
  const { setAuthenticated } = useAuth();

  const { post, loading, error } = usePost<FormValues, LoginData>(
    "/auth/login"
  );
  const navigate = useNavigate();
  // Local state for form fields

  const onSubmit = async (data: FormValues) => {
    const response = await post(data);
    if (response) {
      setAuthenticated(true);
      navigate("/");
    } else {
      setAuthenticated(false);
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Flex width={"100vw"} alignContent={"center"} justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          maxWidth={400}
          alignContent={"center"}
          justifyContent={"center"}
          height="100vh"
          direction={"column"}
          gap={4}
        >
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input {...register("email")} />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput {...register("password")} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
          <Button
            loading={loading}
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
