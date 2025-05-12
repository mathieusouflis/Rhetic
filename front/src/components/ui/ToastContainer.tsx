import React from "react";
import { Toast, useToastStore } from "@/store/toast";
import { Button } from "./Button";
import classNames from "classnames";

const ToastMessage: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToastStore();

  const colorClasses = {
    success: "bg-green-800/20 border-green-700 text-green-400",
    error: "bg-red-800/20 border-red-700 text-red-400",
    warning: "bg-yellow-800/20 border-yellow-700 text-yellow-400",
    info: "bg-blue-800/20 border-blue-700 text-blue-400",
  };

  const iconByType = {
    success: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={classNames(
        "flex items-start p-4 mb-3 border rounded-md shadow-lg animate-slide-in",
        colorClasses[toast.type]
      )}
    >
      <div className="flex-shrink-0 mr-3">{iconByType[toast.type]}</div>
      <div className="flex-1">
        {toast.title && <h4 className="font-medium">{toast.title}</h4>}
        <p className="text-sm">{toast.message}</p>
      </div>
      <Button
        variant="text"
        size="sm"
        className="ml-3 flex-shrink-0"
        onClick={() => removeToast(toast.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-end max-w-md">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
