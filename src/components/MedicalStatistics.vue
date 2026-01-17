<template>
  <div>
    <TheNavbar />

    <div class="statistics-container">
      <div class="page-header">
        <button class="back-button" @click="goBack">
          <span>← 返回</span>
        </button>
        <h1 class="page-title">就诊统计</h1>
      </div>

      <div class="statistics-content">
        <div class="statistics-grid">
          <div class="stat-card today-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>今日就诊人次</h3>
              <p class="stat-number">
                {{ todayVisits }}
              </p>
            </div>
            <div class="stat-actions">
              <button class="action-btn" @click="incrementTodayVisits">
                <span>+1</span>
              </button>
              <button class="action-btn" @click="decrementTodayVisits">
                <span>-1</span>
              </button>
            </div>
          </div>

          <div class="stat-card month-card">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <h3>本月就诊人次</h3>
              <p class="stat-number">
                {{ monthVisits }}
              </p>
            </div>
          </div>

          <div class="stat-card medicine-card">
            <div class="stat-icon">💊</div>
            <div class="stat-info">
              <h3>今日药品发放</h3>
              <p class="stat-number">
                {{ medicineCount }}
              </p>
            </div>
            <div class="stat-actions">
              <button class="action-btn" @click="incrementMedicine">
                <span>+1</span>
              </button>
              <button class="action-btn" @click="decrementMedicine">
                <span>-1</span>
              </button>
            </div>
          </div>

          <div class="stat-card checkup-card">
            <div class="stat-icon">🩺</div>
            <div class="stat-info">
              <h3>今日体检人数</h3>
              <p class="stat-number">
                {{ checkupCount }}
              </p>
            </div>
            <div class="stat-actions">
              <button class="action-btn" @click="incrementCheckup">
                <span>+1</span>
              </button>
              <button class="action-btn" @click="decrementCheckup">
                <span>-1</span>
              </button>
            </div>
          </div>
        </div>

        <div class="statistics-details">
          <div class="detail-card">
            <h2>每日接诊记录</h2>
            <div class="record-list">
              <div v-if="dailyRecords.length > 0" class="record-items">
                <div
                  v-for="(record, index) in dailyRecords"
                  :key="index"
                  class="record-item"
                >
                  <span class="record-date">{{ record.date }}</span>
                  <span class="record-count">{{ record.count }}人次</span>
                </div>
              </div>
              <div v-else class="no-records">
                <p>暂无记录</p>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <h2>快速操作</h2>
            <div class="quick-actions">
              <button class="quick-btn" @click="resetTodayStats">
                <span>重置今日统计</span>
              </button>
              <button class="quick-btn" @click="exportStats">
                <span>导出统计数据</span>
              </button>
              <button class="quick-btn" @click="addDailyRecord">
                <span>添加今日记录</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TheNavbar from './TheNavbar.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();

const goBack = () => {
  router.go(-2);
  ElMessage({
    message: '成功后退2步',
    type: 'success',
    duration: 2000,
  });
};

const todayVisits = ref(0);
const monthVisits = ref(0);
const medicineCount = ref(0);
const checkupCount = ref(0);
const dailyRecords = ref([]);

onMounted(() => {
  loadStats();
});

const loadStats = () => {
  const savedStats = localStorage.getItem('medical-stats');
  if (savedStats) {
    const stats = JSON.parse(savedStats);
    todayVisits.value = stats.todayVisits || 0;
    monthVisits.value = stats.monthVisits || 0;
    medicineCount.value = stats.medicineCount || 0;
    checkupCount.value = stats.checkupCount || 0;
    dailyRecords.value = stats.dailyRecords || [];
  }
};

const saveStats = () => {
  const stats = {
    todayVisits: todayVisits.value,
    monthVisits: monthVisits.value,
    medicineCount: medicineCount.value,
    checkupCount: checkupCount.value,
    dailyRecords: dailyRecords.value,
  };
  localStorage.setItem('medical-stats', JSON.stringify(stats));
};

const incrementTodayVisits = () => {
  todayVisits.value++;
  monthVisits.value++;
  saveStats();
};

const decrementTodayVisits = () => {
  if (todayVisits.value > 0) {
    todayVisits.value--;
    if (monthVisits.value > 0) {
      monthVisits.value--;
    }
    saveStats();
  }
};

const incrementMedicine = () => {
  medicineCount.value++;
  saveStats();
};

const decrementMedicine = () => {
  if (medicineCount.value > 0) {
    medicineCount.value--;
    saveStats();
  }
};

const incrementCheckup = () => {
  checkupCount.value++;
  saveStats();
};

const decrementCheckup = () => {
  if (checkupCount.value > 0) {
    checkupCount.value--;
    saveStats();
  }
};

const resetTodayStats = () => {
  if (confirm('确定要重置今日统计吗？')) {
    todayVisits.value = 0;
    medicineCount.value = 0;
    checkupCount.value = 0;
    saveStats();
    ElMessage({
      message: '今日统计已重置',
      type: 'success',
      duration: 2000,
    });
  }
};

const exportStats = () => {
  const stats = {
    今日就诊人次: todayVisits.value,
    本月就诊人次: monthVisits.value,
    今日药品发放: medicineCount.value,
    今日体检人数: checkupCount.value,
    导出时间: new Date().toLocaleString(),
  };
  console.log('统计数据:', stats);
  ElMessage({
    message: '统计数据已导出到控制台',
    type: 'success',
    duration: 2000,
  });
};

const addDailyRecord = () => {
  const today = new Date().toLocaleDateString();
  const existingRecord = dailyRecords.value.find(r => r.date === today);
  if (existingRecord) {
    existingRecord.count = todayVisits.value;
  } else {
    dailyRecords.value.unshift({
      date: today,
      count: todayVisits.value,
    });
  }
  saveStats();
  ElMessage({
    message: '今日记录已添加',
    type: 'success',
    duration: 2000,
  });
};
</script>

<style scoped>
.statistics-container {
  margin-top: 120px;
  padding: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.back-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #0066cc, #0088cc);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.back-button:hover {
  background: linear-gradient(135deg, #0088cc, #00aacc);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
}

.page-title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 3px solid #0066cc;
}

.statistics-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 3rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
  border-radius: 50%;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-number {
  color: #0066cc;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.stat-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #0066cc, #0088cc);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: linear-gradient(135deg, #0088cc, #00aacc);
  transform: scale(1.1);
}

.today-card {
  border-left: 5px solid #0066cc;
}

.month-card {
  border-left: 5px solid #4caf50;
}

.medicine-card {
  border-left: 5px solid #ff9800;
}

.checkup-card {
  border-left: 5px solid #9c27b0;
}

.statistics-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-card h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.record-list {
  max-height: 300px;
  overflow-y: auto;
}

.record-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.record-item:hover {
  background: #f1f5f9;
}

.record-date {
  color: #64748b;
  font-size: 0.95rem;
}

.record-count {
  color: #0066cc;
  font-weight: 600;
  font-size: 1.1rem;
}

.no-records {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #94a3b8;
  font-size: 1.1rem;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-btn {
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #0066cc, #0088cc);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.quick-btn:hover {
  background: linear-gradient(135deg, #0088cc, #00aacc);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 102, 204, 0.4);
}

@media (max-width: 768px) {
  .statistics-container {
    margin-top: 100px;
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .back-button {
    width: 100%;
    text-align: center;
  }

  .page-title {
    font-size: 2rem;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .statistics-details {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .detail-card {
    padding: 1.5rem;
  }
}
</style>
