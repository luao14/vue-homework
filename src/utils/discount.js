export class DiscountEngine {
  constructor() {
    this.rules = this.initializeRules();
  }

  initializeRules() {
    return {
      fullReduction: [
        {
          id: 'fr-100',
          name: '满100减10',
          type: 'fullReduction',
          threshold: 100,
          discount: 10,
          enabled: true,
        },
        {
          id: 'fr-200',
          name: '满200减25',
          type: 'fullReduction',
          threshold: 200,
          discount: 25,
          enabled: true,
        },
        {
          id: 'fr-500',
          name: '满500减60',
          type: 'fullReduction',
          threshold: 500,
          discount: 60,
          enabled: true,
        },
      ],
      percentage: [
        {
          id: 'pct-10',
          name: '9折优惠',
          type: 'percentage',
          discountRate: 0.1,
          threshold: 0,
          enabled: false,
        },
        {
          id: 'pct-15',
          name: '85折优惠',
          type: 'percentage',
          discountRate: 0.15,
          threshold: 200,
          enabled: false,
        },
        {
          id: 'pct-20',
          name: '8折优惠',
          type: 'percentage',
          discountRate: 0.2,
          threshold: 500,
          enabled: false,
        },
      ],
      member: [
        {
          id: 'member-student',
          name: '学生会员95折',
          type: 'member',
          memberType: 'student',
          discountRate: 0.05,
          enabled: true,
        },
        {
          id: 'member-teacher',
          name: '教职工会员9折',
          type: 'member',
          memberType: 'teacher',
          discountRate: 0.1,
          enabled: true,
        },
      ],
      combo: [
        {
          id: 'combo-checkup',
          name: '体检套餐优惠',
          type: 'combo',
          requiredServices: [3, 5, 6],
          discount: 30,
          enabled: true,
        },
        {
          id: 'combo-vaccine',
          name: '疫苗接种套餐',
          type: 'combo',
          requiredServices: [4],
          discountRate: 0.1,
          enabled: true,
        },
      ],
    };
  }

  getAvailableRules() {
    return {
      fullReduction: this.rules.fullReduction.filter(rule => rule.enabled),
      percentage: this.rules.percentage.filter(rule => rule.enabled),
      member: this.rules.member.filter(rule => rule.enabled),
      combo: this.rules.combo.filter(rule => rule.enabled),
    };
  }

  calculateDiscount(cartItems, memberType = null) {
    let totalDiscount = 0;
    const appliedRules = [];

    const originalTotal = cartItems.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0
    );

    const selectedItems = cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      return {
        totalDiscount: 0,
        appliedRules: [],
        finalPrice: originalTotal,
      };
    }

    const selectedTotal = selectedItems.reduce(
      (sum, item) => sum + item.originalPrice * item.quantity,
      0
    );

    const selectedServiceIds = selectedItems.map(item => item.id);

    const availableRules = this.getAvailableRules();

    for (const rule of availableRules.fullReduction) {
      if (selectedTotal >= rule.threshold) {
        totalDiscount += rule.discount;
        appliedRules.push({
          ...rule,
          discountAmount: rule.discount,
        });
      }
    }

    for (const rule of availableRules.percentage) {
      if (selectedTotal >= rule.threshold) {
        const discount = selectedTotal * rule.discountRate;
        totalDiscount += discount;
        appliedRules.push({
          ...rule,
          discountAmount: discount,
        });
      }
    }

    if (memberType) {
      for (const rule of availableRules.member) {
        if (rule.memberType === memberType) {
          const discount = selectedTotal * rule.discountRate;
          totalDiscount += discount;
          appliedRules.push({
            ...rule,
            discountAmount: discount,
          });
        }
      }
    }

    for (const rule of availableRules.combo) {
      const hasAllRequiredServices = rule.requiredServices.every(id =>
        selectedServiceIds.includes(id)
      );

      if (hasAllRequiredServices) {
        let discount = 0;
        if (rule.discount) {
          discount = rule.discount;
        } else if (rule.discountRate) {
          const comboItems = selectedItems.filter(item =>
            rule.requiredServices.includes(item.id)
          );
          discount =
            comboItems.reduce(
              (sum, item) => sum + item.originalPrice * item.quantity,
              0
            ) * rule.discountRate;
        }
        totalDiscount += discount;
        appliedRules.push({
          ...rule,
          discountAmount: discount,
        });
      }
    }

    const finalPrice = Math.max(0, selectedTotal - totalDiscount);

    return {
      totalDiscount,
      appliedRules,
      finalPrice,
      originalTotal: selectedTotal,
    };
  }

  applyDiscountToItem(item, rule) {
    if (rule.type === 'fullReduction') {
      return item;
    } else if (rule.type === 'percentage') {
      const discount = item.originalPrice * rule.discountRate;
      return {
        ...item,
        discount: discount,
        price: item.originalPrice - discount,
      };
    } else if (rule.type === 'member') {
      const discount = item.originalPrice * rule.discountRate;
      return {
        ...item,
        discount: discount,
        price: item.originalPrice - discount,
      };
    } else if (rule.type === 'combo') {
      if (rule.requiredServices.includes(item.id)) {
        const discount = rule.discount
          ? rule.discount / rule.requiredServices.length
          : item.originalPrice * rule.discountRate;
        return {
          ...item,
          discount: discount,
          price: item.originalPrice - discount,
        };
      }
    }
    return item;
  }

  enableRule(ruleId) {
    for (const category of Object.keys(this.rules)) {
      const rule = this.rules[category].find(r => r.id === ruleId);
      if (rule) {
        rule.enabled = true;
        return true;
      }
    }
    return false;
  }

  disableRule(ruleId) {
    for (const category of Object.keys(this.rules)) {
      const rule = this.rules[category].find(r => r.id === ruleId);
      if (rule) {
        rule.enabled = false;
        return true;
      }
    }
    return false;
  }

  addCustomRule(rule) {
    const category = rule.type;
    if (!this.rules[category]) {
      this.rules[category] = [];
    }
    this.rules[category].push({
      ...rule,
      id: `custom-${Date.now()}`,
      enabled: true,
    });
  }

  removeRule(ruleId) {
    for (const category of Object.keys(this.rules)) {
      const index = this.rules[category].findIndex(r => r.id === ruleId);
      if (index !== -1) {
        this.rules[category].splice(index, 1);
        return true;
      }
    }
    return false;
  }

  getBestDiscount(cartItems, memberType = null) {
    const result = this.calculateDiscount(cartItems, memberType);
    return {
      bestRule: result.appliedRules[result.appliedRules.length - 1] || null,
      totalDiscount: result.totalDiscount,
      finalPrice: result.finalPrice,
    };
  }
}

export const discountEngine = new DiscountEngine();

export const useDiscount = () => {
  const calculateCartDiscount = (cartItems, memberType) => {
    return discountEngine.calculateDiscount(cartItems, memberType);
  };

  const getAvailableDiscounts = () => {
    return discountEngine.getAvailableRules();
  };

  const applyDiscountRule = (ruleId, enabled) => {
    if (enabled) {
      return discountEngine.enableRule(ruleId);
    } else {
      return discountEngine.disableRule(ruleId);
    }
  };

  const addCustomDiscount = rule => {
    return discountEngine.addCustomRule(rule);
  };

  const removeDiscountRule = ruleId => {
    return discountEngine.removeRule(ruleId);
  };

  const getBestDiscount = (cartItems, memberType) => {
    return discountEngine.getBestDiscount(cartItems, memberType);
  };

  return {
    calculateCartDiscount,
    getAvailableDiscounts,
    applyDiscountRule,
    addCustomDiscount,
    removeDiscountRule,
    getBestDiscount,
  };
};
