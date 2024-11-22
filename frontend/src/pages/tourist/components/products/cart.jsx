import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, X } from 'lucide-react'

export default function Cart({ cart, removeFromCart, updateCartItemQuantity, currency }) {
  return (
    <ScrollArea className="h-[calc(100vh-200px)] mt-4">
      {cart.map(item => (
        <div key={item._id} className="flex justify-between items-center py-4">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500">{currency} {Number(item.price).toFixed(2)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span>{item.quantity}</span>
            <Button variant="outline" size="icon" onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item._id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}