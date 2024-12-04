import { toast } from "sonner";

export function CheckoutToast(wallet, paymentMethod) {
    if (paymentMethod === "wallet") {
        toast("Order placed successfully", {
            description: "Your new wallet balance is: " + wallet,
            duration: 5000,
        })
    }
    else {
        toast("Order placed successfully", {
            description: "Track your order through My Orders",
            duration: 5000,
        })
    }

}