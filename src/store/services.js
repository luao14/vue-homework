import hospitalImage1 from '@/image/医院1.jpg';
import hospitalImage2 from '@/image/医院2.jpg';
import hospitalImage3 from '@/image/医院3.jpg';
import hospitalImage4 from '@/image/医院4.jpg';
import hospitalImage5 from '@/image/医院5.jpg';
import hospitalImage6 from '@/image/医院6.jpg';
import hospitalImage7 from '@/image/医院7.jpg';
import hospitalImage8 from '@/image/医院8.jpg';
import hospitalImage9 from '@/image/医院9.jpg';
import hospitalImage10 from '@/image/医院10.jpg';
import hospitalImage11 from '@/image/医院11.jpg';
import hospitalImage12 from '@/image/医院12.jpg';

export const serviceCategories = [
  { id: 'basic', name: '基础服务' },
  { id: 'checkup', name: '体检服务' },
  { id: 'lab', name: '检验检查' },
  { id: 'vaccine', name: '疫苗接种' },
  { id: 'consultation', name: '咨询服务' },
  { id: 'emergency', name: '急诊服务' },
];

export const availableServices = [
  {
    id: 1,
    name: '校医门诊挂号',
    categoryId: 'basic',
    price: 5.0,
    originalPrice: 5.0,
    stock: 100,
    tags: ['校医服务', '基础服务'],
    image: hospitalImage1,
    description: '校医院门诊挂号服务，包括普通门诊和专家门诊',
    duration: '30分钟',
    department: '门诊部',
    discount: 0,
    hot: false,
    recommended: false,
  },
  {
    id: 2,
    name: '校医药品发放',
    categoryId: 'basic',
    price: 0.0,
    originalPrice: 0.0,
    stock: 500,
    tags: ['校医服务', '常用服务'],
    image: hospitalImage2,
    description: '校医院常用药品发放服务，包括感冒药、消炎药等',
    duration: '15分钟',
    department: '药房',
    discount: 0,
    hot: false,
    recommended: false,
  },
  {
    id: 3,
    name: '学生常规健康体检',
    categoryId: 'checkup',
    price: 120.0,
    originalPrice: 150.0,
    stock: 50,
    tags: ['校医服务', '体检服务', '热门'],
    image: hospitalImage3,
    description:
      '学生常规健康体检，包括身高体重、血压、血常规、尿常规、肝功能、肾功能、心电图、胸部X光、B超等检查项目',
    duration: '2小时',
    department: '体检中心',
    discount: 20,
    hot: true,
    recommended: true,
  },
  {
    id: 4,
    name: '学生疫苗接种',
    categoryId: 'vaccine',
    price: 50.0,
    originalPrice: 50.0,
    stock: 200,
    tags: ['校医服务', '预防保健'],
    image: hospitalImage4,
    description: '流感疫苗和乙肝疫苗接种服务，提供专业的疫苗接种和健康指导',
    duration: '30分钟',
    department: '预防保健科',
    discount: 0,
    hot: false,
    recommended: false,
  },
  {
    id: 5,
    name: '校医血常规检查',
    categoryId: 'lab',
    price: 25.0,
    originalPrice: 30.0,
    stock: 150,
    tags: ['校医服务', '基础检查'],
    image: hospitalImage5,
    description: '血常规检查，包括白细胞、红细胞、血小板等指标检测',
    duration: '20分钟',
    department: '检验科',
    discount: 5,
    hot: false,
    recommended: false,
  },
  {
    id: 6,
    name: '校医心电图检查',
    categoryId: 'lab',
    price: 50.0,
    originalPrice: 60.0,
    stock: 80,
    tags: ['校医服务', '心脏检查'],
    image: hospitalImage6,
    description: '心电图检查，用于诊断心律失常、心肌缺血等心脏疾病',
    duration: '15分钟',
    department: '功能检查科',
    discount: 10,
    hot: false,
    recommended: false,
  },
  {
    id: 7,
    name: '校医健康咨询',
    categoryId: 'consultation',
    price: 0.0,
    originalPrice: 0.0,
    stock: 999,
    tags: ['校医服务', '健康指导', '推荐'],
    image: hospitalImage7,
    description: '专业医生健康咨询服务，提供个性化的健康指导和建议',
    duration: '30分钟',
    department: '健康咨询科',
    discount: 0,
    hot: false,
    recommended: true,
  },
  {
    id: 8,
    name: '校医急诊处理',
    categoryId: 'emergency',
    price: 30.0,
    originalPrice: 30.0,
    stock: 30,
    tags: ['校医服务', '急诊服务', '热门'],
    image: hospitalImage8,
    description:
      '24小时急诊处理服务，包括急性外伤、急性腹痛、高热等紧急情况处理',
    duration: '视情况而定',
    department: '急诊科',
    discount: 0,
    hot: true,
    recommended: false,
  },
  {
    id: 9,
    name: '校医常见病诊疗',
    categoryId: 'basic',
    price: 10.0,
    originalPrice: 15.0,
    stock: 200,
    tags: ['校医服务', '诊疗服务'],
    image: hospitalImage9,
    description:
      '常见病诊疗服务，包括感冒、发烧、肠胃不适等常见疾病的诊断和治疗',
    duration: '30分钟',
    department: '内科',
    discount: 5,
    hot: false,
    recommended: false,
  },
  {
    id: 10,
    name: '校医心理健康咨询',
    categoryId: 'consultation',
    price: 0.0,
    originalPrice: 0.0,
    stock: 50,
    tags: ['校医服务', '心理咨询', '推荐'],
    image: hospitalImage10,
    description:
      '专业心理咨询师提供的心理健康咨询服务，包括压力管理、情绪调节等',
    duration: '45分钟',
    department: '心理咨询室',
    discount: 0,
    hot: false,
    recommended: true,
  },
  {
    id: 11,
    name: '校医传染病防控',
    categoryId: 'basic',
    price: 0.0,
    originalPrice: 0.0,
    stock: 999,
    tags: ['校医服务', '预防保健'],
    image: hospitalImage11,
    description: '传染病防控服务，提供传染病预防知识宣传和防控指导',
    duration: '30分钟',
    department: '预防保健科',
    discount: 0,
    hot: false,
    recommended: false,
  },
  {
    id: 12,
    name: '校医健康教育讲座',
    categoryId: 'consultation',
    price: 0.0,
    originalPrice: 0.0,
    stock: 30,
    tags: ['校医服务', '健康指导'],
    image: hospitalImage12,
    description:
      '健康教育讲座，包括疾病预防、营养健康、心理健康等主题的健康知识普及',
    duration: '2小时',
    department: '健康教育科',
    discount: 0,
    hot: false,
    recommended: false,
  },
];

export const getServiceById = id => {
  return availableServices.find(service => service.id === id);
};

export const getServicesByCategory = categoryId => {
  return availableServices.filter(service => service.categoryId === categoryId);
};

export const getHotServices = () => {
  return availableServices.filter(service => service.hot);
};

export const getRecommendedServices = () => {
  return availableServices.filter(service => service.recommended);
};

export const searchServices = keyword => {
  const lowerKeyword = keyword.toLowerCase();
  return availableServices.filter(
    service =>
      service.name.toLowerCase().includes(lowerKeyword) ||
      service.description.toLowerCase().includes(lowerKeyword) ||
      service.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  );
};

export const filterServicesByPrice = (minPrice, maxPrice) => {
  return availableServices.filter(
    service => service.price >= minPrice && service.price <= maxPrice
  );
};

export const filterServicesByStock = minStock => {
  return availableServices.filter(service => service.stock >= minStock);
};

export const sortServicesByPrice = (services, ascending = true) => {
  return [...services].sort((a, b) =>
    ascending ? a.price - b.price : b.price - a.price
  );
};

export const sortServicesByStock = (services, ascending = true) => {
  return [...services].sort((a, b) =>
    ascending ? a.stock - b.stock : b.stock - a.stock
  );
};
