import { NotificationService } from "@progress/kendo-angular-notification";

export function showNotification(message: string, type: "success" | "error" | "warning" | "info", service: NotificationService): void {
    service.show({
        content: message,
        hideAfter: 5000,
        position: { horizontal: "center", vertical: "bottom" },
        animation: { type: "slide", duration: 400 },
        type: { style: type, icon: true },
        cssClass: "notification"
    });
}