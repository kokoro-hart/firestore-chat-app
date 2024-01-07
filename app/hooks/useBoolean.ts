import { useReducer } from "react";

type StateType = boolean;
type ActionType = { type: "ON" } | { type: "OFF" };
type ReturnType = [
  boolean,
  {
    on: () => void;
    off: () => void;
  },
];

const booleanReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "ON":
      return true;
    case "OFF":
      return false;
    default:
      return state;
  }
};

export const useBoolean = (initialState = false): ReturnType => {
  const [state, dispatch] = useReducer(booleanReducer, initialState);

  const on = () => {
    dispatch({ type: "ON" });
  };

  const off = () => {
    dispatch({ type: "OFF" });
  };

  return [state, { on, off }];
};
