import { useState } from "react";
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';


export function ReviewDialog({
  isOpen,
  onClose,
  touristId,
  entityId,
  entityType,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const submitRating = async () => {
    if (rating === 0 || !comment.trim()) {
      setError("Please provide a valid rating and comment.");
      return;
    }

    try {
      console.log({
        entityId,
        touristId,
        entityType,
        rating,
        comment,
      });

      // Send the request to the backend
      await axios.post("http://localhost:5001/api/ratings", {
        userId: touristId,
        entityId,
        entityType,
        rating,
        comment,
      });
      // If successful, alert the user and close the modal
      toast("Rating submitted successfully!");
      onClose();
      setComment("");
      setError("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rating Form</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rating" className="text-right">
              Rating
            </Label>
            <Select
              value={rating.toString()}
              onValueChange={(value) => setRating(Number(value))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Select Rating</SelectItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Star{num > 1 && "s"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="comment" className="text-right">
              Comment
            </Label>
            <Textarea
              id="comment"
              value={comment}
              placeholder="Write your comment here..."
              onChange={(e) => setComment(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submitRating}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
