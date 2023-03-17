import { NotificationType, NotifierPort } from "core/application/port";
import { useSnackbar } from "notistack";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";

type NotifyFunction = (notification: NotificationType) => void;

const NotifierContext = createContext({
  notify: null as null | NotifyFunction,
});

export const NotifierProvider = ({
  notify,
  children,
}: PropsWithChildren<{ notify: NotifyFunction }>) => {
  return (
    <NotifierContext.Provider value={{ notify }}>
      {children}
    </NotifierContext.Provider>
  );
};

/**
 * Global notifier
 * @returns notifier object use to notify users
 */
export const useNotifier = (): NotifierPort => {
  const { enqueueSnackbar } = useSnackbar();

  /**
   * info notification
   * @param message notify message
   */
  const info = (message: string): void => {
    notify({ message: message, type: "info" });
  };

  /**
   * warn notification
   * @param message notify message
   */
  const warn = (message: string): void => {
    notify({ message: message, type: "warning" });
  };

  /**
   * success notification
   * @param message notify message
   */
  const success = (message: string): void => {
    notify({ message: message, type: "success" });
  };

  /**
   * error notification
   * @param message notify message
   */
  const error = (message: string): void => {
    notify({ message: message, type: "error" });
  };

  /**
   * global notification method
   * @param message notify message
   */
  const { notify: notifyContext } = useContext(NotifierContext);

  const notify: NotifyFunction =
    notifyContext ||
    ((notification: NotificationType) => {
      enqueueSnackbar(notification.message, {
        variant: notification.type,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    });

  return { success, error, warn, info };
};

export default useNotifier;
