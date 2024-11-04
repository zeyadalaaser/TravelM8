<><Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => fetchPlaceDetails}>
            <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Send a Postcard</DialogTitle>
            <DialogDescription>
                Write a message and send a virtual postcard to your loved ones.
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    required
                    className="min-h-[150px] bg-[url('/placeholder.svg?height=200&width=300')] bg-cover bg-center bg-no-repeat text-black font-handwriting" />
            </div>
            <div className="pt-4 flex justify-between items-center border-t">
                <div className="text-sm text-muted-foreground">
                    Greetings from React Land!
                </div>
                <Button type="submit">Send Postcard</Button>
            </div>
        </form>
    </DialogContent>
</Dialog>

<Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
                Edit 
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                    Anyone who has this link will be able to view this.
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                        Link
                    </Label>
                    <Input
                        id="link"
                        defaultValue="https://ui.shadcn.com/docs/installation"
                        readOnly />
                </div>
                <Button type="submit" size="sm" className="px-3">
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog></>