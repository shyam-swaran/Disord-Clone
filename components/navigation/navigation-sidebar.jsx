import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSideBar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect("/");
    }
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });
    return (
        <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]">
            <NavigationAction />
            <Separator className="h-2px mx-auto w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />
            <ScrollArea className="w-full flex-1">
                {servers.map((server) => {
                    return (
                        <div key={server.id} className="mb-4">
                            <NavigationItem
                                id={server.id}
                                name={server.name}
                                imageUrl={server.imageUrl}
                            />
                        </div>
                    );
                })}
            </ScrollArea>
            <div className="mt-auto flex flex-col items-center gap-y-4 pb-3">
                <ModeToggle />
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px] ",
                            userButtonPopoverCard: "pointer-events-auto",
                        },
                    }}
                />
            </div>
        </div>
    );
};
