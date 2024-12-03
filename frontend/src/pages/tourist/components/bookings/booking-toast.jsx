import { toast } from "sonner"

export function BookingToast(name, message, confirm = true) {
    const confirmation = () => toast.success("Booking Confirmation", {
        description: message,
    });

    if (!confirm) {
        confirmation();
        return;
    }

    toast("Booking Confirmation", {
        description: "Book the selected " + name + "?",
        duration: 10000,
        action: {
            label: "Yes",
            onClick: confirmation
        }
    })
}