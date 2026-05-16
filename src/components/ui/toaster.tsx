"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastProgress,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, duration, ...props }) {
        return (
          <Toast key={id} variant={variant} duration={duration} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle variant={variant as string}>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
            <ToastProgress variant={variant as string} duration={duration} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
