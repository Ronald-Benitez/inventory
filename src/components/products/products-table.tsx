"use client"

import { useState, useEffect } from "react";
import { type Enterprises, type Products, type Types } from "@prisma/client"
import toast, { Toaster } from "react-hot-toast";

import ProductsModal from "@/components/products/products-modal"
import { dateFromNow } from "@/utils/string";
import Confirm from "../utils/confirm";
import { Tbody, Thead, Td, Th, Table, DeleteBtn } from "../ui";
import { handleDelete } from "@/utils/axiosHandler";
import { ProductsCompleteInfo } from "@/interfaces/tables"

interface ProductsProps {
  data: ProductsCompleteInfo[] | [];
  reload: () => void;
  types: Types[] | [];
  enterprises: Enterprises[] | [];
}

export default function InventoryTable({ data, reload, types, enterprises }: ProductsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<ProductsCompleteInfo | null>(null);

  const onConfirm = () => {
    handleDelete({
      id: selected?.id || 0,
      onError: () => toast.error("Error al eliminar el producto"),
      onSuccess: () => toast.success("Producto eliminado"),
      onFinally: () => setConfirmDelete(false),
      url: "/api/products",
      reload
    })
  }

  return (
    <>
      <div className="min-w-full flex justify-center">
        <div className="mb-8 overflow-auto">
          <Table>
            <Thead>
              <tr>
                <Th>Actualizacion</Th>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th>Precio</Th>
                <Th>Costo</Th>
                <Th>Tipo</Th>
                <Th>Empresa</Th>
                <Th>Acciones</Th>
              </tr>
            </Thead>
            <Tbody>
              {data.map((item: ProductsCompleteInfo) => (
                <tr key={item.id} className={item.available ? "" : "bg-red-100"}>
                  <Td>{dateFromNow(item.updatedAt)}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.description}</Td>
                  <Td>${item.price}</Td>
                  <Td>${item.cost}</Td>
                  <Td>{item.type.name}</Td>
                  <Td>{item.enterprise.name}</Td>
                  <Td>
                    <div className="flex justify-center space-x-2">
                      <ProductsModal reload={reload} data={item} types={types} enterprises={enterprises} />
                      <DeleteBtn
                        onClick={() => {
                          setSelected(item);
                          setConfirmDelete(true);
                        }}
                      />
                    </div>
                  </Td>
                </tr>
              ))}
            </Tbody>
          </Table>
        </div>

        <Toaster />
        <Confirm
          open={confirmDelete}
          title="Eliminar producto"
          msg={`¿Estás seguro de eliminar el producto: ${selected?.name}?`}
          onConfirm={onConfirm}
          onCancel={() => setConfirmDelete(!confirmDelete)}
        />
      </div>
    </>
  );
}