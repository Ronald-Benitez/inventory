import { Key, useEffect, useState } from 'react';
import axios from 'axios';
import TableWithActions from '@/components/utils/table-with-actions';
import { type Categories } from '@prisma/client';
import { ColummnsBase } from '@/interfaces/tables';

interface Column extends ColummnsBase {
    key: keyof Categories;
}

interface Props {
    reload: () => void,
    data: Categories[]
}

const columns: Column[] = [
    { label: 'Name', key: "name", present: (value: any) => String(value) },
    { label: 'Created At', key: "createdAt", present: (value: any) => String(value) },
    { label: 'Updated At', key: "updatedAt", present: (value: any) => String(value) }
];

const actions = {
    delete: {
        url: '/api/categories',
        onSuccess: () => { },
        onError: () => { },
    },
};

function CategoriesTable({ reload, data }: Props) {
    return (
        <TableWithActions
            data={data}
            reload={reload}
            columns={columns}
            actions={actions}
        />
    );
}

export default CategoriesTable;
