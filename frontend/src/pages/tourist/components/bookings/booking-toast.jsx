import { ToastAction } from "@/components/ui/toast"

export function BookingToast(toast, name, message, confirm = true) {
    const confirmation = () => toast({
        title: "Booking Confirmation",
        description: message,
    });

    if (!confirm)
    {
        confirmation();
        return;
    }

    toast({
        title: "Booking Confirmation",
        description: "Book the selected " + name + "?",
        duration: 10000,
        action: (
            <ToastAction altText="Yes" onClick={confirmation}>
                Yes
            </ToastAction>
        )
    })
}