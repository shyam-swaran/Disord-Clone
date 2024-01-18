import { Menu } from "lucide-react";
import { SheetTrigger, Sheet, SheetContent } from "./ui/sheet";
import { Button } from "./ui/button";
import { NavigationSideBar } from "./navigation/navigation-sidebar";
import { ServerSidebar } from "./server/server-sidebar";

export const MobileToggle = ({ serverId }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex gap-0 p-0">
                <div className="w-[72-px]">
                    <NavigationSideBar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    );
};
