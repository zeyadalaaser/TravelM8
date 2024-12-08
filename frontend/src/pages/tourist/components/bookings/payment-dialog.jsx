import { useState, useEffect } from "react"
import { CreditCard, Wallet, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetchProfileInfo } from "../../api/apiService"
import { useElements, Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import Stripe from "stripe"
import { toast } from "sonner"

const stripePromise = loadStripe('pk_test_51QTROSJnQIPyN4lXWIK6v6wyxe1fW7lQWyCXtU4AnyZuIOzwCIoB64PAbKJFZ3wzAaxNx08sjdj88CVNzDJNQFf500l2rJOSAa');

const stripe = new Stripe('sk_test_51QTROSJnQIPyN4lXzIF8O09VmmlgHFExnL1Fz2LRUE4sBDWSZ0qcVn9kOCOxQWtvbElqgvRMHph5mjGxhaghtT9E00BxPVzr0G');

export default function PaymentDialog(props) {
  return <Elements stripe={stripePromise}>
    <ForSubmit {...props} />
  </Elements>
}

function ForSubmit({ isOpen, onOpenChange, currency, amount, token, onPaid }) {
  const [loading, setLoading] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [profile, setProfile] = useState();
  const elements = useElements();
  const t = useStripe();

  useEffect(() => {
    if (isOpen)
      fetchProfileInfo(token).then(setProfile);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setStripeReady(true), 150);
    }
    else {
      setStripeReady(false);
    }
  }, [isOpen]);


  const Pay = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (paymentMethod === "wallet") {
      await onPaid("Wallet", profile.wallet - amount);
      setLoading(false);
      onOpenChange(false);
      return;
    }

    const amountInCents = Math.round(amount * 100);
    const cardNumberElement = elements.getElement("cardNumber");

    const result = await t.createPaymentMethod({
      type: "card",
      card: cardNumberElement
    });

    if (result.error) {
      toast(result.error.message);
      setLoading(false);
      return;
    }

    try {
      await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        payment_method: result.paymentMethod.id,
        confirm: true,
        return_url: "https://google.com",
      });
    }
    catch (error) {
      toast(error.message);
      setLoading(false);
      return;
    }

    await onPaid("Card");
    onOpenChange(false);
    setLoading(false);
  }

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
                      <span className="text-xs text-muted-foreground">{profile?.wallet?.formatCurrency(currency)} available</span>
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
                  <div className="flex flex-col justify-center relative h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {stripeReady && <CardNumberElement className="pt-0.5 pl-6" />}
                    <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col justify-center relative h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {stripeReady && <CardExpiryElement className="pt-0.5" />}
                  </div>
                  <div className="flex flex-col justify-center relative h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {stripeReady && <CardCvcElement className="pt-0.5" />}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-6 text-center">
                <p className="text-2xl font-bold">{profile?.wallet?.formatCurrency(currency)}</p>
                <p className="text-sm text-muted-foreground">Available in Wallet</p>
              </div>
            )}
          </div>

          <Button disabled={profile?.wallet < amount || loading} className="w-full mt-4" onClick={() => Pay()}>
            {!loading ? `Pay ${(amount * 1)?.formatCurrency(currency)}` : <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

