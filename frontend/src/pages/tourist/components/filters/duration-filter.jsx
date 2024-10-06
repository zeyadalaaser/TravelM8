import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function DurationFilter() {
    return <div className="mt-4">
        <h3 className="font-semibold mb-2">Duration</h3>
        <div className="space-y-2">
            <div className="flex items-center">
                <Checkbox id="1hour" />
                <Label htmlFor="1hour" className="ml-2">Up to 1 hour</Label>
            </div>
            <div className="flex items-center">
                <Checkbox id="1-4hours" />
                <Label htmlFor="1-4hours" className="ml-2">1 to 4 hours</Label>
            </div>
            <div className="flex items-center">
                <Checkbox id="4hours-1day" />
                <Label htmlFor="4hours-1day" className="ml-2">4 hours to 1 day</Label>
            </div>
            <div className="flex items-center">
                <Checkbox id="1-3days" />
                <Label htmlFor="1-3days" className="ml-2">1 to 3 days</Label>
            </div>
        </div>
    </div>
}