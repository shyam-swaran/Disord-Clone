import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "method not allowed" });
    }
    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) {
            return res.status(401).json({ error: "Unauthorised" });
        }
        if (!serverId) {
            return res.status(400).json({ error: "Server ID Missing" });
        }
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID Missing" });
        }
        if (!content) {
            return res.status(400).json({ error: "Content ID Missing" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                members: true,
            },
        });
        if (!server) {
            return res.send(404).json({ message: "server not found" });
        }

        const channel = await db.Channel.findFirst({
            where: {
                id: channelId,
                serverId: serverId,
            },
        });
        if (!channel) {
            return res.send(404).json({ message: "channel not found" });
        }
        const member = server.members.find(
            (member) => member.profileId === profile.id
        );
        if (!member) {
            return res.send(404).json({ message: "Member not found" });
        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Error" });
    }
}
