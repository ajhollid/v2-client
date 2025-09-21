import {
  VStack,
  Field,
  Input,
  Button,
  NumberInput,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePost, useGet } from "@/hooks/UseApi";

type MonitorSchema = {
  name?: string;
  url: string;
  notificationChannels: string[];
  type: "http" | "https";
  interval: number;
};

const formSchema = z.object({
  url: z.url({ message: "Invalid URL" }),
  name: z.string().optional(),
  interval: z
    .number()
    .min(60000, { message: "Interval must be at least 60000 ms" }),
  notifications: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const CreateUptimePage = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { post, loading, error } = usePost<MonitorSchema, any>("/monitors");
  const { response: notifications } = useGet<{ _id: string; name: string }[]>(
    "/notification-channels"
  );

  const onSubmit = async (data: FormValues) => {
    const url = new URL(data.url);
    const type: "http" | "https" = url.protocol === "https:" ? "https" : "http";
    const monitor = {
      name: data?.name || "Uptime Monitor",
      url: data?.url,
      notificationChannels: data?.notifications || [],
      type,
      interval: data?.interval,
    };

    const response = await post(monitor);
    if (response) {
      console.log("Monitor created:", response);
    }
  };

  return (
    <VStack width={"100%"} alignContent={"center"} justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          width={400}
          maxWidth={400}
          alignContent={"center"}
          justifyContent={"center"}
          direction={"column"}
          gap={4}
        >
          <Field.Root invalid={!!errors.name}>
            <Field.Label color={"gray.800"}>Name</Field.Label>
            <Input {...register("name")} color={"gray.800"} />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.url}>
            <Field.Label color={"gray.800"}>URL</Field.Label>
            <Input {...register("url")} color={"gray.800"} />
            <Field.ErrorText>{errors.url?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.interval}>
            <Field.Label color={"gray.800"}>Interval</Field.Label>
            <Controller
              name="interval"
              control={control}
              render={({ field }) => (
                <NumberInput.Root
                  color={"gray.800"}
                  disabled={field.disabled}
                  name={field.name}
                  value={field.value?.toString() ?? ""}
                  onValueChange={({ valueAsNumber }) =>
                    field.onChange(valueAsNumber)
                  }
                >
                  <NumberInput.Control />
                  <NumberInput.Input onBlur={field.onBlur} />
                </NumberInput.Root>
              )}
            />
            <Field.ErrorText>{errors.interval?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.notifications}>
            <Field.Label color={"gray.800"}>Notifications</Field.Label>
            <Controller
              control={control}
              name="notifications"
              render={({ field }) => (
                <Select.Root
                  name={field.name}
                  value={field.value ?? []}
                  onValueChange={(details) => field.onChange(details.value)}
                  onInteractOutside={() => field.onBlur()}
                  collection={createListCollection({
                    items:
                      notifications?.data?.map((n) => ({
                        label: n.name,
                        value: n._id,
                      })) ?? [],
                  })}
                  multiple
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText
                        color={"gray.800"}
                        placeholder="Select notification channels"
                      />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {notifications?.data?.map((notification) => (
                          <Select.Item
                            item={{
                              label: notification.name,
                              value: notification._id,
                            }}
                            key={notification._id}
                          >
                            {notification.name}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              )}
            />
            <Field.ErrorText>{errors.notifications?.message}</Field.ErrorText>
          </Field.Root>
          <Button
            loading={loading}
            type="submit"
            colorPalette={"gray"}
            variant="subtle"
          >
            Create
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};
