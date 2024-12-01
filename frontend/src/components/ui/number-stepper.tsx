"use client"

import * as React from "react"
import { Minus, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NumberStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}: NumberStepperProps) {
  const handleIncrement = () => {
    const newValue = Math.min(value + step, max)
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min)
    onChange(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value)
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease value"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        className="w-12 h-8 text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
        step={step}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase value"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}

