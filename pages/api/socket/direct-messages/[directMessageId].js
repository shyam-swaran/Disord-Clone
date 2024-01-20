import { currentProfile } from "@/lib/current-profile";
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(req, res) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(401).json({ error: "method not allowed" });
    }
    try {
        const profile = await currentProfilePages(req);
        const { directMessageId, conversationId } = req.query;
        const { content } = req.body;
        if (!profile) {
            return res.status(401).json({ error: "Unauthorised" });
        }
        if (!conversationId) {
            return res.status(400).json({ error: "conversation ID Missing" });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        },
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        },
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        const member =
            conversation.memberOne.profileId === profile.id
                ? conversation.memberOne
                : conversation.memberTwo;
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }
        let message = await db.directMessage.findFirst({
            where: {
                id: directMessageId,
                conversationId,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        if (!message || message.deleted) {
            return res.status(404).json({ error: "Member not found" });
        }
        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorised" });
        }

        if (req.method === "DELETE") {
            message = await db.directMessage.update({
                where: {
                    id: directMessageId,
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }
        if (req.method === "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorised" });
            }
            message = await db.directMessage.update({
                where: {
                    id: directMessageId,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }
        const updateKey = `chat:${conversationId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, message);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Erro" });
    }
}
