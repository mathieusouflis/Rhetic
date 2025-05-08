import React, { createContext, useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Modal({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const openModal = () => {
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setInternalOpen(true);
    }
  };

  const closeModal = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

interface ModalTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function ModalTrigger({ children, asChild = false }: ModalTriggerProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalTrigger must be used within Modal");

  if (asChild) {
    const child = children as React.ReactElement<any>;
    const onClick = (e: React.MouseEvent) => {
      child.props.onClick?.(e);
      context.openModal();
    };

    return React.cloneElement(child, {
      onClick,
      "aria-haspopup": "dialog",
      "aria-expanded": context.isOpen,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      type="button"
      onClick={context.openModal}
      aria-haspopup="dialog"
      aria-expanded={context.isOpen}
    >
      {children}
    </button>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

function ModalContent({ children, className }: ModalContentProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalContent must be used within Modal");
  if (!context.isOpen) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-50",
        "animate-in fade-in duration-300"
      )}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={classNames(
          "fixed inset-0 bg-black/80",
          "animate-in fade-in duration-200"
        )}
        onClick={context.closeModal}
        aria-hidden="true"
      />

      <div
        className={classNames(
          "fixed left-[50%] top-[50%] z-50 grid w-fit translate-x-[-50%] translate-y-[-50%] gap-4",
          "animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
        )}
        role="document"
      >
        <div
          className={classNames(
            "bg-[var(--black-800)] p-6 shadow-lg rounded-lg",
            "animate-in zoom-in-95 duration-300",
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ModalCloseProps {
  children: React.ReactNode;
  className?: string;
}

function ModalClose({ children, className }: ModalCloseProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("ModalClose must be used within Modal");

  return (
    <button
      type="button"
      className={className}
      onClick={context.closeModal}
      aria-label="Close modal"
    >
      {children}
    </button>
  );
}

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Close = ModalClose;

export { Modal };
