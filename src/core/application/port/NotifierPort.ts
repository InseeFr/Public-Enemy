import { ReactNode } from "react";

export type NotificationType = {
  message: string;
  type: "default" | "error" | "success" | "warning" | "info" | undefined;
};

export type NotifierPort = {
  info: (message: string | ReactNode) => void;
  warn: (message: string | ReactNode) => void;
  error: (message: string | ReactNode) => void;
  success: (message: string | ReactNode) => void;
};
