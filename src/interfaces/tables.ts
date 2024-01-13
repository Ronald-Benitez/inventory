import { Orders, type Inventory, Sales, Discounts } from "@prisma/client";
import { type Products } from "@prisma/client";

interface includesTypeAndEnterprise {
    type: {
        name: string
    },
    enterprise: {
        name: string
    }
}

export interface InventoryWithTypeAndEnterprise extends Inventory, includesTypeAndEnterprise { }

export interface ProductsWithTypeAndEnterprise extends Products, includesTypeAndEnterprise { }

export interface OrderProducts {
    quantity: number
    price: number
    name: string
    cost: number
}

export interface OrderSave {
    orderData: {
        client: string
        totalPrice: number
        totalCost: number
    },
    salesData: OrderProducts[]
}

export interface OrderWithSales extends Orders {
    sales: Sales[]
}

export interface DiscountsWitProduct extends Discounts {
    products: {
        name: string,
        price: number,
        enterprice: {
            name: string
        }
    }
}

export interface ProductsCompleteInfo extends ProductsWithTypeAndEnterprise {
    discounts: Discounts[]
}

export interface ColummnsBase {
    label: string;
    present: (value: any) => string;
}