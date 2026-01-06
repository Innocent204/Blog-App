"use client"

import * as React from "react";

// Define necessary types
export type ToastType = "default" | "destructive";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
  className?: string;
};

export type ToastOptions = Omit<Toast, 'id'> & { id?: string };

export type ExtendedToastOptions = ToastOptions & { variant?: "default" | "destructive" };

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// Define Action Types
export type Action =
  | {
      type: typeof actionTypes.ADD_TOAST;
      toast: Toast;
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST;
      toast: Partial<Toast> & { id: string };
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST;
      toastId?: string;
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST;
      toastId?: string;
    };

// Define State
interface State {
  toasts: Toast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, 1000);

  toastTimeouts.set(toastId, timeout);
};

// Reducer function
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, 5),
      };
    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

// Listeners for state updates
const listeners: Array<(state: State) => void> = [];

// Memory state for toasts
let memoryState: State = { toasts: [] };

// Dispatch function for state updates
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// Convenience top-level toast function (named export)
export function toast(props: ExtendedToastOptions) {
  const id = props.id || genId();
  const finalVariant: "default" | "destructive" =
    props.variant ?? (props.type === "destructive" ? "destructive" : "default");

  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  const update = (p: ToastOptions) =>
    dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...p, id } });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      variant: finalVariant,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

// Toast Hook
export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    const listener = (newState: State) => setState(newState);
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const toast = React.useMemo(
    () => ({
      toast: (props: ExtendedToastOptions) => {
        const id = props.id || genId();
        const update = (props: ToastOptions) =>
          dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
          });
        const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
        const finalVariant: "default" | "destructive" =
          props.variant ?? (props.type === "destructive" ? "destructive" : "default");

        dispatch({
          type: actionTypes.ADD_TOAST,
          toast: {
            ...props,
            id,
            variant: finalVariant,
            open: true,
            onOpenChange: (open: boolean) => {
              if (!open) dismiss();
            },
          },
        });

        return {
          id,
          dismiss,
          update,
        };
      },
      dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
    }),
    []
  );

  return {
    ...state,
    ...toast,
  };
}