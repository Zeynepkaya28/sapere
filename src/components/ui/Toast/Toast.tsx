"use client";

import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Teddy, type TeddyPose } from "@/components/brand/Teddy";
import styles from "./Toast.module.css";

export type ToastInput = {
  message: string;
  pose?: TeddyPose;
  /** ms; prompt: badge toasts stay 4 s. */
  duration?: number;
};

type ToastItem = ToastInput & { id: number };

type ToastApi = { show: (toast: ToastInput) => void };

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}

const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: ToastInput) => {
    const id = nextId.current++;
    setItems((list) => [...list, { ...toast, id }].slice(-MAX_VISIBLE));
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {items.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const t = useTranslations("toast");
  const { id, message, pose = "happy", duration = 4000 } = item;

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), duration);
    return () => window.clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div className={styles.toast}>
      <Teddy pose={pose} size={40} />
      <p className={styles.message}>{message}</p>
      <button
        type="button"
        className={styles.close}
        onClick={() => onDismiss(id)}
        aria-label={t("close")}
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>
  );
}
