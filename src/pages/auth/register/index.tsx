import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flex, Field, Input, Button } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/AuthHooks";
import { usePost } from "@/hooks/UseApi";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    firstName: z.string().min(1, { message: "First Name is required" }),
    lastName: z.string().min(1, { message: "Last Name is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type FormValues = z.infer<typeof formSchema>;

export const RegisterPage = () => {
  // Hooks
  const { setAuthenticated } = useAuth();

  // Post to login
  const {
    postData,
    loading: isLoading,
    error,
  } = usePost<FormValues>(
    "/auth/register",
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

  const onSubmit = async (data: FormValues) => {
    await postData({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });
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
          <Field.Root invalid={!!errors.firstName}>
            <Field.Label>First Name</Field.Label>
            <Input {...register("firstName")} />
            <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.lastName}>
            <Field.Label>Last Name</Field.Label>
            <Input {...register("lastName")} />
            <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput {...register("password")} />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.confirmPassword}>
            <Field.Label>Confirm Password</Field.Label>
            <PasswordInput {...register("confirmPassword")} />
            <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
          </Field.Root>
          <Button
            loading={isLoading}
            type="submit"
            colorPalette={"gray"}
            variant="subtle"
          >
            Register
          </Button>
          {error && <div style={{ color: "red" }}>{error}</div>}
        </Flex>
      </form>
    </Flex>
  );
};
