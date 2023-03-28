export type NotificationType = {
  message: string;
  type: "default" | "error" | "success" | "warning" | "info" | undefined;
};

export type NotifierPort = {
  info: (message: string | JSX.Element) => void;
  warn: (message: string | JSX.Element) => void;
  error: (message: string | JSX.Element) => void;
  success: (message: string | JSX.Element) => void;
};
