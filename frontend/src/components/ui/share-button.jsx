import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Copy, CircleCheck, Mail } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"

export function ShareButton({ className, id, name }) {
    let type = "";
    switch (name) {
        case "activity":
            type = "activities";
            break;
        case "itinerary":
            type = "itineraries";
            break;
        case "place":
            type = "museums";
            break;
        case "product":
            type = "products";
            break;
    }
    
    const url = window.location.origin + "/tourist-page?type=" + type + "&id=" + id;
    const { toast } = useToast();
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Share ${name}`}
                    className={className}
                >
                    <Share2 className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[350px]">
                <h3 className="text-lg font-semibold">Share this {name}</h3>
                <div className="flex justify-start pt-2 space-x-3">
                    <Input
                        id="link"
                        defaultValue={url}
                        readOnly
                        className="h-9"
                    />
                    <Button variant="ghost"
                        className="h-fit w-fit space-x-2 items-center px-0 py-0 mt-2 hover:bg-transparent"
                        onClick={async () => {
                            await navigator.clipboard.writeText(url);
                            toast({
                                title: (
                                    <div className="flex flex-row space-x-2 items-center">
                                        <CircleCheck />
                                        <span>Link copied!</span>
                                    </div>),
                                className: 'w-[185px]',
                                duration: 3000
                            })
                        }}>
                        <Copy />
                    </Button>
                    <Button variant="ghost"
                        className="h-fit w-fit space-x-2 items-center px-0 py-0 mt-2 hover:bg-transparent"
                        onClick={() => {
                            window.location.href = `mailto:?body=Check out this ${name}: ${encodeURIComponent(url)}`;
                        }}
                    >
                        <Mail />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}