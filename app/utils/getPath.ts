export const getPath = {
  root: () => "/",
  auth: {
    register: () => "/auth/register",
    login: () => "/auth/login",
  },
  chat: {
    root: () => "/chat",
    room: (roomId: string) => `/chat/${roomId}`,
  },
};
