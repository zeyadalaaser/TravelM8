import { Clock, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars } from "../stars";
import { Button } from "@/components/ui/button";


function Activities({ token, bookActivity, activities, currency, exchangeRate }) {
  
  const handleBook = (activityId) =>{
    // if(bookActivity){
      const response =  bookActivity(activityId, token);
      alert(response.message);
  }

  
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <Card key={index}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
              <div className="flex items-center mb-2">
                <Stars rating={activity.averageRating} />
                <span className="ml-2 text-sm text-gray-600">
                  {activity.totalRatings} reviews
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {activity.description}
              </p>
              <div className="flex items-center text-sm text-gray-600 mb-2 gap-2">
                <Clock className="w-4 h-4 mr-1" />
                {activity.date.slice(0, 10)}
              </div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <Tag className="w-4 h-4 mr-1" />
                {activity.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary">
                    {tag?.name ?? tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center mb-2">
                <span className="text-sm font-semibold mr-2">Category:</span>
                <Badge variant="outline">
                  {activity.categoryName ?? activity.category}
                </Badge>
              </div>
              <div className="text-xl font-bold">
                {Array.isArray(activity.price) && activity.price.length === 2
                  ? `${(activity.price[0] * exchangeRate).toFixed(2)} - ${(
                      activity.price[1] * exchangeRate
                    ).toFixed(2)} ${currency}`
                  : `${(activity.price * exchangeRate).toFixed(2)} ${currency}`}
              </div>
              <div className="flex justify-end items-center">
                <Button onClick={()=>handleBook(activity._id)}>Book Activity!</Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default Activities;
