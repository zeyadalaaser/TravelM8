import { useState, useEffect } from "react"
import { CreditCard, Wallet, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function PaymentDialog({ isOpen, onOpenChange, currency, amount }) {
  const [paymentMethod, setPaymentMethod] = useState("card")

  useEffect(() => {
    console.log(currency);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {["card", "wallet"].map((method) => (
              <div
                key={method}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${paymentMethod === method ? "border-primary bg-primary/5" : "border-muted"
                  }`}
                onClick={() => setPaymentMethod(method)}
              >
                {paymentMethod === method && (
                  <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 py-4">
                  {method === "card" ? (
                    <>
                      <CreditCard className="h-8 w-8" />
                      <span className="text-sm font-medium">Credit Card</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-8 w-8" />
                      <span className="text-sm font-medium">Wallet</span>
                      <span className="text-xs text-muted-foreground">$150 available</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="h-[100px]">
            {paymentMethod === "card" ? (
              <div className="space-y-4">
                <div className="relative">
                  <Input placeholder="Card Number" className="pl-10" />
                  <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVC" />
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold">$150.00</p>
                <p className="text-sm text-muted-foreground">Available in Wallet</p>
              </div>
            )}
          </div>

          <Button className="w-full bg-emerald-900 hover:bg-emerald-800 mt-4" onClick={() => onOpenChange(false)}>
            Pay ${`${(amount * 1)}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

