export class PriceCalculator {
  constructor() {
    this.taxRate = 0;
    this.serviceFeeRate = 0;
  }

  calculateItemPrice(item) {
    return {
      originalPrice: item.originalPrice,
      discount: item.discount || 0,
      finalPrice: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      originalSubtotal: item.originalPrice * item.quantity,
      savedAmount: (item.originalPrice - item.price) * item.quantity,
    };
  }

  calculateCartTotal(cartItems, selectedOnly = false) {
    const items = selectedOnly
      ? cartItems.filter(item => item.selected)
      : cartItems;

    if (items.length === 0) {
      return this.getEmptyResult();
    }

    let totalQuantity = 0;
    let originalTotal = 0;
    let finalTotal = 0;
    let totalDiscount = 0;
    const itemDetails = [];

    for (const item of items) {
      const itemPrice = this.calculateItemPrice(item);
      itemDetails.push(itemPrice);

      totalQuantity += item.quantity;
      originalTotal += itemPrice.originalSubtotal;
      finalTotal += itemPrice.subtotal;
      totalDiscount += itemPrice.savedAmount;
    }

    return {
      totalQuantity,
      originalTotal,
      finalTotal,
      totalDiscount,
      itemDetails,
      discountRate: originalTotal > 0 ? totalDiscount / originalTotal : 0,
    };
  }

  calculateWithAdditionalDiscount(
    cartItems,
    additionalDiscount,
    selectedOnly = false
  ) {
    const baseResult = this.calculateCartTotal(cartItems, selectedOnly);

    let additionalDiscountAmount = 0;
    let appliedDiscounts = [];

    if (typeof additionalDiscount === 'number') {
      additionalDiscountAmount = additionalDiscount;
      appliedDiscounts.push({
        type: 'fixed',
        amount: additionalDiscount,
        name: '额外优惠',
      });
    } else if (typeof additionalDiscount === 'object') {
      for (const discount of additionalDiscount) {
        if (discount.type === 'fixed') {
          additionalDiscountAmount += discount.amount;
        } else if (discount.type === 'percentage') {
          additionalDiscountAmount += baseResult.finalTotal * discount.rate;
        }
        appliedDiscounts.push(discount);
      }
    }

    const finalTotal = Math.max(
      0,
      baseResult.finalTotal - additionalDiscountAmount
    );
    const totalDiscount = baseResult.totalDiscount + additionalDiscountAmount;

    return {
      ...baseResult,
      additionalDiscount: additionalDiscountAmount,
      appliedDiscounts,
      finalTotal,
      totalDiscount,
    };
  }

  calculateWithTax(cartItems, taxRate, selectedOnly = false) {
    const baseResult = this.calculateCartTotal(cartItems, selectedOnly);
    const taxAmount = baseResult.finalTotal * taxRate;
    const finalTotal = baseResult.finalTotal + taxAmount;

    return {
      ...baseResult,
      taxRate,
      taxAmount,
      finalTotal,
    };
  }

  calculateWithServiceFee(cartItems, serviceFeeRate, selectedOnly = false) {
    const baseResult = this.calculateCartTotal(cartItems, selectedOnly);
    const serviceFee = baseResult.finalTotal * serviceFeeRate;
    const finalTotal = baseResult.finalTotal + serviceFee;

    return {
      ...baseResult,
      serviceFeeRate,
      serviceFee,
      finalTotal,
    };
  }

  calculateFinalPrice(
    cartItems,
    options = {
      additionalDiscount: 0,
      taxRate: 0,
      serviceFeeRate: 0,
      selectedOnly: false,
    }
  ) {
    let result = this.calculateCartTotal(cartItems, options.selectedOnly);

    if (options.additionalDiscount) {
      const discountResult = this.calculateWithAdditionalDiscount(
        cartItems,
        options.additionalDiscount,
        options.selectedOnly
      );
      result = { ...result, ...discountResult };
    }

    if (options.taxRate > 0) {
      const taxAmount = result.finalTotal * options.taxRate;
      result = {
        ...result,
        taxRate: options.taxRate,
        taxAmount,
        finalTotal: result.finalTotal + taxAmount,
      };
    }

    if (options.serviceFeeRate > 0) {
      const serviceFee = result.finalTotal * options.serviceFeeRate;
      result = {
        ...result,
        serviceFeeRate: options.serviceFeeRate,
        serviceFee,
        finalTotal: result.finalTotal + serviceFee,
      };
    }

    return result;
  }

  calculateItemBreakdown(item) {
    const itemPrice = this.calculateItemPrice(item);
    return {
      serviceName: item.name,
      serviceId: item.id,
      quantity: item.quantity,
      unitPrice: {
        original: item.originalPrice,
        discounted: item.price,
        discount: item.discount,
      },
      subtotal: {
        original: itemPrice.originalSubtotal,
        discounted: itemPrice.subtotal,
        saved: itemPrice.savedAmount,
      },
      discountRate:
        item.originalPrice > 0 ? item.discount / item.originalPrice : 0,
    };
  }

  getEmptyResult() {
    return {
      totalQuantity: 0,
      originalTotal: 0,
      finalTotal: 0,
      totalDiscount: 0,
      itemDetails: [],
      discountRate: 0,
      additionalDiscount: 0,
      appliedDiscounts: [],
      taxRate: 0,
      taxAmount: 0,
      serviceFeeRate: 0,
      serviceFee: 0,
    };
  }

  formatPrice(price) {
    return `¥${price.toFixed(2)}`;
  }

  formatDiscountRate(rate) {
    return `${(rate * 100).toFixed(1)}%`;
  }

  calculateSavings(cartItems, selectedOnly = false) {
    const result = this.calculateCartTotal(cartItems, selectedOnly);
    return {
      totalSavings: result.totalDiscount,
      savingsRate: result.discountRate,
      averageSavingPerItem:
        result.totalQuantity > 0
          ? result.totalDiscount / result.totalQuantity
          : 0,
    };
  }

  comparePrices(originalItems, discountedItems) {
    const originalResult = this.calculateCartTotal(originalItems);
    const discountedResult = this.calculateCartTotal(discountedItems);

    return {
      originalTotal: originalResult.finalTotal,
      discountedTotal: discountedResult.finalTotal,
      totalSavings: originalResult.finalTotal - discountedResult.finalTotal,
      savingsRate:
        originalResult.finalTotal > 0
          ? (originalResult.finalTotal - discountedResult.finalTotal) /
            originalResult.finalTotal
          : 0,
    };
  }

  validatePrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
      throw new Error('价格必须是有效的数字');
    }
    if (price < 0) {
      throw new Error('价格不能为负数');
    }
    return true;
  }

  validateQuantity(quantity) {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      throw new Error('数量必须是有效的数字');
    }
    if (quantity < 0) {
      throw new Error('数量不能为负数');
    }
    if (!Number.isInteger(quantity)) {
      throw new Error('数量必须是整数');
    }
    return true;
  }
}

export const priceCalculator = new PriceCalculator();

export const usePriceCalculator = () => {
  const calculateCartTotal = (cartItems, selectedOnly) => {
    return priceCalculator.calculateCartTotal(cartItems, selectedOnly);
  };

  const calculateFinalPrice = (cartItems, options) => {
    return priceCalculator.calculateFinalPrice(cartItems, options);
  };

  const calculateItemBreakdown = item => {
    return priceCalculator.calculateItemBreakdown(item);
  };

  const calculateSavings = (cartItems, selectedOnly) => {
    return priceCalculator.calculateSavings(cartItems, selectedOnly);
  };

  const formatPrice = price => {
    return priceCalculator.formatPrice(price);
  };

  const formatDiscountRate = rate => {
    return priceCalculator.formatDiscountRate(rate);
  };

  const validatePrice = price => {
    return priceCalculator.validatePrice(price);
  };

  const validateQuantity = quantity => {
    return priceCalculator.validateQuantity(quantity);
  };

  return {
    calculateCartTotal,
    calculateFinalPrice,
    calculateItemBreakdown,
    calculateSavings,
    formatPrice,
    formatDiscountRate,
    validatePrice,
    validateQuantity,
  };
};
