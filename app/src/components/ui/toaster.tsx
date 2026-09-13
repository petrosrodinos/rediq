import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

const VARIANT_ICON = {
  success: { Icon: CheckCircle2, className: "bg-moss-soft text-moss" },
  destructive: { Icon: XCircle, className: "bg-rose-soft text-rose" },
  error: { Icon: XCircle, className: "bg-rose-soft text-rose" },
  warning: { Icon: AlertTriangle, className: "bg-amber-soft text-amber" },
  info: { Icon: Info, className: "bg-sea-soft text-sea" },
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right" duration={4000}>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        const iconConfig = VARIANT_ICON[(variant ?? "success") as keyof typeof VARIANT_ICON];

        return (
          <Toast key={id} variant={variant} {...props}>
            {iconConfig && (
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconConfig.className}`}>
                <iconConfig.Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
