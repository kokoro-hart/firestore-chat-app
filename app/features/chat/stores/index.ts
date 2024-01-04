import { atom } from "jotai/vanilla";

type Room = {
  id: string | undefined;
  name: string | undefined;
};

export const roomAtom = atom<Room>({
  id: undefined,
  name: undefined,
});
