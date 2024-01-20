"use client";

import qs from "query-string";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";

import { Button } from "../ui/button";

import { useState } from "react";
import axios from "axios";

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === "deleteMessage";
    const { apiUrl, query } = data;

    const onCLick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            await axios.delete(url);

            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-hidden bg-white p-0 text-black">
                <DialogHeader className="px-6 pt-8">
                    <DialogTitle className="text-center text-2xl font-bold">
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this <br />
                        this message will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex w-full items-center justify-between">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost">
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onCLick}
                            variant="primary">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
