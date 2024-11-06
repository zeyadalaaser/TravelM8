import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { CheckCircle, XCircle } from "lucide-react"



const FeedbackAlert= ({ text, isSuccess, title }) => {
  const getIcon = () => {
    return isSuccess ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStyles = () => {
    return isSuccess
      ? 'bg-green-50 text-green-800 border-green-300'
      : 'bg-red-50 text-red-800 border-red-300'
  }
  console.log(text, title, isSuccess);

  return (
    <Alert className={`${getStyles()} flex items-center`}>
      <div className="mr-3">{getIcon()}</div>
      <div>
        <AlertTitle className="font-semibold">{title?.toString()}</AlertTitle>
        <AlertDescription>{text?.toString()}</AlertDescription>
      </div>
    </Alert>
  )
};


export default FeedbackAlert;