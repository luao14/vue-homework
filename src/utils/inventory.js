export class InventoryManager {
  constructor() {
    this.stockData = this.loadStockData();
  }

  loadStockData() {
    const saved = localStorage.getItem('inventory-stock');
    if (saved) {
      return JSON.parse(saved);
    }
    return this.initializeDefaultStock();
  }

  initializeDefaultStock() {
    const defaultStock = {
      1: 100,
      2: 500,
      3: 50,
      4: 200,
      5: 150,
      6: 80,
      7: 999,
      8: 30,
      9: 200,
      10: 50,
      11: 999,
      12: 30,
    };
    this.saveStockData(defaultStock);
    return defaultStock;
  }

  saveStockData(stockData) {
    localStorage.setItem('inventory-stock', JSON.stringify(stockData));
  }

  getStock(serviceId) {
    return this.stockData[serviceId] || 0;
  }

  setStock(serviceId, quantity) {
    if (quantity < 0) {
      throw new Error('库存不能为负数');
    }
    this.stockData[serviceId] = quantity;
    this.saveStockData(this.stockData);
  }

  checkStock(serviceId, requiredQuantity) {
    const currentStock = this.getStock(serviceId);
    return currentStock >= requiredQuantity;
  }

  checkMultipleStock(items) {
    const outOfStockItems = [];
    for (const item of items) {
      if (!this.checkStock(item.id, item.quantity)) {
        outOfStockItems.push({
          id: item.id,
          name: item.name,
          required: item.quantity,
          available: this.getStock(item.id),
        });
      }
    }
    return {
      sufficient: outOfStockItems.length === 0,
      outOfStockItems,
    };
  }

  deductStock(serviceId, quantity) {
    const currentStock = this.getStock(serviceId);
    if (currentStock < quantity) {
      throw new Error(`库存不足，当前库存：${currentStock}，需要：${quantity}`);
    }
    this.setStock(serviceId, currentStock - quantity);
    return true;
  }

  deductMultipleStock(items) {
    const result = this.checkMultipleStock(items);
    if (!result.sufficient) {
      throw new Error('部分商品库存不足');
    }
    for (const item of items) {
      this.deductStock(item.id, item.quantity);
    }
    return true;
  }

  restoreStock(serviceId, quantity) {
    const currentStock = this.getStock(serviceId);
    this.setStock(serviceId, currentStock + quantity);
    return true;
  }

  restoreMultipleStock(items) {
    for (const item of items) {
      this.restoreStock(item.id, item.quantity);
    }
    return true;
  }

  updateStockFromCart(cartItems) {
    for (const item of cartItems) {
      if (!this.stockData[item.id]) {
        this.stockData[item.id] = item.stock || 0;
      }
    }
    this.saveStockData(this.stockData);
  }

  getLowStockItems(threshold = 10) {
    const lowStockItems = [];
    for (const [serviceId, stock] of Object.entries(this.stockData)) {
      if (stock <= threshold) {
        lowStockItems.push({
          id: parseInt(serviceId),
          stock,
        });
      }
    }
    return lowStockItems;
  }

  getOutOfStockItems() {
    const outOfStockItems = [];
    for (const [serviceId, stock] of Object.entries(this.stockData)) {
      if (stock === 0) {
        outOfStockItems.push({
          id: parseInt(serviceId),
          stock,
        });
      }
    }
    return outOfStockItems;
  }

  resetStock() {
    this.stockData = this.initializeDefaultStock();
  }

  getStockSummary() {
    const summary = {
      totalServices: Object.keys(this.stockData).length,
      totalStock: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
    };

    for (const stock of Object.values(this.stockData)) {
      summary.totalStock += stock;
      if (stock <= 10) {
        summary.lowStockCount++;
      }
      if (stock === 0) {
        summary.outOfStockCount++;
      }
    }

    return summary;
  }
}

export const inventoryManager = new InventoryManager();

export const useInventory = () => {
  const checkCartStock = cartItems => {
    return inventoryManager.checkMultipleStock(cartItems);
  };

  const deductCartStock = cartItems => {
    return inventoryManager.deductMultipleStock(cartItems);
  };

  const restoreCartStock = cartItems => {
    return inventoryManager.restoreMultipleStock(cartItems);
  };

  const getServiceStock = serviceId => {
    return inventoryManager.getStock(serviceId);
  };

  const updateServiceStock = (serviceId, quantity) => {
    return inventoryManager.setStock(serviceId, quantity);
  };

  const getLowStockServices = threshold => {
    return inventoryManager.getLowStockItems(threshold);
  };

  const getOutOfStockServices = () => {
    return inventoryManager.getOutOfStockItems();
  };

  const getInventorySummary = () => {
    return inventoryManager.getStockSummary();
  };

  return {
    checkCartStock,
    deductCartStock,
    restoreCartStock,
    getServiceStock,
    updateServiceStock,
    getLowStockServices,
    getOutOfStockServices,
    getInventorySummary,
  };
};
