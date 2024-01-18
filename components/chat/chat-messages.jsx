"use client";

import { ChatWelcome } from "./chat-welcome";

export const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}) => {
    return (
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
            <div className="flex-1" />
            <ChatWelcome type={type} name={name} />
        </div>
    );
};
