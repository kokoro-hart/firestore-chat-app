import {
  Button,
  DialogFooter,
  DialogWithTrigger,
  FieldWrapper,
  Form,
  Input,
} from "@/app/components/ui";
import { useCreateRoom } from "..";
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "required"),
});
export type CreateRoomRequest = z.infer<typeof schema>;

export const CreateRoomDialog = () => {
  const { mutateAsync: createRoom, isSuccess, isPending } = useCreateRoom();

  return (
    <DialogWithTrigger
      title="Create New Chatroom"
      triggerButton={<Button className="w-full">New Chat</Button>}
    >
      {({ onClose }) => (
        <Form<CreateRoomRequest>
          id="create-room"
          onSubmit={async (data) => {
            await createRoom(data);
            if (isSuccess) onClose();
          }}
          schema={schema}
        >
          {({ control }) => (
            <div className="flex flex-col gap-4">
              <FieldWrapper name="name" control={control}>
                {({ field }) => <Input placeholder="Chatroom name" {...field} />}
              </FieldWrapper>
              <DialogFooter className="justify-between">
                <Button type="submit" id="create-room" isLoading={isPending}>
                  confirm
                </Button>
              </DialogFooter>
            </div>
          )}
        </Form>
      )}
    </DialogWithTrigger>
  );
};
