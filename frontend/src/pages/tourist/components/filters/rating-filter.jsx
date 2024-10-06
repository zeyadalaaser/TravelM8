import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star } from "lucide-react";

export function RatingFilter() {
    return <div className="mt-4">
        <h3 className="font-semibold mb-2">Rating</h3>
        <RadioGroup className="space-y-2">
            <div className="flex items-center">
                <RadioGroupItem id="5star" value="5" />
                <Label htmlFor="5star" className="ml-2 flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                    <span className="ml-2">& up</span>
                </Label>
            </div>
            <div className="flex items-center">
                <RadioGroupItem id="4star" value="4" />
                <Label htmlFor="4star" className="ml-2 flex items-center">
                    {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-gray-300" />
                    <span className="ml-2">& up</span>
                </Label>
            </div>
            <div className="flex items-center">
                <RadioGroupItem id="3star" value="3" />
                <Label htmlFor="3star" className="ml-2 flex items-center">
                    {[1, 2, 3].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                    {[4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-gray-300" />
                    ))}
                    <span className="ml-2">& up</span>
                </Label>
            </div>
        </RadioGroup>
    </div>
}