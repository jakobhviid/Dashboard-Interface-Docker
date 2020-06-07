import { CLOSE_SNACKBAR, ENQUEUE_SNACKBAR, REMOVE_SNACKBAR } from "./notifier.types";

export interface INotifaction {
  message: string;
  options: {
    key: any;
    variant: "success" | "error";
    persist: boolean;
  };
}

export const enqueueSnackbar = (notification: INotifaction) => {
  const key = notification.options && notification.options.key;

  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = (key: any) => ({
  type: CLOSE_SNACKBAR,
  dismissAll: !key, // dismiss all if no key has been defined
  key,
});

export const removeSnackbar = (key: any) => ({
  type: REMOVE_SNACKBAR,
  key,
});
