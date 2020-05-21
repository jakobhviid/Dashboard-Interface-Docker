import types from "./ui.types";

export const changeHeaderTitle = (newTitle:string) => {
  return {
    type: types.CHANGE_HEADER_TITLE,
    payload: newTitle,
  };
};
