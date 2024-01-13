import React from "react";
import { IconTrash, IconPencil } from "@tabler/icons-react";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const DeleteBtn = ({ children, ...props }: BtnProps) => {
    return (
        <button
            className="rounded-sm bg-red-500 text-white p-2 aspect-square"
            {...props}
        >
            <IconTrash size={20} strokeWidth={1.5} />
            {children}
        </button>
    )
}

export const EditBtn = ({ children, ...props }: BtnProps) => {
    return (
        <button
            className="rounded-sm bg-yellow-500 text-white p-2 aspect-square"
            {...props}
        >
            <IconPencil size={20} strokeWidth={1.5} color="white" />
            {children}
        </button>
    )
}

export default {
    DeleteBtn
}
