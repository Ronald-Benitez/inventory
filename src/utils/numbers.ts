export const getDiscountPercent = (price: number, discount: number) => {
    const percent = (discount / price) * 100
    const percentFixed = percent.toFixed(2)
    return parseFloat(percentFixed)
}

export const calculateDiscountToSave = (isManual: boolean, price: number, discount: number) => {
    if (isManual) return discount > price ? price : discount

    const discountPercent = discount / 100
    const discountFixed = (price * discountPercent).toFixed(2)
    console.log(discountPercent, discountFixed)
    return parseFloat(discountFixed)
}

export const calculateDiscountValue = (price: number, discount: number) => {
    const result = (price - discount).toFixed(2)
    return parseFloat(result)
}