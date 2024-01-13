import React from "react"

interface Props extends React.TableHTMLAttributes<HTMLTableElement> { }

export const Table = ({ children, ...props }: Props) => {
    return (
        <table className="min-w-full divide-y divide-gray-200 border border-slate-300"
            {...props}
        >
            {children}
        </table>

    )
}

interface TbodyProps extends React.HTMLAttributes<HTMLElement> { }

export const Tbody = ({ children, ...props }: TbodyProps) => {
    return (
        <tbody
            className="bg-white divide-y divide-gray-200 border"
            {...props}
        >
            {children}
        </tbody>
    )
}

interface TdProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> { }

export const Td = ({ children, ...props }: TdProps) => {
    return (
        <td
            className="truncate-25 px-6 py-4 text-black text-center"
            {...props}
        >
            {children}
        </td>
    )
}

interface ThProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> { }

export const Th = ({ children, ...props }: ThProps) => {
    return (
        <th
            scope="col"
            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            {...props}
        >
            {children}
        </th>
    )
}

interface TheadProps extends React.HTMLAttributes<HTMLElement> { }

export const Thead = ({ children, ...props }: TheadProps) => {
    return (
        <thead
            className="bg-gray-50"
            {...props}
        >
            {children}
        </thead>
    )
}

export default {
    Table,
    Thead,
    Tbody,
    Th,
    Td
}