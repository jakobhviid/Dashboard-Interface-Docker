import types from "./ui.types";

export const changeHeaderTitle = (newTitle) => {
  return {
    type: types.CHANGE_HEADER_TITLE,
    payload: newTitle,
  };
};
