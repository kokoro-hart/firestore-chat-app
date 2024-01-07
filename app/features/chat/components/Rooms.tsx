"use client";
import { useParams } from "next/navigation";
import React, { Suspense } from "react";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import * as z from "zod";

import {
  Button,
  ButtonLink,
  DialogWithTrigger,
  FieldWrapper,
  Form,
  Input,
  Skeleton,
} from "@/app/components/ui";
import { useBoolean } from "@/app/hooks";
import { firebaseAuth } from "@/app/libs";
import { useAuth } from "@/app/providers";
import { getPath } from "@/app/utils";

import { Room } from "..";
import { useDeleteRoom, useGetRooms, useUpdateRoom } from "../api";

import { CreateRoomDialog } from "./CreateRoomDialog";

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
      className={`group flex items-center justify-between gap-2 rounded-md hover:bg-muted ${
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
                    // eslint-disable-next-line
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
          className="block h-full w-full rounded-md px-6 py-4 transition-none"
          href={getPath.chat.room(id)}
        >
          {name}
        </ButtonLink>
      )}
      <div className="flex items-center gap-1 py-1 opacity-0 group-hover:opacity-100">
        <Button
          size="icon"
          aria-label="edit"
          variant="ghost"
          className="w-8 hover:bg-white"
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
              className="w-8 text-destructive hover:bg-white hover:text-destructive"
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
    <div className="flex h-full flex-col">
      <div className="sticky left-0 top-0 bg-white p-4">
        <CreateRoomDialog />
      </div>
      <div className="grow p-4">
        <Suspense fallback={<Skeleton className="h-6 w-full border-b border-border px-6 py-4" />}>
          <RoomList />
        </Suspense>
      </div>
      <div className="sticky bottom-0 left-0 flex flex-col bg-white p-4">
        {user && <p className="text-md p-4">{user.email}</p>}
        <Button
          className="flex items-center gap-2 bg-muted text-black hover:bg-gray-200"
          onClick={handleLogout}
        >
          <RiLogoutBoxLine />
          Logout
        </Button>
      </div>
    </div>
  );
};
