import { defineStore } from 'pinia';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
  }),

  getters: {
    totalOrders: state => {
      return state.orders.length;
    },

    totalSpent: state => {
      return state.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    },

    recentOrders: state => {
      return state.orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    },

    pendingOrders: state => {
      return state.orders.filter(order => order.status === 'pending');
    },

    completedOrders: state => {
      return state.orders.filter(order => order.status === 'completed');
    },

    cancelledOrders: state => {
      return state.orders.filter(order => order.status === 'cancelled');
    },

    getOrderById: state => id => {
      return state.orders.find(order => order.id === id);
    },

    getOrdersByUserId: state => userId => {
      return state.orders.filter(order => order.userId === userId);
    },

    getOrdersByStatus: state => status => {
      return state.orders.filter(order => order.status === status);
    },

    getOrdersByDateRange: state => (startDate, endDate) => {
      return state.orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    },
  },

  actions: {
    createOrder(orderData) {
      const order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: orderData.userId,
        userName: orderData.userName,
        userStuId: orderData.userStuId,
        items: orderData.items,
        originalTotal: orderData.originalTotal,
        discountAmount: orderData.discountAmount,
        finalTotal: orderData.finalTotal,
        status: 'pending',
        paymentMethod: orderData.paymentMethod || 'cash',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        remarks: orderData.remarks || '',
        appliedDiscounts: orderData.appliedDiscounts || [],
      };

      this.orders.unshift(order);
      this.currentOrder = order;
      this.saveOrders();
      return order;
    },

    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
      }
    },

    updatePaymentStatus(orderId, paymentStatus) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.paymentStatus = paymentStatus;
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
      }
    },

    cancelOrder(orderId, reason = '') {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
        order.cancelReason = reason;
        order.cancelledAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
      }
    },

    completeOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = 'completed';
        order.completedAt = new Date().toISOString();
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
      }
    },

    deleteOrder(orderId) {
      const index = this.orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        this.orders.splice(index, 1);
        this.saveOrders();
      }
    },

    addOrderNote(orderId, note) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        if (!order.notes) {
          order.notes = [];
        }
        order.notes.push({
          content: note,
          createdAt: new Date().toISOString(),
        });
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
      }
    },

    updateOrderRemarks(orderId, remarks) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.remarks = remarks;
        order.updatedAt = new Date().toISOString();
        this.saveOrders();
      }
    },

    saveOrders() {
      localStorage.setItem('orders', JSON.stringify(this.orders));
    },

    loadOrders() {
      const saved = localStorage.getItem('orders');
      if (saved) {
        this.orders = JSON.parse(saved);
      }
    },

    clearOrders() {
      this.orders = [];
      this.currentOrder = null;
      localStorage.removeItem('orders');
    },

    getOrderStatistics(userId = null) {
      const userOrders = userId ? this.getOrdersByUserId(userId) : this.orders;

      const stats = {
        totalOrders: userOrders.length,
        totalSpent: userOrders.reduce(
          (sum, order) => sum + order.finalTotal,
          0
        ),
        totalSaved: userOrders.reduce(
          (sum, order) => sum + order.discountAmount,
          0
        ),
        pendingCount: userOrders.filter(o => o.status === 'pending').length,
        completedCount: userOrders.filter(o => o.status === 'completed').length,
        cancelledCount: userOrders.filter(o => o.status === 'cancelled').length,
        averageOrderValue:
          userOrders.length > 0
            ? userOrders.reduce((sum, order) => sum + order.finalTotal, 0) /
              userOrders.length
            : 0,
      };

      return stats;
    },

    getMostOrderedServices(userId = null) {
      const userOrders = userId ? this.getOrdersByUserId(userId) : this.orders;

      const serviceCounts = {};

      for (const order of userOrders) {
        for (const item of order.items) {
          if (!serviceCounts[item.id]) {
            serviceCounts[item.id] = {
              id: item.id,
              name: item.name,
              count: 0,
              totalQuantity: 0,
              totalAmount: 0,
            };
          }
          serviceCounts[item.id].count++;
          serviceCounts[item.id].totalQuantity += item.quantity;
          serviceCounts[item.id].totalAmount += item.price * item.quantity;
        }
      }

      return Object.values(serviceCounts).sort((a, b) => b.count - a.count);
    },

    searchOrders(keyword) {
      const lowerKeyword = keyword.toLowerCase();
      return this.orders.filter(
        order =>
          order.id.toLowerCase().includes(lowerKeyword) ||
          order.userName.toLowerCase().includes(lowerKeyword) ||
          order.userStuId.toLowerCase().includes(lowerKeyword) ||
          order.items.some(item =>
            item.name.toLowerCase().includes(lowerKeyword)
          )
      );
    },

    filterOrders(filters) {
      let result = [...this.orders];

      if (filters.userId) {
        result = result.filter(order => order.userId === filters.userId);
      }

      if (filters.status) {
        result = result.filter(order => order.status === filters.status);
      }

      if (filters.startDate) {
        result = result.filter(
          order => new Date(order.createdAt) >= new Date(filters.startDate)
        );
      }

      if (filters.endDate) {
        result = result.filter(
          order => new Date(order.createdAt) <= new Date(filters.endDate)
        );
      }

      if (filters.minAmount) {
        result = result.filter(order => order.finalTotal >= filters.minAmount);
      }

      if (filters.maxAmount) {
        result = result.filter(order => order.finalTotal <= filters.maxAmount);
      }

      return result;
    },
  },
});
