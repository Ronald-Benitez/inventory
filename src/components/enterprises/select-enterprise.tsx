import { useEffect, useState, SetStateAction, Dispatch } from 'react';
import axios from 'axios';
import { Enterprises } from '@prisma/client';
import { Select, SelectItem } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
    enterpriseId: number;
    setEnterpriseId: Dispatch<SetStateAction<number>>;
}

function SelectEnterprise({ enterpriseId, setEnterpriseId }: Props) {
    const [enterprises, setEnterprises] = useState<Enterprises[]>([]);

    useEffect(() => {
        axios
            .get("/api/enterprises")
            .then((res) => {
                setEnterprises(res.data);
            })
            .catch((error) => {
                console.error("Error cargando las empresas:", error);
                toast.error("No se pudieron cargar las empresas");
            });
    }, []);

    return (
        <>
            <Select
                label="Empresas"
                placeholder='Seleccione una empresa'
                value={enterpriseId}
                onChange={(e) => {
                    setEnterpriseId(Number(e.target.value))
                }}
                defaultSelectedKeys={enterpriseId != 0 ? [enterpriseId] : []}
            >
                {enterprises.length > 0 ? (
                    enterprises.map((item: Enterprises) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem key={0} value="">
                        No hay empresas registradas
                    </SelectItem>
                )}
            </Select>
            <Toaster />
        </>
    );
}

export default SelectEnterprise;
