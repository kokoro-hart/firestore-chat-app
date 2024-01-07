"use client";
import {
  Button,
  ButtonLink,
  DialogWithTrigger,
  FieldWrapper,
  Form,
  Input,
  Skeleton,
} from "@/app/components/ui";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import React, { Suspense } from "react";
import { firebaseAuth } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { useDeleteRoom, useGetRooms, useUpdateRoom } from "../api";
import { getPath } from "@/app/utils";
import { useParams } from "next/navigation";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { Room } from "..";
import { useBoolean } from "@/app/hooks";
import * as z from "zod";

export type InlineTitleUpdateRequest = {
  name: string;
};

const schema = z.object({
  name: z.string().min(1, "Required"),
});

const RoomItem = ({ id, name }: Room) => {
  const { roomId } = useParams();
  const { mutateAsync: deleteRoom } = useDeleteRoom();
  const { mutateAsync: updateRoom, isPending: isPendingUpdate } = useUpdateRoom();
  const [isEditing, { on: editingOn, off: editingOff }] = useBoolean();

  const handleEditName = async (data: InlineTitleUpdateRequest) => {
    await updateRoom({
      roomId: id,
      name: data.name,
    });
    editingOff();
  };

  return (
    <div
      key={id}
      className={`group flex items-center gap-2 justify-between hover:bg-muted rounded-md ${
        roomId === id && "bg-muted"
      }`}
    >
      {isEditing ? (
        <div className="flex-1">
          <Form<InlineTitleUpdateRequest, typeof schema>
            id={id}
            onSubmit={handleEditName}
            options={{
              defaultValues: {
                name,
              },
              mode: "onChange",
            }}
            schema={schema}
          >
            {({ control }) => (
              <FieldWrapper name="name" control={control}>
                {({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    className="h-[52px]"
                    autoFocus
                    disabled={isPendingUpdate}
                    onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                      if (
                        event.nativeEvent.isComposing ||
                        event.key !== "Enter" ||
                        isPendingUpdate
                      ) {
                        return;
                      }
                      if (event.key === "Enter") {
                        handleEditName({ name: event.currentTarget.value });
                      }
                    }}
                    onBlur={(event) => {
                      if (event.target.value !== "" && !isPendingUpdate) {
                        handleEditName({ name: event.target.value });
                      }
                    }}
                  />
                )}
              </FieldWrapper>
            )}
          </Form>
        </div>
      ) : (
        <ButtonLink
          variant="ghost"
          className={`py-4 px-6 w-full h-full transition-none block rounded-md`}
          href={getPath.chat.room(id)}
        >
          {name}
        </ButtonLink>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 py-1">
        <Button
          size="icon"
          aria-label="edit"
          variant="ghost"
          className="hover:bg-white w-8"
          onClick={() => editingOn()}
        >
          <MdOutlineModeEdit />
        </Button>
        <DialogWithTrigger
          title="Delete Chatroom"
          triggerButton={
            <Button
              size="icon"
              aria-label="delete"
              variant="ghost"
              className="text-destructive hover:bg-white hover:text-destructive w-8"
            >
              <BsTrash3 />
            </Button>
          }
          confirmProps={{
            children: "delete",
            variant: "destructive",
            onClick: () => {
              deleteRoom({ roomId: id });
            },
          }}
        >
          {() => <div className="">Delete the chat room 「{name}」. Are you sure?</div>}
        </DialogWithTrigger>
      </div>
    </div>
  );
};

const RoomList = () => {
  const { data: rooms } = useGetRooms();
  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>
          <RoomItem {...room} />
        </li>
      ))}
    </ul>
  );
};

export const Rooms = () => {
  const { user } = useAuth();
  const handleLogout = () => {
    firebaseAuth.signOut();
  };
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 left-0 p-4 bg-white">
        <CreateRoomDialog />
      </div>
      <div className="flex-grow p-4">
        <Suspense fallback={<Skeleton className="w-full h-6 py-4 px-6 border-b border-border" />}>
          <RoomList />
        </Suspense>
      </div>
      <div className="flex flex-col sticky bottom-0 left-0 bg-white p-4">
        {user && <p className="p-4 text-md">{user.email}</p>}
        <Button
          className="bg-muted text-black flex items-center gap-2 hover:bg-gray-200"
          onClick={handleLogout}
        >
          <RiLogoutBoxLine />
          Logout
        </Button>
      </div>
    </div>
  );
};
