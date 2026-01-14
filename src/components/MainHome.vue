<template>
  <div class="main-container">
    <TheNavbar />

    <!-- 页面顶部横幅 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>欢迎来到义乌工商校医院</h1>
        <p>守护师生健康,服务校园医疗</p>
        <div class="hospital-intro">
          <p>
            义乌工商校医院集医疗、预防、保健、康复为一体，为全校师生提供全方位的医疗服务。
          </p>
          <p>
            我们拥有专业的医疗团队和先进的医疗设备，致力于为师生打造安全、舒适、便捷的就医环境。
          </p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 快捷功能入口 -->
      <div class="quick-access-section">
        <h2 class="section-title">快捷功能</h2>
        <div class="quick-access-grid">
          <div class="quick-access-card" @click="goToNewsPage">
            <div class="card-icon">📰</div>
            <h3>医疗资讯</h3>
            <p>最新健康资讯</p>
          </div>
          <div class="quick-access-card" @click="goToPatientManagement">
            <div class="card-icon">👥</div>
            <h3>体检用户管理</h3>
            <p>管理体检用户信息</p>
          </div>
          <div class="quick-access-card" @click="goToShoppingCart">
            <div class="card-icon">🏥</div>
            <h3>医疗服务</h3>
            <p>医疗服务管理</p>
          </div>
          <div class="quick-access-card" @click="goToMedicalStatistics">
            <div class="card-icon">📊</div>
            <h3>就诊统计</h3>
            <p>查看统计数据</p>
          </div>
        </div>
      </div>

      <!-- 今日统计概览 -->
      <div class="stats-section">
        <h2 class="section-title">今日统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>今日就诊</h3>
              <p class="stat-number">
                {{ todayStats.visits }}
              </p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💊</div>
            <div class="stat-info">
              <h3>药品发放</h3>
              <p class="stat-number">
                {{ todayStats.medicine }}
              </p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🩺</div>
            <div class="stat-info">
              <h3>体检人数</h3>
              <p class="stat-number">
                {{ todayStats.checkup }}
              </p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <h3>预约挂号</h3>
              <p class="stat-number">
                {{ todayStats.appointments }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 重要通知公告 -->
      <div class="notice-section">
        <h2 class="section-title">重要通知</h2>
        <div class="notice-list">
          <div class="notice-item">
            <div class="notice-icon">📢</div>
            <div class="notice-content">
              <h3>校医院2024年度体检工作通知</h3>
              <p>2024年度师生体检工作将于下月启动,请各位师生提前做好准备</p>
              <span class="notice-date">2024-01-15</span>
            </div>
          </div>
          <div class="notice-item">
            <div class="notice-icon">💉</div>
            <div class="notice-content">
              <h3>春季疫苗接种安排</h3>
              <p>校医院将开展流感疫苗和乙肝疫苗接种工作，请关注具体时间安排</p>
              <span class="notice-date">2024-01-20</span>
            </div>
          </div>
          <div class="notice-item">
            <div class="notice-icon">⚠️</div>
            <div class="notice-content">
              <h3>春季传染病预防通知</h3>
              <p>春季是传染病高发季节,请各位师生注意预防流感、手足口病等</p>
              <span class="notice-date">2024-01-18</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 医院服务时间 -->
      <div class="service-hours-section">
        <h2 class="section-title">服务时间</h2>
        <div class="service-hours-grid">
          <div class="service-hours-card">
            <h3>门诊时间</h3>
            <p>周一至周五: 8:00-17:30</p>
            <p>周六: 8:30-12:00</p>
            <p>周日: 休息</p>
          </div>
          <div class="service-hours-card">
            <h3>急诊服务</h3>
            <p>24小时急诊服务</p>
            <p>急诊电话: 0579-85660120</p>
          </div>
          <div class="service-hours-card">
            <h3>疫苗接种</h3>
            <p>周一、三、五: 8:30-11:30</p>
            <p>周二、四、六: 14:00-17:00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import TheNavbar from './TheNavbar.vue';

const router = useRouter();

const goToNewsPage = () => {
  router.push('/newspage');
};

const goToPatientManagement = () => {
  router.push('/registered-users');
};

const goToShoppingCart = () => {
  router.push('/shoppingcart');
};

const goToMedicalStatistics = () => {
  router.push('/medical-statistics');
};

const todayStats = ref({
  visits: 0,
  medicine: 0,
  checkup: 0,
  appointments: 0,
});

const loadTodayStats = () => {
  const savedStats = localStorage.getItem('medical-stats');
  if (savedStats) {
    const stats = JSON.parse(savedStats);
    todayStats.value.visits = stats.todayVisits || 0;
    todayStats.value.medicine = stats.medicineCount || 0;
    todayStats.value.checkup = stats.checkupCount || 0;
    todayStats.value.appointments = Math.floor(Math.random() * 20) + 5;
  }
};

onMounted(() => {
  loadTodayStats();
});
</script>

<style scoped>
/* 全局容器样式 */
.main-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
}

/* 英雄区域样式 */
.hero-section {
  background: linear-gradient(135deg, #0066cc 0%, #0088cc 100%);
  color: white;
  padding: 3rem 2rem;
  margin-top: 100px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 102, 204, 0.2);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hospital-intro {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1rem;
  line-height: 1.8;
  opacity: 0.95;
  text-align: center;
}

.hospital-intro p {
  margin-bottom: 1rem;
}

/* 内容包装器 */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 通用标题样式 */
.section-title {
  text-align: center;
  color: #2c3e50;
  font-size: 2rem;
  margin: 0 0 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 3px solid #0066cc;
  display: inline-block;
  width: 100%;
  font-weight: 700;
}

/* 快捷功能入口 */
.quick-access-section {
  margin-bottom: 3rem;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.quick-access-card {
  background: white;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.quick-access-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 102, 204, 0.15);
  border-color: #0066cc;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.quick-access-card h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.quick-access-card p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

/* 今日统计概览 */
.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: linear-gradient(135deg, #0066cc, #0088cc);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 102, 204, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 102, 204, 0.4);
}

.stat-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.2);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info h3 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  opacity: 0.95;
  font-weight: 500;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

/* 重要通知公告 */
.notice-section {
  margin-bottom: 3rem;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #0066cc;
}

.notice-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15);
}

.notice-icon {
  font-size: 2rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.notice-content {
  flex: 1;
}

.notice-content h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.notice-content p {
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 0.8rem;
  line-height: 1.6;
}

.notice-date {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 医院服务时间 */
.service-hours-section {
  margin-bottom: 2rem;
}

.service-hours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.service-hours-card {
  background: white;
  border-radius: 16px;
  padding: 1.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.service-hours-card:hover {
  border-color: #0066cc;
  box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15);
}

.service-hours-card h3 {
  color: #0066cc;
  font-size: 1.4rem;
  margin: 0 0 1rem;
  font-weight: 600;
}

.service-hours-card p {
  color: #64748b;
  font-size: 1rem;
  margin: 0.6rem 0;
  line-height: 1.7;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 95%;
  }

  .quick-access-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 992px) {
  .hero-section {
    padding: 2.5rem 1.5rem;
  }

  .hero-content h1 {
    font-size: 2.2rem;
  }

  .content-wrapper {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .quick-access-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.2rem;
  }

  .service-hours-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem;
    margin-top: 80px;
  }

  .hero-content h1 {
    font-size: 1.8rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .quick-access-card {
    padding: 1.5rem 1rem;
  }

  .card-icon {
    font-size: 2.5rem;
  }

  .quick-access-card h3 {
    font-size: 1.2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .stat-number {
    font-size: 1.8rem;
  }

  .notice-item {
    flex-direction: column;
    padding: 1.2rem;
  }

  .notice-icon {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .service-hours-grid {
    grid-template-columns: 1fr;
  }

  .service-hours-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1.5rem 0.8rem;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hospital-intro {
    font-size: 0.95rem;
  }

  .content-wrapper {
    padding: 0.8rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .quick-access-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .quick-access-card {
    padding: 1.2rem 0.8rem;
  }

  .card-icon {
    font-size: 2rem;
  }

  .quick-access-card h3 {
    font-size: 1rem;
  }

  .quick-access-card p {
    font-size: 0.85rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat-card {
    padding: 1.2rem;
    gap: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .notice-content h3 {
    font-size: 1.1rem;
  }

  .notice-content p {
    font-size: 0.95rem;
  }

  .service-hours-card {
    padding: 1.2rem;
  }

  .service-hours-card h3 {
    font-size: 1.2rem;
  }

  .service-hours-card p {
    font-size: 0.95rem;
  }
}
</style>
