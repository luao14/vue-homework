<template>
  <div>
    <TheNavbar />

    <!-- 每日新闻页面主体内容 -->
    <h1 class="page-title">义乌工商校医院每日新闻</h1>
    <div class="news-container">
      <!-- 垂直菜单 -->
      <div class="menu-container">
        <el-menu
          mode="vertical"
          :default-active="activeSubTab"
          :default-openeds="[activeMainTab]"
          class="vertical-menu"
        >
          <el-sub-menu v-for="tab in mainTabs" :key="tab.id" :index="tab.id">
            <template #title>
              <span>{{ tab.name }}</span>
            </template>
            <el-menu-item-group>
              <template #title>
                <span class="group-title">{{ tab.name }}分类</span>
              </template>
              <el-menu-item
                v-for="subTab in subTabs[tab.id]"
                :key="subTab.id"
                :index="subTab.id"
                @click="switchSubTab(subTab.id, tab.id)"
              >
                {{ subTab.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </div>

      <!-- 内容展示区域 -->
      <div class="content-container">
        <!-- 新闻列表 -->
        <div v-if="!showDetail">
          <div v-if="error" class="error-state">
            <p>加载失败，请重试</p>
            <button class="retry-button" @click="loadContent">重试</button>
          </div>

          <div v-else class="content-grid">
            <div
              v-for="item in currentContent"
              :key="item.id"
              class="content-item"
              @click="viewNewsDetail(item)"
            >
              <div class="content-image">
                <img :src="item.image" :alt="item.title" />
              </div>
              <div class="content-info">
                <h3 class="content-title">
                  {{ item.title }}
                </h3>
                <p class="content-description">
                  {{ item.description }}
                </p>
                <div class="content-meta">
                  <span class="content-date">{{ item.date }}</span>
                  <span class="content-category">{{ item.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 新闻详情 -->
        <div v-else class="news-detail">
          <div class="detail-header">
            <h2 class="detail-title">
              {{ currentNews.title }}
            </h2>
            <div class="detail-meta">
              <span class="detail-date">{{ currentNews.date }}</span>
              <span class="detail-source">来源：{{ currentNews.source }}</span>
            </div>
          </div>

          <div class="detail-image">
            <img :src="currentNews.image" :alt="currentNews.title" />
          </div>

          <div class="detail-content">
            <p
              v-for="(paragraph, index) in currentNews.content"
              :key="index"
              class="detail-paragraph"
            >
              {{ paragraph }}
            </p>
          </div>

          <div class="detail-footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheNavbar from './TheNavbar.vue';

// 导入图片资源
import hospital1 from '@/image/医院1.jpg';
import hospital2 from '@/image/医院2.jpg';
import hospital3 from '@/image/医院3.jpg';
import hospital4 from '@/image/医院4.jpg';
import hospital5 from '@/image/医院5.jpg';
import hospital6 from '@/image/医院6.jpg';
import hospital7 from '@/image/医院7.jpg';
import hospital8 from '@/image/医院8.jpg';
import hospital9 from '@/image/医院9.jpg';
import hospital10 from '@/image/医院10.jpg';
import hospital11 from '@/image/医院11.jpg';
import hospital12 from '@/image/医院12.jpg';

const router = useRouter();
const route = useRoute();

// 主板块和子分类数据
const mainTabs = ref([
  { id: 'notice', name: '医疗通知' },
  { id: 'education', name: '健康宣教' },
  { id: 'dynamic', name: '医院动态' },
]);

const subTabs = ref({
  notice: [
    { id: 'checkup', name: '体检通知' },
    { id: 'insurance', name: '医保政策' },
    { id: 'emergency', name: '急诊通知' },
  ],
  education: [
    { id: 'prevention', name: '疾病预防' },
    { id: 'nutrition', name: '营养健康' },
    { id: 'psychology', name: '心理健康' },
  ],
  dynamic: [
    { id: 'equipment', name: '设备更新' },
    { id: 'activity', name: '医院活动' },
    { id: 'expert', name: '专家介绍' },
  ],
});

// 激活状态
const activeMainTab = ref(route.params.mainTab || 'notice');
const activeSubTab = ref(
  route.params.subTab || subTabs.value[activeMainTab.value][0]?.id || 'checkup'
);

// 监听URL参数变化，更新active状态
watch(
  () => route.params.mainTab,
  newMainTab => {
    activeMainTab.value = newMainTab || 'music';
    // 切换主板块时，自动切换到该板块的第一个子分类
    activeSubTab.value =
      route.params.subTab || subTabs.value[activeMainTab.value][0]?.id || '';
    loadContent();
  }
);

watch(
  () => route.params.subTab,
  newSubTab => {
    if (newSubTab) {
      activeSubTab.value = newSubTab;
      loadContent();
    }
  }
);

// 模拟内容数据
const contentData = ref({
  notice: {
    checkup: [
      {
        id: 1,
        title: '校医院2024年度体检工作通知',
        description: '2024年度师生体检工作将于下月启动,请各位师生提前做好准备',
        image: hospital1,
        date: '2024-01-15 09:00',
        category: '体检通知',
        source: '校医院办公室',
        content: [
          '根据学校年度工作安排,校医院将于2024年2月15日至3月15日开展年度师生体检工作。本次体检覆盖全校师生员工,旨在保障师生身体健康,及时发现和预防疾病。',
          '体检项目包括:身高体重、血压、血常规、尿常规、肝功能、肾功能、心电图、胸部X光、B超等常规检查项目。教职工体检时间为工作日上午8:00-11:30,学生体检时间为工作日下午14:00-17:00。',
          '请各位师生提前做好体检准备:体检前一天晚上10点后禁食,保持空腹;体检当天穿着宽松衣物,便于检查;携带本人身份证或学生证。',
          '体检报告将在体检后5个工作日内出具,可通过校医院微信公众号查询或到校医院前台领取。如有异常情况,校医院将及时通知本人并安排复查。',
          '校医院提醒各位师生,定期体检是预防疾病的重要手段,希望大家重视身体健康,积极参与年度体检。如有疑问,请拨打校医院咨询电话:0579-85660000。',
        ],
      },
      {
        id: 2,
        title: '春季传染病预防通知',
        description: '春季是传染病高发季节,请各位师生注意预防',
        image: hospital2,
        date: '2024-01-20 10:30',
        category: '体检通知',
        source: '校医院预防保健科',
        content: [
          '春季来临,气温回升,各类传染病进入高发期。校医院提醒各位师生注意预防流感、手足口病、水痘等春季常见传染病。',
          '预防措施包括:勤洗手,使用肥皂或含酒精的洗手液;保持室内通风,每天至少开窗通风2-3次,每次30分钟;避免前往人群密集场所,如必须前往请佩戴口罩;加强锻炼,增强自身免疫力。',
          '如出现发热、咳嗽、皮疹等症状,请及时到校医院就诊,不要带病上课或工作。校医院已做好春季传染病防控准备,配备了充足的药品和医疗设备。',
          '校医院将定期对教室、宿舍、食堂等公共场所进行消毒,请各位师生配合做好个人卫生和环境卫生工作。',
          '如有任何健康问题,欢迎随时咨询校医院。让我们共同努力,营造健康安全的校园环境。',
        ],
      },
      {
        id: 3,
        title: '疫苗接种安排通知',
        description: '校医院将开展流感疫苗和乙肝疫苗接种工作',
        image: hospital3,
        date: '2024-01-25 14:00',
        category: '体检通知',
        source: '校医院免疫规划科',
        content: [
          '为保障师生身体健康,校医院将于近期开展流感疫苗和乙肝疫苗接种工作。疫苗接种是预防传染病最有效的手段之一,建议符合条件的师生积极接种。',
          '流感疫苗接种时间:2024年2月20日-2月25日,每天上午8:30-11:30,下午14:00-17:00。接种地点:校医院一楼预防接种室。',
          '乙肝疫苗接种时间:2024年2月26日-3月2日,每天上午8:30-11:30,下午14:00-17:00。接种地点:校医院一楼预防接种室。',
          '接种注意事项:接种前请如实告知医生健康状况,如有发热、急性疾病等情况暂缓接种;接种后请在现场观察30分钟,无异常后方可离开;接种当天避免剧烈运动和饮酒。',
          '疫苗接种费用:流感疫苗每剂50元,乙肝疫苗每剂80元。费用可通过医保卡或现金支付。请携带本人身份证或学生证前来接种。',
        ],
      },
    ],
    insurance: [
      {
        id: 4,
        title: '学生医保报销政策解读',
        description: '详细解读学生医保报销政策和流程',
        image: hospital4,
        date: '2024-01-18 11:00',
        category: '医保政策',
        source: '校医院医保办',
        content: [
          '为方便学生了解和享受医保政策,校医院特此解读学生医保报销政策和流程。学生医保是保障学生基本医疗需求的重要制度,每位在校学生都应了解相关政策。',
          '报销范围:在校医院就诊的医疗费用,包括门诊、住院、检查、药品等;经校医院转诊到校外定点医院的医疗费用;符合规定的急诊费用。',
          '报销比例:在校医院就诊,报销比例为80%;经转诊到校外定点医院,报销比例为70%;急诊费用报销比例为60%。年度累计报销上限为20000元。',
          '报销流程:在校医院就诊时,直接出示医保卡,系统自动结算报销费用;在校外医院就诊后,携带病历、发票、费用清单等到校医院医保办办理报销手续。',
          '注意事项:报销需在就诊后3个月内办理,逾期不予受理;报销时需提供完整材料,材料不全将影响报销进度;如有疑问,请咨询校医院医保办。',
        ],
      },
      {
        id: 5,
        title: '教职工医保政策更新通知',
        description: '2024年教职工医保政策有所调整',
        image: hospital5,
        date: '2024-01-22 15:30',
        category: '医保政策',
        source: '校医院医保办',
        content: [
          '根据上级医保部门通知,2024年教职工医保政策有所调整,现将主要变化通知如下:',
          '报销比例提高:门诊报销比例从75%提高到80%,住院报销比例从85%提高到90%。这将有效减轻教职工的医疗负担。',
          '报销范围扩大:新增了部分慢性病门诊用药报销,包括高血压、糖尿病等常见慢性病;新增了中医适宜技术项目报销,如针灸、推拿等。',
          '报销流程简化:开通了线上报销申请功能,教职工可通过校医院微信公众号提交报销申请,无需再到现场办理;报销审核时间从10个工作日缩短至5个工作日。',
          '个人账户调整:个人账户余额可跨年度使用,不再清零;个人账户余额可给直系亲属使用,需提前办理绑定手续。',
          '请各位教职工及时了解新政策,合理享受医保待遇。如有疑问,请咨询校医院医保办。',
        ],
      },
      {
        id: 6,
        title: '异地就医备案流程说明',
        description: '师生异地就医如何办理备案手续',
        image: hospital6,
        date: '2024-01-28 16:00',
        category: '医保政策',
        source: '校医院医保办',
        content: [
          '为方便师生在异地就医,现将异地就医备案流程说明如下:',
          '备案条件:因公出差、实习、探亲等原因需要在异地就医的师生;因病情需要转诊到外地医院就诊的师生。',
          '备案方式:线上备案:通过国家医保服务平台APP或小程序办理备案,选择"异地就医备案"模块,填写相关信息并提交;线下备案:到校医院医保办填写《异地就医备案申请表》,提供相关证明材料。',
          '备案材料:本人身份证或学生证;异地就医证明(如出差证明、实习证明等);转诊证明(如需转诊到外地医院)。',
          '注意事项:备案后有效期一般为6个月,到期后需重新备案;异地就医需选择当地医保定点医院,否则无法报销;报销比例比本地就医低5-10个百分点。',
          '如有疑问,请咨询校医院医保办。我们将为您提供详细的指导和帮助。',
        ],
      },
    ],
    emergency: [
      {
        id: 7,
        title: '校医院急诊服务安排',
        description: '校医院24小时急诊服务安排',
        image: hospital7,
        date: '2024-01-16 08:00',
        category: '急诊通知',
        source: '校医院急诊科',
        content: [
          '为保障师生健康安全,校医院提供24小时急诊服务。现将急诊服务安排通知如下:',
          '急诊时间:周一至周日,全天24小时开放。急诊地点:校医院一楼急诊科。',
          '急诊范围:急性外伤、骨折、烧伤等外伤性疾病;急性腹痛、胸痛、头痛等急性疼痛;高热、昏迷、抽搐等急性症状;中毒、过敏等急性反应;其他需要紧急处理的医疗情况。',
          '急诊流程:患者到达急诊科后,由分诊护士初步评估病情,根据病情轻重缓急安排就诊;危重患者优先救治,开通绿色通道;需要住院的患者,急诊科将协助办理住院手续。',
          '急诊收费:急诊挂号费10元,急诊诊查费50元,检查和治疗费用按标准收取。急诊费用可使用医保卡结算。',
          '校医院提醒各位师生,遇到紧急情况请及时就医,不要拖延。如需急救车,请拨打120或校医院急诊电话:0579-85660120。',
        ],
      },
    ],
  },
  education: {
    prevention: [
      {
        id: 8,
        title: '冬季传染病预防知识讲座',
        description: '校医院举办冬季传染病预防知识讲座',
        image: hospital8,
        date: '2024-01-12 14:30',
        category: '疾病预防',
        source: '校医院预防保健科',
        content: [
          '为提高师生冬季传染病预防意识,校医院将于1月20日举办冬季传染病预防知识讲座。现将具体安排通知如下:',
          '讲座时间:2024年1月20日(周六)下午14:30-16:30。讲座地点:校医院三楼会议室。',
          '讲座内容:冬季常见传染病类型,包括流感、诺如病毒感染、水痘等;传染病的传播途径和预防措施;个人卫生习惯养成;校园环境卫生管理。',
          '主讲嘉宾:校医院预防保健科主任李医生,从事传染病预防工作20年,具有丰富的临床和预防经验。',
          '参加对象:全体师生均可参加,无需提前报名。参加讲座可获得健康知识手册一份和精美礼品。',
          '校医院希望通过本次讲座,提高师生的健康意识和自我防护能力,共同营造健康安全的校园环境。',
        ],
      },
      {
        id: 9,
        title: '心理健康知识普及',
        description: '关注师生心理健康,校医院开展心理健康知识普及活动',
        image: hospital9,
        date: '2024-01-19 10:00',
        category: '疾病预防',
        source: '校医院心理咨询室',
        content: [
          '为关注师生心理健康,校医院心理咨询室将开展心理健康知识普及活动。心理健康是健康的重要组成部分,需要我们共同关注和维护。',
          '活动时间:2024年1月25日-1月31日,每天上午9:00-11:00,下午14:00-16:00。活动地点:校医院二楼心理咨询室。',
          '活动内容:心理健康知识讲座,包括压力管理、情绪调节、人际关系等主题;心理测评服务,提供免费的心理测评和解读;个体心理咨询,预约后可进行一对一心理辅导。',
          '心理咨询师团队:校医院心理咨询室拥有3名专业心理咨询师,均具有国家二级心理咨询师资格,具有丰富的咨询经验。',
          '预约方式:可通过校医院微信公众号预约,或直接到心理咨询室前台预约。咨询费用:校内师生免费,校外人员每次50元。',
          '校医院提醒各位师生,心理健康与身体健康同样重要。如有心理困扰,请及时寻求帮助,不要独自承受。',
        ],
      },
      {
        id: 10,
        title: '常见慢性病预防与管理',
        description: '校医院开展常见慢性病预防与管理健康讲座',
        image: hospital10,
        date: '2024-01-24 15:00',
        category: '疾病预防',
        source: '校医院内科',
        content: [
          '随着生活方式的改变,慢性病发病率逐年上升。校医院将开展常见慢性病预防与管理健康讲座,帮助师生了解和预防慢性病。',
          '讲座时间:2024年2月3日(周六)下午15:00-17:00。讲座地点:校医院三楼会议室。',
          '讲座内容:常见慢性病类型,包括高血压、糖尿病、高血脂等;慢性病的危险因素和预防措施;慢性病的早期症状和筛查方法;慢性病患者的日常管理。',
          '主讲嘉宾:校医院内科主任张医生,从事内科临床工作25年,擅长慢性病诊断和治疗。',
          '参加对象:全体师生均可参加,特别是有慢性病家族史或相关症状的师生。参加讲座可免费测量血压和血糖。',
          '校医院希望通过本次讲座,提高师生对慢性病的认识,促进健康生活方式,降低慢性病发病率。',
        ],
      },
    ],
    nutrition: [
      {
        id: 11,
        title: '校园营养健康指导',
        description: '校医院营养师提供校园营养健康指导',
        image: hospital11,
        date: '2024-01-17 09:30',
        category: '营养健康',
        source: '校医院营养科',
        content: [
          '为促进师生营养健康,校医院营养科将提供校园营养健康指导服务。营养是健康的基础,合理的饮食习惯对身体健康至关重要。',
          '服务时间:每周一、三、五上午9:00-11:00。服务地点:校医院二楼营养咨询室。',
          '服务内容:个人营养状况评估,包括身高体重、体脂率、营养缺乏等;个性化膳食指导,根据个人情况制定合理的膳食方案;营养知识咨询,解答师生关于营养和饮食的问题。',
          '营养师团队:校医院营养科拥有2名专业营养师,均具有国家注册营养师资格,具有丰富的营养咨询经验。',
          '预约方式:可通过校医院微信公众号预约,或直接到营养咨询室前台预约。咨询费用:校内师生免费,校外人员每次30元。',
          '校医院营养师提醒各位师生:保持三餐规律,不暴饮暴食;多吃蔬菜水果,保证膳食纤维摄入;适量摄入蛋白质,如鱼、肉、蛋、奶;控制油盐糖摄入,预防慢性病。',
        ],
      },
      {
        id: 12,
        title: '春季饮食健康建议',
        description: '营养师提供春季饮食健康建议',
        image: hospital12,
        date: '2024-01-23 11:30',
        category: '营养健康',
        source: '校医院营养科',
        content: [
          '春季是万物复苏的季节,也是调整饮食的好时机。校医院营养科为师生提供春季饮食健康建议:',
          '多吃时令蔬菜:春季时令蔬菜如菠菜、韭菜、芹菜等,富含维生素和矿物质,有助于增强免疫力。',
          '适量摄入蛋白质:春季是身体机能活跃期,适量摄入优质蛋白质如鱼、肉、蛋、奶,有助于身体恢复和生长。',
          '注意饮食卫生:春季气温回升,细菌繁殖加快,要注意饮食卫生,避免食物中毒。',
          '控制辛辣刺激:春季容易上火,要控制辛辣刺激食物的摄入,如辣椒、生姜、大蒜等。',
          '多喝温水:春季气候干燥,要多喝温水,保持身体水分平衡,促进新陈代谢。',
          '校医院营养科将持续为师生提供营养健康指导,如有疑问,欢迎咨询。',
        ],
      },
    ],
    psychology: [
      {
        id: 13,
        title: '考前心理调适指导',
        description: '校医院心理咨询室提供考前心理调适指导',
        image: hospital1,
        date: '2024-01-14 16:30',
        category: '心理健康',
        source: '校医院心理咨询室',
        content: [
          '考试季即将来临,为帮助同学们调适心理状态,校医院心理咨询室将提供考前心理调适指导。',
          '指导时间:2024年1月20日-2月10日,每天上午9:00-11:00,下午14:00-16:00。指导地点:校医院二楼心理咨询室。',
          '指导内容:考前焦虑管理,包括放松训练、正念冥想等技巧;考试压力应对,包括时间管理、目标设定等方法;考试心态调整,包括积极心态、自信建立等策略。',
          '团体辅导:每周三下午15:00-16:30开展考前心理调适团体辅导,限10人参加,需提前预约。',
          '个体咨询:提供一对一考前心理咨询服务,预约后可进行个性化指导。',
          '校医院心理咨询室提醒各位同学:合理安排复习时间,避免熬夜;保持适度运动,缓解压力;保证充足睡眠,恢复精力;遇到心理困扰及时寻求帮助,不要独自承受。',
        ],
      },
    ],
  },
  dynamic: {
    equipment: [
      {
        id: 14,
        title: '校医院引进先进医疗设备',
        description: '校医院新引进多台先进医疗设备,提升医疗服务水平',
        image: hospital2,
        date: '2024-01-21 10:00',
        category: '设备更新',
        source: '校医院设备科',
        content: [
          '为提升医疗服务水平,校医院近期引进了多台先进医疗设备,为师生提供更精准、更便捷的医疗服务。',
          '新引进设备包括:全自动生化分析仪,可快速准确检测肝功能、肾功能、血糖、血脂等指标;彩色多普勒超声诊断仪,可进行心脏、肝脏、胆囊等器官的超声检查;数字化X光机,图像清晰,辐射剂量低,检查更安全。',
          '设备优势:检查速度快,结果准确可靠;检查项目全面,满足多种医疗需求;操作简便,患者体验舒适;数据可追溯,便于对比分析。',
          '使用安排:新设备已完成安装调试,已于1月20日正式投入使用。师生可在校医院门诊开具检查单后,到相应科室进行检查。',
          '校医院将持续引进先进医疗设备,不断提升医疗服务质量,为师生健康保驾护航。',
        ],
      },
      {
        id: 15,
        title: '校医院信息化系统升级',
        description: '校医院信息化系统完成升级,提供更便捷的服务',
        image: hospital3,
        date: '2024-01-26 14:00',
        category: '设备更新',
        source: '校医院信息科',
        content: [
          '为提高医疗服务效率,校医院信息化系统已完成升级,为师生提供更便捷的服务。',
          '系统升级内容:电子病历系统升级,病历信息更完整,查询更方便;预约挂号系统优化,支持线上预约,减少排队时间;缴费系统升级,支持微信、支付宝、医保卡等多种支付方式;检验报告查询系统升级,支持手机查询检验结果。',
          '新增功能:微信公众号服务,师生可通过校医院微信公众号预约挂号、查询报告、在线咨询等;自助服务终端,校医院大厅新增自助服务终端,可自助挂号、缴费、打印报告等;智能导诊系统,根据患者症状智能推荐就诊科室。',
          '使用说明:微信公众号搜索"义乌工商校医院"并关注,即可使用在线服务;自助服务终端位于校医院大厅,操作简单,有工作人员指导。',
          '校医院将持续推进信息化建设,为师生提供更优质、更便捷的医疗服务。',
        ],
      },
    ],
    activity: [
      {
        id: 16,
        title: '校医院举办健康义诊活动',
        description: '校医院将举办健康义诊活动,为师生提供免费医疗服务',
        image: hospital4,
        date: '2024-01-13 09:00',
        category: '医院活动',
        source: '校医院办公室',
        content: [
          '为服务师生健康,校医院将于近期举办健康义诊活动。现将活动安排通知如下:',
          '活动时间:2024年1月27日(周六)上午9:00-12:00。活动地点:校医院一楼大厅。',
          '活动内容:免费健康体检,包括测量血压、血糖、身高体重等;免费健康咨询,各科室医生现场解答健康问题;免费发放健康资料,包括健康手册、疾病预防指南等;免费发放小礼品,包括健康杯、健康包等。',
          '参与科室:内科、外科、妇科、眼科、口腔科、中医科等科室医生参与义诊。',
          '参加方式:师生可直接到活动现场参加,无需提前报名。参加时请携带本人身份证或学生证。',
          '校医院希望通过本次义诊活动,提高师生健康意识,促进健康生活方式。欢迎各位师生积极参与!',
        ],
      },
      {
        id: 17,
        title: '校医院开展健康知识竞赛',
        description: '校医院将开展健康知识竞赛,提高师生健康意识',
        image: hospital5,
        date: '2024-01-27 15:30',
        category: '医院活动',
        source: '校医院办公室',
        content: [
          '为提高师生健康意识,校医院将开展健康知识竞赛活动。现将活动详情通知如下:',
          '竞赛时间:2024年2月10日-2月20日。竞赛形式:线上答题,通过校医院微信公众号参与。',
          '竞赛内容:常见疾病预防知识;健康生活方式知识;急救知识;营养健康知识;心理健康知识。',
          '竞赛规则:每次答题共20道题,限时30分钟;答对15题以上可获得参与奖;根据答题准确率和用时评选一、二、三等奖。',
          '奖品设置:一等奖3名,奖品为健康体检套餐一份;二等奖10名,奖品为运动手环一个;三等奖20名,奖品为健康书籍一套;参与奖若干,奖品为健康小礼品。',
          '校医院希望通过本次竞赛,提高师生健康知识水平,促进健康行为。欢迎各位师生积极参与!',
        ],
      },
    ],
    expert: [
      {
        id: 18,
        title: '校医院专家门诊时间安排',
        description: '校医院专家门诊时间安排公布',
        image: hospital6,
        date: '2024-01-15 08:30',
        category: '专家介绍',
        source: '校医院医务科',
        content: [
          '为方便师生就诊,现将校医院专家门诊时间安排公布如下:',
          '内科专家李医生:主任医师,从事内科临床工作30年,擅长消化系统疾病、呼吸系统疾病的诊断和治疗。门诊时间:每周一、三上午8:30-11:30。',
          '外科专家张医生:副主任医师,从事外科临床工作20年,擅长普外科、骨科疾病的诊断和治疗。门诊时间:每周二、四上午8:30-11:30。',
          '妇科专家王医生:副主任医师,从事妇科临床工作18年,擅长妇科炎症、内分泌失调的诊断和治疗。门诊时间:每周一、三下午14:00-17:00。',
          '中医科专家赵医生:主治医师,从事中医临床工作15年,擅长中医调理、针灸推拿。门诊时间:每周二、五下午14:00-17:00。',
          '眼科专家陈医生:主治医师,从事眼科临床工作12年,擅长近视防控、干眼症治疗。门诊时间:每周三、五上午8:30-11:30。',
          '专家门诊预约方式:可通过校医院微信公众号预约,或直接到校医院前台预约。预约时请说明就诊科室和专家姓名。',
          '校医院提醒各位师生,专家门诊号源有限,请提前预约。如需紧急就诊,可到普通门诊就诊。',
        ],
      },
    ],
  },
});

// 加载状态
const loading = ref(false);
const error = ref(false);
const currentContent = ref([]);

// 新闻详情状态
const showDetail = ref(false);
const currentNews = ref(null);

// 加载内容
const loadContent = () => {
  loading.value = true;
  error.value = false;

  // 模拟异步加载
  setTimeout(() => {
    try {
      currentContent.value =
        contentData.value[activeMainTab.value][activeSubTab.value] || [];
      loading.value = false;
    } catch {
      loading.value = false;
      error.value = true;
    }
  }, 500);
};

// 查看新闻详情
const viewNewsDetail = newsItem => {
  currentNews.value = newsItem;
  showDetail.value = true;
};

// 切换子分类
const switchSubTab = (subTabId, tabId) => {
  // 重置详情页状态，确保显示列表
  showDetail.value = false;
  currentNews.value = null;
  // 直接更新active状态并加载内容
  activeMainTab.value = tabId;
  activeSubTab.value = subTabId;
  loadContent();
  // 更新URL，保持路由同步
  router.push(`/newspage/${tabId}/${subTabId}`);
};

// 初始加载
onMounted(() => {
  loadContent();
});
</script>

<style scoped>
/* 新闻页面样式 */
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 50px;
  display: flex;
  gap: 30px;
}

.page-title {
  text-align: center;
  color: #0066cc;
  margin: 120px 0 30px;
  font-size: 2rem;
}

/* 垂直菜单容器 */
.menu-container {
  width: 250px;
  flex-shrink: 0;
}

.vertical-menu {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 10px 0;
  height: fit-content;
}

/* 菜单分组标题样式 */
.group-title {
  font-weight: 600;
  color: #4a6491;
  font-size: 0.9rem;
}

/* 内容展示区域 */
.content-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  min-height: 400px;
  flex: 1;
  order: 2;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #e74c3c;
}

.retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4a6491;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #3a5481;
}

/* 内容网格 */
.content-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-item {
  display: flex;
  background-color: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.content-item:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.content-image {
  width: 300px;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
}

.content-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.content-item:hover .content-image img {
  transform: scale(1.05);
}

.content-info {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  line-height: 1.4;
}

.content-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #999;
}

.content-date {
  font-weight: 500;
}

.content-category {
  background-color: #e3eaf6;
  color: #4a6491;
  padding: 2px 8px;
  border-radius: 10px;
}

/* 新闻详情样式 */
.news-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.detail-header {
  margin-bottom: 20px;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 15px;
  line-height: 1.3;
  text-align: center;
}

.detail-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.detail-date {
  font-weight: 500;
}

.detail-source {
  font-style: italic;
}

.detail-image {
  margin-bottom: 30px;
  text-align: center;
}

.detail-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

.detail-paragraph {
  margin-bottom: 20px;
  text-align: justify;
}

.detail-footer {
  text-align: center;
  margin-top: 40px;
}

/* 响应式设计 - 新闻详情 */
@media (max-width: 768px) {
  .news-detail {
    padding: 10px;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-meta {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }

  .detail-content {
    font-size: 1rem;
    line-height: 1.6;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-container {
    padding: 100px 10px 10px;
  }

  .nav-center {
    gap: 0.5rem;
  }

  .nav-menu-item {
    padding: 0.3rem 0.6rem;
    font-size: 0.9rem;
  }

  .main-tabs {
    gap: 0.5rem;
  }

  .main-tab {
    padding: 8px 12px;
    font-size: 1rem;
  }

  .sub-tabs {
    gap: 0.5rem;
  }

  .sub-tab {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .content-grid {
    flex-direction: column;
    gap: 15px;
  }

  .content-item {
    flex-direction: column;
  }

  .content-image {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .nav-brand h2 {
    font-size: 1.2rem;
  }

  .nav-menu-item span {
    display: none;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .news-container {
    padding: 110px 15px 15px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .content-item {
    border-radius: 6px;
  }
}

@media (max-width: 992px) {
  .news-container {
    padding: 100px 12px 12px;
  }

  .page-title {
    font-size: 1.6rem;
    margin-bottom: 25px;
  }

  .main-tabs {
    gap: 0.8rem;
    margin-bottom: 15px;
  }

  .main-tab {
    padding: 8px 16px;
    font-size: 1rem;
  }

  .sub-tabs {
    gap: 0.6rem;
    margin-bottom: 25px;
  }

  .sub-tab {
    padding: 6px 14px;
    font-size: 0.85rem;
  }

  .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  .content-image {
    height: 180px;
  }

  .content-title {
    font-size: 1rem;
  }

  .content-description {
    font-size: 0.85rem;
  }

  .content-meta {
    font-size: 0.75rem;
  }

  .detail-title {
    font-size: 1.8rem;
  }

  .detail-content {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .news-container {
    padding: 80px 10px 10px;
  }

  .page-title {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }

  .main-tabs {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .main-tab {
    padding: 6px 12px;
    font-size: 0.95rem;
  }

  .sub-tabs {
    gap: 0.5rem;
    margin-bottom: 20px;
  }

  .sub-tab {
    padding: 5px 10px;
    font-size: 0.8rem;
  }

  .content-container {
    padding: 15px;
  }

  .content-grid {
    flex-direction: column;
    gap: 12px;
  }

  .content-item {
    flex-direction: column;
  }

  .content-image {
    width: 100%;
    height: 160px;
  }

  .content-info {
    padding: 12px;
  }

  .content-title {
    font-size: 0.95rem;
    margin-bottom: 6px;
  }

  .content-description {
    font-size: 0.8rem;
    margin-bottom: 10px;
  }

  .news-detail {
    padding: 15px;
  }

  .detail-title {
    font-size: 1.5rem;
    margin-bottom: 12px;
  }

  .detail-meta {
    flex-direction: column;
    gap: 5px;
    font-size: 0.85rem;
    margin-bottom: 15px;
  }

  .detail-image {
    margin-bottom: 20px;
  }

  .detail-content {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .detail-paragraph {
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .news-container {
    padding: 70px 8px 8px;
  }

  .page-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .main-tabs {
    gap: 0.4rem;
    margin-bottom: 12px;
  }

  .main-tab {
    padding: 5px 10px;
    font-size: 0.9rem;
  }

  .sub-tabs {
    gap: 0.4rem;
    margin-bottom: 15px;
  }

  .sub-tab {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .content-container {
    padding: 10px;
    min-height: 300px;
  }

  .content-grid {
    flex-direction: column;
    gap: 10px;
  }

  .content-item {
    flex-direction: column;
  }

  .content-image {
    width: 100%;
    height: 140px;
  }

  .content-info {
    padding: 10px;
  }

  .content-title {
    font-size: 0.9rem;
  }

  .content-description {
    font-size: 0.75rem;
  }

  .error-state {
    height: 200px;
  }

  .news-detail {
    padding: 10px;
  }

  .detail-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }

  .detail-meta {
    font-size: 0.8rem;
  }

  .detail-image img {
    border-radius: 6px;
  }

  .detail-content {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .detail-paragraph {
    margin-bottom: 12px;
  }
}
</style>
