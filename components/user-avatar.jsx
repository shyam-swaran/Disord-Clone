import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

export const UserAvatar = ({ src, className }) => {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            <AvatarImage src={src} />
        </Avatar>
    );
};
