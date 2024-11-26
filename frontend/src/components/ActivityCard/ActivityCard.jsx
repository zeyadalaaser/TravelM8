import React, { useState } from "react";
import { Clock, EditIcon, Tag, Trash2, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stars } from "../Stars";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function ActivityCard({
  openDialog,
  activities,
  isAdvertiser,
  isAdmin,
  onRefresh,
}) {
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/activities/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Success:", response);
      onRefresh();
      alert("Successfully deleted the activity");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete the activity");

    }

  };
  return (
    <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities?.map((activity) => (
          <Card key={activity._id} activity={activity} className="mb-6 flex flex-col h-full">

            <div className="flex-grow p-4">
              <div className="justify-self-end">
                {activity.flagged ?
                  <Badge className="bg-red-600">Flagged</Badge>
                  : <Badge className="bg-green-600">Not flagged</Badge>
                }
              </div>
              <CardHeader>
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardTitle className="overflow-hidden text-ellipsis">{activity.title}</CardTitle>
                <CardDescription className="overflow-hidden text-ellipsis">
                  {activity.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-center align-center">
                <div className="flex items-center mb-2">
                  <Stars rating={activity.averageRating} />
                  <span className="ml-2 text-sm text-gray-600">
                    {activity.totalRatings} reviews
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {activity.date.slice(0, 10)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2 gap-2">
                  <MapPin className="w-4 h-4 mr-1 shrink-0" />
                  {activity?.location?.name}
                </div>
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <Tag className="w-4 h-4 mr-1" />
                  {activity.tags?.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-semibold mr-2">Category:</span>
                  <Badge variant="outline">
                    {activity.category.name}
                  </Badge>
                </div>
                <div className="text-xl font-bold">
                  {Array.isArray(activity.price) && activity.price.length === 2
                    ? activity.price[0]
                    : activity.price} USD
                </div>
              </CardContent>
            </div>
            <CardFooter className="flex flex-col mt-auto space-y-2 p-4">
            <div className="flex justify-end items-center">
              {isAdvertiser && (
                <div className="flex items-center gap-2">
                  <Button onClick={() => openDialog({ activity })} className="border border-gray-200 text-gray-600" variant="outline">
                    <EditIcon className="mr-2 h-4 w-4" /> Edit Activity
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-red-600 hover:bg-red-800" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this Activity?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will
                          permanently delete your created activity and remove
                          it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleDelete(activity._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              {isAdmin && (
                <Button
                  onClick={() => handleFalg(activity._id)}
                  variant="destructive"
                >
                  Flag Inappropriate
                </Button>
              )}
              
            </div>
            </CardFooter>
        </Card >
        ))
}
    </div >
    </>
  );
}




