import moment from "moment";
import "moment/locale/es";
import { calculateDiscountValue, getDiscountPercent } from "./numbers"

export const dateFromNow = (date: Date) => {
    return firstUpperCase(moment(date).locale("es").fromNow())
}

export const firstUpperCase = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const normalizedText = (text: string) => {
    const lowerText = text.toLocaleLowerCase()
    return firstUpperCase(lowerText)
}

export const showDiscount = (price: number, discount: number) => {
    const value = calculateDiscountValue(price, discount)
    const percent = getDiscountPercent(price, discount)
    return `$${value} (${percent}%)`
}