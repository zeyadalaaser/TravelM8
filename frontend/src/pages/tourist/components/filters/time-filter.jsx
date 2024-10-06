import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function TimeFilter() {
    return <div className="mt-4">
        <h3 className="font-semibold mb-2">Time of Day</h3>
        <div className="space-y-2">
            <div className="flex items-center">
                <Checkbox id="morning" />
                <Label htmlFor="morning" className="ml-2">Morning</Label>
            </div>
            <div className="flex items-center">
                <Checkbox id="afternoon" />
                <Label htmlFor="afternoon" className="ml-2">Afternoon</Label>
            </div>
            <div className="flex items-center">
                <Checkbox id="evening" />
                <Label htmlFor="evening" className="ml-2">Evening and night</Label>
            </div>
        </div>
    </div>
}