import { ToastAction } from "@/components/ui/toast"

export function CheckoutToast(toast,wallet,paymentMethod) {
    if (paymentMethod==="wallet") {
        toast({
            title: "Order placed successfully",
            description: "Your new wallet balance is: " + wallet,
            duration: 5000,
        })
    }
    else {
        toast({
            title: "Order placed successfully",
            description: "Track your order through My Orders",
            duration: 5000,
        })
    }



}