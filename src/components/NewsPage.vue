<template>
  <div>
    <TheNavbar />

    <!-- 每日新闻页面主体内容 -->
    <div class="news-container">
      <h1 class="page-title">每日新闻</h1>

      <!-- 主板块切换 -->
      <div class="main-tabs">
        <div
          v-for="tab in mainTabs"
          :key="tab.id"
          class="main-tab"
          :class="{ active: activeMainTab === tab.id }"
          @click="switchMainTab(tab.id)"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- 子分类切换 -->
      <div class="sub-tabs">
        <div
          v-for="subTab in currentSubTabs"
          :key="subTab.id"
          class="sub-tab"
          :class="{ active: activeSubTab === subTab.id }"
          @click="switchSubTab(subTab.id)"
        >
          {{ subTab.name }}
        </div>
      </div>

      <!-- 内容展示区域 -->
      <div class="content-container">
        <!-- 新闻列表 -->
        <div v-if="!showDetail">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner" />
            <p>加载中...</p>
          </div>

          <div v-else-if="error" class="error-state">
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
          <button class="back-button" @click="backToNewsList">返回列表</button>

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

          <div class="detail-footer">
            <button class="back-button" @click="backToNewsList">
              返回列表
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TheNavbar from './TheNavbar.vue';

const router = useRouter();
const route = useRoute();

// 主板块和子分类数据
const mainTabs = ref([
  { id: 'music', name: '音乐' },
  { id: 'movie', name: '电影' },
  { id: 'news', name: '新闻' },
]);

const subTabs = ref({
  music: [
    { id: 'pop', name: '流行音乐' },
    { id: 'folk', name: '民族音乐' },
    { id: 'classical', name: '古典音乐' },
  ],
  movie: [
    { id: 'action', name: '动作电影' },
    { id: 'comedy', name: '喜剧电影' },
    { id: 'drama', name: '剧情电影' },
  ],
  news: [
    { id: 'local', name: '本地新闻' },
    { id: 'national', name: '国内新闻' },
    { id: 'international', name: '国际新闻' },
  ],
});

// 激活状态
const activeMainTab = ref(route.params.mainTab || 'music');
const activeSubTab = ref(
  route.params.subTab || subTabs.value[activeMainTab.value][0]?.id || 'pop'
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

// 计算当前显示的子分类
const currentSubTabs = computed(() => {
  return subTabs.value[activeMainTab.value] || [];
});

// 模拟内容数据
const contentData = ref({
  music: {
    pop: [
      {
        id: 1,
        title: '流行音乐排行榜',
        description: '最新流行音乐榜单，包含各类热门歌曲',
        image: 'https://picsum.photos/seed/music1/300/200',
        date: '2023-10-01 14:30',
        category: '流行音乐',
        source: '音乐周刊',
        content: [
          '本周流行音乐排行榜出炉，多位新晋歌手崭露头角，占据榜单前列。其中，来自内地的歌手张三凭借新单曲《夏天的风》一举夺得冠军宝座，成为本周最大黑马。',
          '这首歌曲以清新的旋律和温暖的歌词赢得了广大听众的喜爱，上线仅三天便突破了千万播放量。张三在接受采访时表示，这首歌是他在去年夏天创作的，灵感来源于自己的真实经历。',
          '榜单的第二名和第三名分别由李四的《城市之光》和王五的《夜空中最亮的星》获得。这两首歌曲也都取得了不俗的成绩，展现了当前流行音乐市场的多元化发展趋势。',
          '值得注意的是，本周榜单中还有多首经典老歌重新进入前十，这反映了听众对经典音乐的持续喜爱。业内人士表示，这一现象表明音乐市场正在经历一次新的洗牌，传统与现代的融合将成为未来的发展方向。',
          '下周的排行榜竞争预计将更加激烈，多位知名歌手将发布新作品，让我们拭目以待。',
        ],
      },
      {
        id: 2,
        title: '流行音乐趋势',
        description: '分析当前流行音乐的发展趋势',
        image: 'https://picsum.photos/seed/music2/300/200',
        date: '2023-10-02 10:15',
        category: '流行音乐',
        source: '音乐产业研究',
        content: [
          '近年来，随着流媒体平台的兴起和听众审美趣味的变化，流行音乐市场呈现出一系列新的发展趋势。首先，跨界合作成为主流，不同风格的歌手相互合作，创造出全新的音乐体验。',
          '其次，个性化和多元化成为关键词，听众不再满足于单一的音乐风格，而是追求更加丰富多样的音乐体验。这一趋势推动了独立音乐的兴起，许多独立音乐人通过社交媒体和流媒体平台获得了广泛的关注。',
          '此外，音乐与视觉元素的结合越来越紧密，MV制作的质量和创意成为歌曲成功的重要因素。许多歌手在发布新作品时，不仅注重音乐本身，还投入大量精力打造精美的MV和视觉效果。',
          '最后，全球音乐市场的融合加速，不同国家和地区的音乐文化相互影响，形成了更加多元的音乐景观。这一趋势为歌手提供了更广阔的发展空间，同时也对他们的创作能力提出了更高的要求。',
          '总体而言，当前流行音乐市场正处于一个快速变化的时期，只有不断创新和适应变化，才能在激烈的竞争中脱颖而出。',
        ],
      },
      {
        id: 3,
        title: '新专辑发布',
        description: '多位歌手发布全新专辑',
        image: 'https://picsum.photos/seed/music3/300/200',
        date: '2023-10-03 09:00',
        category: '流行音乐',
        source: '娱乐头条',
        content: [
          '本周，多位知名歌手宣布将发布全新专辑，引发了粉丝们的热烈期待。其中，华语乐坛天后赵六的新专辑《时光倒流》将于本月底正式上线，这是她时隔三年后的首次回归。',
          '据了解，这张专辑共收录了12首歌曲，涵盖了流行、摇滚、民谣等多种风格，展现了赵六多样化的音乐才华。专辑的制作团队汇集了国内外顶尖的音乐人，力求打造出一张高品质的音乐作品。',
          '除了赵六之外，实力派歌手孙七也将在下周发布他的个人第五张专辑《在路上》。这张专辑以旅行为主题，记录了孙七在过去一年中旅行的所见所闻和感悟，充满了人文关怀和深刻的思考。',
          '此外，新晋歌手周八的首张个人专辑《初次见面》也将于近期发布。作为今年最受关注的新人之一，周八凭借其独特的嗓音和创作才华赢得了众多粉丝的喜爱，这张专辑的表现值得期待。',
          '多位歌手集中发布新专辑，不仅丰富了市场，也为听众提供了更多的选择。相信在接下来的一段时间里，音乐市场将迎来一个新的繁荣期。',
        ],
      },
    ],
    folk: [
      {
        id: 4,
        title: '民族音乐瑰宝',
        description: '介绍中国传统民族音乐',
        image: 'https://picsum.photos/seed/folk1/300/200',
        date: '2023-10-01 16:45',
        category: '民族音乐',
        source: '文化遗产保护',
        content: [
          '中国传统民族音乐是中华民族宝贵的文化遗产，承载着深厚的历史文化内涵。从远古的原始歌舞到现代的民族音乐创作，中国民族音乐经历了漫长的发展历程，形成了独特的艺术风格和表现形式。',
          '中国民族音乐具有丰富的多样性，不同地区、不同民族都有自己独特的音乐风格。例如，蒙古族的长调、藏族的囊玛、维吾尔族的十二木卡姆等，都是各具特色的民族音乐形式。',
          '民族音乐的乐器也是多种多样的，包括吹奏乐器、弹拨乐器、拉弦乐器和打击乐器四大类。其中，二胡、古筝、琵琶、笛子等乐器不仅在中国广受欢迎，在国际上也享有很高的声誉。',
          '近年来，随着国家对文化遗产保护的重视，民族音乐得到了越来越多的关注和支持。许多年轻音乐人开始尝试将传统民族音乐与现代音乐元素相结合，创造出更具时代特色的音乐作品。',
          '保护和传承民族音乐，不仅是对传统文化的尊重，也是对人类文明多样性的贡献。我们应该共同努力，让这一瑰宝在新时代焕发出新的光彩。',
        ],
      },
      {
        id: 5,
        title: '民族乐器欣赏',
        description: '各种民族乐器的演奏与欣赏',
        image: 'https://picsum.photos/seed/folk2/300/200',
        date: '2023-10-02 14:20',
        category: '民族音乐',
        source: '音乐教育',
        content: [
          '民族乐器是民族音乐的重要组成部分，每一种乐器都有其独特的音色和演奏技巧。今天，我们将一起欣赏几种常见的民族乐器，感受它们的独特魅力。',
          '首先是二胡，这是一种拉弦乐器，音色柔和而富有表现力，擅长演奏抒情的旋律。著名的二胡曲《二泉映月》以其深沉的情感和优美的旋律，成为了中国民族音乐的经典之作。',
          '接下来是古筝，这是一种弹拨乐器，音色清脆悦耳，表现力丰富。古筝曲《高山流水》描绘了大自然的壮丽景色，展现了中国传统文化中的山水意境。',
          '然后是琵琶，这是一种弹拨乐器，音色清脆明亮，擅长演奏快速的旋律。琵琶曲《十面埋伏》以其激烈的节奏和紧张的气氛，生动地再现了楚汉相争的历史场景。',
          '最后是笛子，这是一种吹奏乐器，音色悠扬婉转，擅长演奏欢快的旋律。笛子曲《姑苏行》描绘了江南水乡的秀丽风光，让人仿佛置身于如画的美景之中。',
          '通过欣赏这些民族乐器的演奏，我们可以更深入地了解中国传统音乐的魅力，感受中华民族博大精深的文化底蕴。',
        ],
      },
      {
        id: 6,
        title: '民族音乐传承',
        description: '探讨民族音乐的传承与发展',
        image: 'https://picsum.photos/seed/folk3/300/200',
        date: '2023-10-03 11:30',
        category: '民族音乐',
        source: '文化论坛',
        content: [
          '在全球化和现代化的背景下，传统民族音乐面临着传承与发展的挑战。如何在保护传统的基础上，推动民族音乐的创新和发展，成为了摆在我们面前的重要课题。',
          '首先，教育是传承民族音乐的基础。我们应该将民族音乐纳入学校教育体系，让更多的年轻人了解和喜爱民族音乐。同时，还可以通过举办各种培训班和工作坊，培养更多的民族音乐人才。',
          '其次，创新是民族音乐发展的动力。我们应该鼓励音乐人在保持传统特色的基础上，大胆创新，将民族音乐与现代音乐元素相结合，创造出更符合时代需求的音乐作品。',
          '此外，传播也是非常重要的。我们可以利用现代媒体和技术手段，扩大民族音乐的影响力。例如，通过互联网平台、短视频等形式，让更多的人接触和了解民族音乐。',
          '最后，政府和社会的支持也是必不可少的。政府可以出台相关政策，加大对民族音乐的保护和扶持力度。社会各界也应该积极参与，共同推动民族音乐的传承与发展。',
          '民族音乐是中华民族的文化瑰宝，保护和传承民族音乐是我们每个人的责任。让我们共同努力，让民族音乐在新时代焕发出新的生机和活力。',
        ],
      },
    ],
    classical: [
      {
        id: 7,
        title: '古典音乐名作',
        description: '经典古典音乐作品赏析',
        image: 'https://picsum.photos/seed/classical1/300/200',
        date: '2023-10-01 19:00',
        category: '古典音乐',
        source: '音乐鉴赏',
        content: [
          '古典音乐是西方音乐史上的重要组成部分，诞生了许多不朽的经典作品。这些作品不仅具有极高的艺术价值，也反映了当时的社会背景和文化氛围。',
          '贝多芬的《第九交响曲》是古典音乐中的巅峰之作，以其宏大的规模和深刻的思想内涵，成为了音乐史上的里程碑。这部交响曲融合了合唱和交响乐，表达了对自由、平等、博爱的追求。',
          '莫扎特的《费加罗的婚礼》是一部著名的歌剧，以其优美的旋律和生动的剧情，展现了莫扎特卓越的音乐才华。这部歌剧讽刺了贵族的虚伪和腐朽，歌颂了人性的美好。',
          '巴赫的《平均律钢琴曲集》被称为钢琴音乐的《旧约圣经》，对后世的音乐发展产生了深远的影响。这部作品包含了48首前奏曲和赋格，展示了巴赫在复调音乐方面的高超技巧。',
          '柴可夫斯基的《天鹅湖》是一部著名的芭蕾舞剧，以其优美的旋律和动人的故事，成为了世界芭蕾舞剧的经典之作。这部作品描绘了王子与天鹅公主之间的爱情故事，充满了浪漫主义色彩。',
          '通过欣赏这些古典音乐名作，我们可以感受到人类智慧的结晶和艺术的魅力，提升自己的审美素养和文化品位。',
        ],
      },
      {
        id: 8,
        title: '古典音乐家生平',
        description: '著名古典音乐家的生平故事',
        image: 'https://picsum.photos/seed/classical2/300/200',
        date: '2023-10-02 15:45',
        category: '古典音乐',
        source: '音乐史研究',
        content: [
          '古典音乐史上涌现出许多伟大的音乐家，他们的生平故事充满了传奇色彩，也给我们带来了深刻的启示。',
          '贝多芬是德国著名的作曲家，被誉为"乐圣"。他的一生充满了坎坷，在失聪的情况下仍然坚持创作，写出了许多不朽的作品。贝多芬的音乐充满了力量和激情，表达了对命运的抗争和对美好生活的向往。',
          '莫扎特是奥地利著名的作曲家，被誉为"音乐神童"。他从小就展现出非凡的音乐天赋，5岁开始作曲，8岁创作交响曲，11岁创作歌剧。莫扎特的音乐清新优美，充满了童真和活力，展现了他天才般的创造力。',
          '巴赫是德国著名的作曲家，被誉为"西方音乐之父"。他一生创作了大量的音乐作品，涵盖了当时所有的音乐体裁。巴赫的音乐结构严谨，技法精湛，对后世的音乐发展产生了深远的影响。',
          '肖邦是波兰著名的作曲家和钢琴家，被誉为"钢琴诗人"。他的音乐充满了浪漫主义色彩，擅长表达细腻的情感。肖邦的作品大多为钢琴而作，展现了钢琴的独特魅力。',
          '这些古典音乐家的生平故事告诉我们，天才固然重要，但更重要的是勤奋和坚持。他们用自己的一生诠释了音乐的力量，也为我们留下了宝贵的文化遗产。',
        ],
      },
      {
        id: 9,
        title: '古典音乐演奏会',
        description: '近期古典音乐演奏会信息',
        image: 'https://picsum.photos/seed/classical3/300/200',
        date: '2023-10-03 14:00',
        category: '古典音乐',
        source: '演出资讯',
        content: [
          '近期，各地将举办多场高水平的古典音乐演奏会，为广大音乐爱好者提供了欣赏经典音乐的机会。',
          '首先，北京音乐厅将在10月10日举办"贝多芬交响曲全集"系列音乐会的首场演出，由著名指挥家张三执棒，北京交响乐团演奏贝多芬的《第一交响曲》和《第二交响曲》。这是一次难得的欣赏贝多芬全部九部交响曲的机会，音乐爱好者们不容错过。',
          '其次，上海大剧院将在10月15日举办"莫扎特钢琴协奏曲专场"，由著名钢琴家李四担任独奏，上海爱乐乐团协奏。这场音乐会将演奏莫扎特的三首著名钢琴协奏曲，展现莫扎特在钢琴音乐方面的卓越成就。',
          '此外，广州大剧院将在10月20日举办"巴赫作品音乐会"，由著名小提琴家王五领衔，演奏巴赫的《无伴奏小提琴奏鸣曲与组曲》。这是巴赫的经典作品，也是小提琴演奏家的试金石，王五的演奏值得期待。',
          '最后，深圳音乐厅将在10月25日举办"柴可夫斯基作品音乐会"，由著名指挥家赵六执棒，深圳交响乐团演奏柴可夫斯基的《第五交响曲》和《天鹅湖》选段。这场音乐会将展现柴可夫斯基音乐的浪漫主义色彩和戏剧性张力。',
          '这些古典音乐演奏会将为听众带来一场场视听盛宴，让我们在音乐中感受古典艺术的魅力。',
        ],
      },
    ],
  },
  movie: {
    action: [
      {
        id: 10,
        title: '动作电影新作',
        description: '最新上映的动作电影推荐',
        image: 'https://picsum.photos/seed/action1/300/200',
        date: '2023-10-01 20:30',
        category: '动作电影',
        source: '电影评论',
        content: [
          '近期，多部动作电影陆续上映，为观众带来了精彩的视听体验。其中，由著名导演张三执导，李四、王五主演的《极限行动》备受关注，上映三天票房便突破了亿元大关。',
          '这部电影讲述了一群身怀绝技的特工，为了阻止一场全球性的恐怖袭击，展开了一系列惊心动魄的行动。影片融合了枪战、追逐、格斗等多种动作元素，场面宏大，节奏紧凑，让观众目不暇接。',
          '李四在片中饰演主角，展现了出色的动作戏功底，无论是高空跳伞还是近身格斗，都表演得非常精彩。王五则饰演反派角色，他的表演张弛有度，为影片增添了不少看点。',
          '除了《极限行动》之外，由赵六主演的《疾速追击》也取得了不错的票房成绩。这部电影延续了前作的风格，以快节奏的动作戏和紧张的剧情吸引了大量观众。',
          '此外，还有几部小成本动作电影也值得关注，它们虽然没有大牌明星加盟，但凭借精彩的故事和出色的动作设计，赢得了观众的好评。',
          '总体而言，近期的动作电影市场呈现出多样化的发展趋势，既有大制作的商业大片，也有小成本的精品之作，为观众提供了更多的选择。',
        ],
      },
      {
        id: 11,
        title: '经典动作片回顾',
        description: '回顾影史上的经典动作电影',
        image: 'https://picsum.photos/seed/action2/300/200',
        date: '2023-10-02 13:20',
        category: '动作电影',
        source: '电影史话',
        content: [
          '动作电影是电影史上的重要类型之一，诞生了许多经典之作。这些电影不仅具有精彩的动作场面，也展现了深刻的主题和人物形象。',
          '《教父》是影史上最著名的动作电影之一，以其精湛的叙事和深刻的主题，成为了电影史上的经典之作。这部电影讲述了黑手党家族的兴衰史，展现了权力、亲情和背叛等主题。',
          '《肖申克的救赎》虽然不是传统意义上的动作电影，但其中的越狱情节和反抗精神，使其具有了动作电影的元素。这部电影讲述了银行家安迪在肖申克监狱中的经历，展现了希望和友谊的力量。',
          '《黑客帝国》是一部具有里程碑意义的动作电影，以其独特的视觉风格和深刻的哲学思想，影响了后来的许多电影。这部电影讲述了人类与机器之间的战争，探讨了现实与虚拟的关系。',
          '《终结者2：审判日》是一部经典的科幻动作电影，以其精彩的动作场面和深刻的主题，成为了影史上的经典之作。这部电影讲述了未来机器人回到过去保护人类的故事，探讨了科技与人性的关系。',
          '这些经典动作电影不仅给观众带来了精彩的视听体验，也留下了深刻的思考。它们的成功证明，动作电影不仅仅是简单的打斗和追逐，也可以具有深刻的思想内涵。',
        ],
      },
      {
        id: 12,
        title: '动作电影明星',
        description: '知名动作电影明星介绍',
        image: 'https://picsum.photos/seed/action3/300/200',
        date: '2023-10-03 16:50',
        category: '动作电影',
        source: '明星档案',
        content: [
          '动作电影的发展离不开优秀的动作电影明星，他们以出色的身手和独特的魅力，赢得了广大观众的喜爱。',
          '李小龙是国际著名的动作电影明星，被誉为"功夫之王"。他创立了截拳道，将中国功夫推向了世界。李小龙的电影《猛龙过江》《龙争虎斗》等，不仅展现了精彩的功夫场面，也传播了中国文化。',
          '阿诺德·施瓦辛格是美国著名的动作电影明星，被誉为"终结者"。他的电影《终结者》系列、《真实的谎言》等，以其精彩的动作场面和幽默的表演，赢得了全球观众的喜爱。',
          '汤姆·克鲁斯是美国著名的动作电影明星，以其敬业精神和出色的表演，成为了好莱坞的超级巨星。他的电影《碟中谍》系列，以其惊险的动作场面和紧张的剧情，吸引了大量观众。',
          '成龙是中国著名的动作电影明星，被誉为"功夫喜剧之王"。他的电影融合了功夫和喜剧元素，以其独特的风格和惊险的动作场面，赢得了全球观众的喜爱。成龙的电影《警察故事》系列、《尖峰时刻》系列等，都是影史上的经典之作。',
          '这些动作电影明星用自己的努力和才华，为观众带来了精彩的电影作品，也推动了动作电影的发展。他们的成功证明，动作电影明星不仅需要有出色的身手，也需要有独特的魅力和表演才华。',
        ],
      },
    ],
    comedy: [
      {
        id: 13,
        title: '喜剧电影精选',
        description: '近期热门喜剧电影推荐',
        image: 'https://picsum.photos/seed/comedy1/300/200',
        date: '2023-10-01 11:00',
        category: '喜剧电影',
        source: '喜剧电影指南',
        content: [
          '近期，多部喜剧电影陆续上映，为观众带来了欢声笑语。其中，由著名导演张三执导，李四、王五主演的《欢乐一家人》备受关注，上映一周票房便突破了两亿元大关。',
          '这部电影讲述了一个普通家庭在面对各种生活困境时，互相支持、共同成长的故事。影片以幽默的方式展现了家庭的温暖和亲情的力量，让观众在欢笑中感受到了生活的美好。',
          '李四在片中饰演父亲，展现了出色的喜剧天赋，他的表演自然幽默，赢得了观众的喜爱。王五则饰演母亲，她的表演细腻生动，为影片增添了不少温情。',
          '除了《欢乐一家人》之外，由赵六主演的《职场趣事》也取得了不错的票房成绩。这部电影以职场为背景，讲述了一群职场新人在工作中遇到的各种趣事，展现了职场生活的酸甜苦辣。',
          '此外，还有几部小成本喜剧电影也值得关注，它们虽然没有大牌明星加盟，但凭借精彩的故事和出色的表演，赢得了观众的好评。',
          '总体而言，近期的喜剧电影市场呈现出多样化的发展趋势，既有温馨感人的家庭喜剧，也有轻松幽默的职场喜剧，为观众提供了更多的选择。',
        ],
      },
      {
        id: 14,
        title: '经典喜剧回顾',
        description: '重温经典喜剧电影',
        image: 'https://picsum.photos/seed/comedy2/300/200',
        date: '2023-10-02 14:10',
        category: '喜剧电影',
        source: '经典电影赏析',
        content: [
          '喜剧电影是电影史上的重要类型之一，诞生了许多经典之作。这些电影以幽默的方式展现了生活的各个方面，让观众在欢笑中感受到了生活的美好。',
          '《喜剧之王》是周星驰的经典之作，讲述了一个跑龙套演员的奋斗故事。这部电影融合了喜剧和励志元素，展现了小人物的梦想和坚持。周星驰的表演夸张而不失真实，赢得了观众的喜爱。',
          '《疯狂动物城》是一部经典的动画喜剧电影，讲述了兔子朱迪和狐狸尼克在动物城中的冒险故事。这部电影以幽默的方式探讨了偏见和包容等主题，赢得了观众的喜爱。',
          '《三傻大闹宝莱坞》是一部印度经典喜剧电影，讲述了三个大学生在印度理工学院的故事。这部电影以幽默的方式批判了印度的教育制度，探讨了梦想和成功的真正含义。',
          '《当哈利遇到莎莉》是一部经典的浪漫喜剧电影，讲述了哈利和莎莉从相识到相爱的故事。这部电影以幽默的方式探讨了男女之间的友谊和爱情，成为了影史上的经典之作。',
          '这些经典喜剧电影不仅给观众带来了欢笑，也留下了深刻的思考。它们的成功证明，喜剧电影不仅仅是简单的搞笑，也可以具有深刻的思想内涵。',
        ],
      },
      {
        id: 15,
        title: '喜剧演员访谈',
        description: '知名喜剧演员的访谈内容',
        image: 'https://picsum.photos/seed/comedy3/300/200',
        date: '2023-10-03 13:40',
        category: '喜剧电影',
        source: '明星访谈',
        content: [
          '喜剧演员是喜剧电影的灵魂，他们以出色的表演和独特的魅力，赢得了观众的喜爱。近期，我们采访了几位知名喜剧演员，了解他们的创作心得和生活感悟。',
          '周星驰是中国著名的喜剧演员和导演，被誉为"喜剧之王"。他在采访中表示，喜剧的核心是真实，只有真实的情感才能打动观众。他还强调，喜剧演员需要不断学习和创新，才能保持作品的新鲜感。',
          '黄渤是中国著名的喜剧演员，以其出色的表演和独特的魅力，赢得了观众的喜爱。他在采访中表示，喜剧表演需要有扎实的功底和敏锐的观察力，只有深入生活，才能创作出真实可信的角色。',
          '徐峥是中国著名的喜剧演员和导演，以其出色的表演和导演才华，赢得了观众的喜爱。他在采访中表示，喜剧电影需要有好的故事和人物，只有这样，才能吸引观众。他还强调，喜剧电影应该具有深刻的主题，让观众在欢笑中有所收获。',
          '沈腾是中国著名的喜剧演员，以其出色的表演和幽默的风格，赢得了观众的喜爱。他在采访中表示，喜剧表演需要放松和自信，只有这样，才能展现出最好的状态。他还强调，喜剧演员需要不断挑战自己，尝试不同的角色和风格。',
          '这些喜剧演员的访谈内容，让我们了解到了喜剧表演的不易和乐趣。他们的成功证明，喜剧演员不仅仅是搞笑的机器，也是有思想、有才华的艺术家。',
        ],
      },
    ],
    drama: [
      {
        id: 16,
        title: '剧情电影佳作',
        description: '高分剧情电影推荐',
        image: 'https://picsum.photos/seed/drama1/300/200',
        date: '2023-10-01 17:20',
        category: '剧情电影',
        source: '电影推荐',
        content: [
          '近期，多部高分剧情电影陆续上映，为观众带来了深刻的观影体验。其中，由著名导演张三执导，李四、王五主演的《平凡的世界》备受关注，豆瓣评分高达9.2分。',
          '这部电影改编自路遥的同名小说，讲述了上世纪七八十年代中国农村的生活变迁。影片以细腻的笔触展现了普通人的生活和奋斗，让观众在观影过程中感受到了生活的酸甜苦辣。',
          '李四在片中饰演孙少平，展现了出色的表演才华，他的表演自然真实，赢得了观众的好评。王五则饰演田晓霞，她的表演细腻生动，为影片增添了不少亮点。',
          '除了《平凡的世界》之外，由赵六主演的《活着》也取得了不错的成绩。这部电影改编自余华的同名小说，讲述了福贵一生的坎坷经历，展现了生命的坚韧和顽强。',
          '此外，还有几部小成本剧情电影也值得关注，它们虽然没有大牌明星加盟，但凭借精彩的故事和出色的表演，赢得了观众的好评。',
          '总体而言，近期的剧情电影市场呈现出多样化的发展趋势，既有改编自经典文学作品的电影，也有原创故事的电影，为观众提供了更多的选择。',
        ],
      },
      {
        id: 17,
        title: '剧情片导演访谈',
        description: '著名剧情片导演的创作理念',
        image: 'https://picsum.photos/seed/drama2/300/200',
        date: '2023-10-02 16:30',
        category: '剧情电影',
        source: '导演访谈',
        content: [
          '剧情片是电影史上的重要类型之一，需要导演具有深厚的文学素养和艺术才华。近期，我们采访了几位著名剧情片导演，了解他们的创作理念和拍摄心得。',
          '张艺谋是中国著名的剧情片导演，以其出色的导演才华和独特的视觉风格，赢得了观众的喜爱。他在采访中表示，剧情片的核心是故事和人物，只有好的故事和人物，才能吸引观众。他还强调，导演需要深入生活，了解普通人的生活和情感，才能创作出真实可信的作品。',
          '陈凯歌是中国著名的剧情片导演，以其出色的导演才华和深刻的思想内涵，赢得了观众的喜爱。他在采访中表示，剧情片需要具有深刻的主题和思想内涵，让观众在观影过程中有所收获。他还强调，导演需要不断学习和创新，才能保持作品的新鲜感。',
          '李安是国际著名的剧情片导演，以其出色的导演才华和跨文化的创作视角，赢得了全球观众的喜爱。他在采访中表示，剧情片需要展现人性的复杂性和多样性，让观众在观影过程中感受到人性的美好和丑恶。他还强调，导演需要尊重文化差异，才能创作出具有普世价值的作品。',
          '是枝裕和是日本著名的剧情片导演，以其细腻的笔触和深刻的人文关怀，赢得了观众的喜爱。他在采访中表示，剧情片需要关注普通人的生活和情感，展现生活的细节和质感。他还强调，导演需要保持对生活的敏感和好奇心，才能创作出真实可信的作品。',
          '这些剧情片导演的创作理念，让我们了解到了剧情片创作的不易和乐趣。他们的成功证明，剧情片不仅仅是简单的故事讲述，也可以具有深刻的思想内涵和艺术价值。',
        ],
      },
      {
        id: 18,
        title: '剧情片获奖情况',
        description: '近期剧情片的获奖信息',
        image: 'https://picsum.photos/seed/drama3/300/200',
        date: '2023-10-03 18:10',
        category: '剧情电影',
        source: '电影节资讯',
        content: [
          '近期，多个国际电影节陆续举行，多部剧情片获得了重要奖项。这些获奖影片不仅展现了出色的艺术才华，也反映了当前剧情片的发展趋势。',
          '在第76届戛纳国际电影节上，由法国导演阿德里安·蒂蒂耶尼执导的《坠楼死亡的剖析》获得了金棕榈奖。这部电影讲述了一个女人被怀疑谋杀了她的丈夫，在法庭上进行自我辩护的故事。影片以其出色的剧本和表演，赢得了评委的青睐。',
          '在第95届奥斯卡金像奖上，由华裔导演关家永执导的《瞬息全宇宙》获得了最佳影片、最佳导演、最佳女主角等重要奖项。这部电影讲述了一个中年妇女在多元宇宙中的冒险故事，融合了科幻、喜剧和剧情元素，展现了出色的创意和想象力。',
          '在第25届上海国际电影节上，由中国导演张艺谋执导的《满江红》获得了金爵奖最佳影片。这部电影讲述了南宋时期一群义士为了国家利益，不惜牺牲生命的故事。影片以其出色的剧本、表演和视觉效果，赢得了评委的青睐。',
          '在第73届柏林国际电影节上，由伊朗导演贾法·帕纳西执导的《无 Bears》获得了金熊奖。这部电影讲述了一个导演在拍摄电影时遇到的各种困难和挑战，展现了伊朗社会的现实和人性的复杂。',
          '这些获奖剧情片不仅展现了出色的艺术才华，也反映了当前剧情片的发展趋势。它们的成功证明，剧情片仍然是电影艺术的重要组成部分，具有广阔的发展前景。',
        ],
      },
    ],
  },
  news: {
    local: [
      {
        id: 19,
        title: '本地新闻头条',
        description: '本地区的重要新闻事件',
        image: 'https://picsum.photos/seed/local1/300/200',
        date: '2023-10-01 08:00',
        category: '本地新闻',
        source: '本地日报',
        content: [
          '昨日，我市举行了隆重的庆祝活动，纪念建市50周年。市领导和各界代表参加了庆祝大会，回顾了我市50年来的发展历程，展望了未来的发展前景。',
          '庆祝大会上，市委书记张三发表了重要讲话，他指出，过去50年，我市在经济、社会、文化等各个方面都取得了显著成就，从一个小县城发展成为一个现代化的中等城市。这一成就的取得，离不开全市人民的共同努力和奋斗。',
          '张三强调，未来5年是我市发展的关键时期，我们要坚持以人民为中心的发展思想，推动经济高质量发展，加强生态文明建设，提高人民生活水平，努力把我市建设成为一个更加美丽、宜居、繁荣的城市。',
          '庆祝大会结束后，还举行了盛大的文艺演出和烟花表演，吸引了众多市民前来观看。整个庆祝活动气氛热烈，充分展现了我市人民的精神风貌和对未来的美好憧憬。',
          '此外，我市还举办了建市50周年成就展，通过图片、文字、实物等形式，展示了我市50年来的发展成就。展览吸引了众多市民和游客前来参观，大家纷纷感叹我市的巨大变化。',
        ],
      },
      {
        id: 20,
        title: '社区活动报道',
        description: '本地区的社区活动情况',
        image: 'https://picsum.photos/seed/local2/300/200',
        date: '2023-10-02 09:30',
        category: '本地新闻',
        source: '社区之声',
        content: [
          '昨日，我市多个社区举行了丰富多彩的文化活动，丰富了居民的精神文化生活。其中，阳光社区举办的"邻里节"活动备受关注，吸引了众多居民参与。',
          '"邻里节"活动包括文艺演出、美食分享、趣味运动会等多个环节。文艺演出中，居民们表演了歌舞、戏曲、小品等节目，展现了各自的才艺。美食分享环节，居民们带来了自己制作的拿手菜肴，互相品尝，增进了邻里之间的感情。',
          '趣味运动会包括拔河、跳绳、踢毽子等项目，居民们积极参与，现场气氛热烈。通过这些活动，居民们不仅锻炼了身体，也增进了邻里之间的友谊。',
          '除了阳光社区之外，其他社区也举办了各种形式的文化活动。例如，幸福社区举办了书法绘画展览，展示了居民们的艺术才华；和谐社区举办了健康知识讲座，向居民们普及了健康知识。',
          '这些社区活动的举办，不仅丰富了居民的精神文化生活，也促进了邻里之间的交流和团结，营造了和谐的社区氛围。',
        ],
      },
      {
        id: 21,
        title: '本地经济发展',
        description: '本地区的经济发展动态',
        image: 'https://picsum.photos/seed/local3/300/200',
        date: '2023-10-03 15:00',
        category: '本地新闻',
        source: '经济观察',
        content: [
          '日前，我市发布了今年前三季度经济运行情况，数据显示，我市经济运行总体平稳，呈现出稳中有进、进中提质的良好态势。',
          '据统计，今年前三季度，我市地区生产总值达到了1200亿元，同比增长6.5%。其中，第一产业增加值为80亿元，同比增长3.2%；第二产业增加值为600亿元，同比增长7.1%；第三产业增加值为520亿元，同比增长6.2%。',
          '从主要经济指标来看，固定资产投资同比增长8.3%，社会消费品零售总额同比增长5.8%，进出口总额同比增长10.2%。这些数据表明，我市经济发展的韧性和活力不断增强。',
          '在产业结构方面，我市加快了产业转型升级的步伐，高技术产业增加值同比增长12.5%，占规模以上工业增加值的比重达到了28.5%，比上年同期提高了3.2个百分点。这表明，我市的产业结构正在不断优化，高质量发展的态势更加明显。',
          '此外，我市还加大了对科技创新的投入，前三季度，全市研发经费投入同比增长15.8%，占地区生产总值的比重达到了2.8%。这一数据表明，我市正在加快建设创新型城市，为经济高质量发展提供了有力支撑。',
          '总体而言，我市前三季度经济运行情况良好，为全年经济增长目标的实现奠定了坚实基础。下一步，我市将继续加大对实体经济的支持力度，推动经济高质量发展，努力实现全年经济增长目标。',
        ],
      },
    ],
    national: [
      {
        id: 22,
        title: '国内新闻综述',
        description: '国内重要新闻事件汇总',
        image: 'https://picsum.photos/seed/national1/300/200',
        date: '2023-10-01 12:00',
        category: '国内新闻',
        source: '新华社',
        content: [
          '昨日，国家统计局发布了今年前三季度国民经济运行情况。数据显示，今年前三季度国内生产总值达到了91.3万亿元，同比增长5.2%，经济运行总体平稳，呈现出稳中有进、进中提质的良好态势。',
          '从主要经济指标来看，固定资产投资同比增长3.1%，社会消费品零售总额同比增长6.8%，进出口总额同比增长0.2%。这些数据表明，我国经济发展的韧性和活力不断增强。',
          '在产业结构方面，高技术产业增加值同比增长10.4%，占规模以上工业增加值的比重达到了15.3%，比上年同期提高了1.3个百分点。这表明，我国的产业结构正在不断优化，高质量发展的态势更加明显。',
          '此外，我国还加大了对民生领域的投入，前三季度，全国居民人均可支配收入同比增长5.9%，扣除价格因素实际增长5.7%，与经济增长基本同步。这表明，我国经济发展的成果正在更多地惠及全体人民。',
          '总体而言，我国前三季度经济运行情况良好，为全年经济增长目标的实现奠定了坚实基础。下一步，我国将继续加大对实体经济的支持力度，推动经济高质量发展，努力实现全年经济增长目标。',
        ],
      },
      {
        id: 23,
        title: '政策解读',
        description: '最新政策的详细解读',
        image: 'https://picsum.photos/seed/national2/300/200',
        date: '2023-10-02 13:00',
        category: '国内新闻',
        source: '政策研究',
        content: [
          '日前，国务院发布了《关于进一步优化营商环境降低市场主体制度性交易成本的意见》，旨在进一步优化营商环境，降低市场主体制度性交易成本，激发市场活力和社会创造力。',
          '该意见共提出了20条具体措施，涵盖了降低市场主体准入成本、降低经营成本、降低融资成本、保护市场主体合法权益等多个方面。这些措施针对性强，力度大，将为市场主体带来实实在在的好处。',
          '在降低市场主体准入成本方面，意见提出要进一步优化企业开办服务，全面推行企业开办"一网通办"，将企业开办时间压缩至3个工作日以内。同时，要进一步放宽市场准入限制，清理和规范各类前置审批事项，降低市场主体准入门槛。',
          '在降低经营成本方面，意见提出要进一步降低税费负担，落实落细各项减税降费政策，确保市场主体应享尽享。同时，要进一步降低物流成本，优化物流基础设施布局，提高物流效率，降低物流费用。',
          '在降低融资成本方面，意见提出要进一步加大对小微企业的金融支持力度，引导金融机构加大对小微企业的信贷投放，降低小微企业融资成本。同时，要进一步拓宽融资渠道，支持企业通过债券、股票等方式直接融资。',
          '在保护市场主体合法权益方面，意见提出要进一步加强知识产权保护，加大对侵权行为的打击力度，保护市场主体的创新成果。同时，要进一步规范行政执法行为，减少对市场主体的不必要干扰，营造公平竞争的市场环境。',
          '该意见的发布，对于进一步优化营商环境，降低市场主体制度性交易成本，激发市场活力和社会创造力，具有重要意义。各地区、各部门要认真贯彻落实意见精神，确保各项措施落地见效。',
        ],
      },
      {
        id: 24,
        title: '社会热点',
        description: '当前社会热点话题讨论',
        image: 'https://picsum.photos/seed/national3/300/200',
        date: '2023-10-03 10:00',
        category: '国内新闻',
        source: '社会观察',
        content: [
          '近日，"年轻人该不该躺平"成为了社会热点话题，引发了广泛的讨论。这一话题的出现，反映了当前年轻人面临的压力和困惑，也引发了人们对社会发展和个人成长的深刻思考。',
          '所谓"躺平"，指的是年轻人面对生活压力，选择放弃奋斗，过一种低欲望、低消费的生活方式。这一现象的出现，与当前社会的高房价、高物价、高竞争压力等因素密切相关。',
          '对于"躺平"现象，社会各界看法不一。有人认为，"躺平"是年轻人对社会压力的一种消极反抗，不利于个人成长和社会发展。也有人认为，"躺平"是年轻人对生活方式的一种选择，应该尊重每个人的生活选择。',
          '专家指出，"躺平"现象的出现，反映了当前社会发展中存在的一些问题，如收入分配差距较大、社会保障体系不够完善、就业压力较大等。要解决这一问题，需要从多个方面入手，如加大对年轻人的支持力度，完善社会保障体系，创造更多的就业机会，缩小收入分配差距等。',
          '同时，专家也指出，年轻人应该树立正确的价值观和人生观，认识到奋斗的意义和价值。奋斗不仅是为了个人的成功和幸福，也是为了社会的进步和发展。年轻人应该保持积极向上的心态，勇于面对生活中的困难和挑战，努力实现自己的人生价值。',
          '总体而言，"躺平"现象的出现，引发了人们对社会发展和个人成长的深刻思考。我们应该从多个方面入手，解决当前社会发展中存在的问题，为年轻人创造更好的发展环境，同时，年轻人也应该树立正确的价值观和人生观，保持积极向上的心态，努力实现自己的人生价值。',
        ],
      },
    ],
    international: [
      {
        id: 25,
        title: '国际新闻焦点',
        description: '国际重要新闻事件',
        image: 'https://picsum.photos/seed/international1/300/200',
        date: '2023-10-01 15:00',
        category: '国际新闻',
        source: '国际新闻周刊',
        content: [
          '日前，联合国大会第78届会议在纽约联合国总部开幕，来自世界各国的代表齐聚一堂，讨论全球共同面临的重大问题。',
          '联合国秘书长古特雷斯在开幕致辞中指出，当前世界面临着多重危机，包括气候变化、粮食安全、能源危机、地区冲突等。这些危机相互交织，给全球发展带来了严峻挑战。',
          '古特雷斯强调，国际社会需要加强合作，共同应对这些危机。他呼吁各国领导人展现出政治意愿和领导力，采取切实行动，推动全球可持续发展。',
          '在气候变化方面，古特雷斯指出，全球气温上升的速度已经超过了预期，如果不采取紧急行动，到本世纪末，全球气温将上升超过2摄氏度，这将给人类带来灾难性的后果。他呼吁各国加快落实《巴黎协定》，加大对可再生能源的投资，减少温室气体排放。',
          '在粮食安全方面，古特雷斯指出，全球有超过8.28亿人面临饥饿和营养不良的问题，这一数字比疫情前增加了1.5亿人。他呼吁各国加强对农业的投资，提高粮食产量，确保全球粮食安全。',
          '在地区冲突方面，古特雷斯指出，当前世界上有超过60个国家和地区正在发生冲突，这些冲突给当地人民带来了巨大的苦难。他呼吁各国通过对话和谈判解决争端，避免使用武力。',
          '总体而言，联合国大会第78届会议的召开，为国际社会提供了一个重要的平台，让各国代表能够齐聚一堂，讨论全球共同面临的重大问题。我们希望，各国能够加强合作，共同应对这些危机，推动全球可持续发展。',
        ],
      },
      {
        id: 26,
        title: '国际关系动态',
        description: '各国之间的关系变化',
        image: 'https://picsum.photos/seed/international2/300/200',
        date: '2023-10-02 14:00',
        category: '国际新闻',
        source: '国际关系研究',
        content: [
          '近日，中美两国领导人在旧金山举行了会晤，这是两国领导人时隔一年多后的首次面对面会晤。会晤期间，两国领导人就中美关系和共同关心的重大国际问题深入交换了意见，达成了一系列重要共识。',
          '会晤中，中方强调，中美关系是世界上最重要的双边关系之一，中美两国应该相互尊重、和平共处、合作共赢。中方希望美方能够同中方一道，落实好两国领导人达成的共识，推动中美关系重回健康稳定发展的轨道。',
          '美方表示，美方重视对华关系，愿同中方保持沟通和合作，推动中美关系稳定发展。美方重申，美国不寻求"新冷战"，不寻求改变中国体制，不寻求通过强化同盟关系反对中国，不支持"台湾独立"，无意同中国发生冲突。',
          '会晤期间，两国领导人还就气候变化、经贸合作、人文交流等领域的合作达成了共识。双方同意加强在气候变化领域的合作，共同应对全球气候变化挑战。同时，双方还同意加强在经贸领域的合作，推动双边贸易和投资稳定发展。此外，双方还同意加强人文交流，增进两国人民之间的相互了解和友谊。',
          '此次中美领导人会晤的举行，对于推动中美关系稳定发展，维护世界和平与发展，具有重要意义。我们希望，中美两国能够落实好会晤达成的共识，推动中美关系重回健康稳定发展的轨道。',
          '除了中美关系之外，近期国际上还发生了许多重要的外交事件。例如，欧盟和日本签署了经济伙伴关系协定，加强了双方在经贸领域的合作。此外，东盟各国领导人在印尼举行了峰会，讨论了东盟一体化和地区安全等问题。',
          '总体而言，近期国际关系呈现出复杂多变的特点，各国之间的合作与竞争并存。我们希望，各国能够加强合作，共同应对全球面临的重大挑战，推动世界和平与发展。',
        ],
      },
      {
        id: 27,
        title: '全球经济形势',
        description: '全球经济的最新发展情况',
        image: 'https://picsum.photos/seed/international3/300/200',
        date: '2023-10-03 17:00',
        category: '国际新闻',
        source: '世界经济论坛',
        content: [
          '日前，国际货币基金组织（IMF）发布了最新一期《世界经济展望报告》，报告预测，2023年全球经济增长率将达到3.0%，2024年将达到3.2%。这一预测比上一期报告略有下调，主要原因是全球经济面临着多重挑战。',
          '报告指出，当前全球经济面临着多重挑战，包括通货膨胀高企、货币政策收紧、地缘政治紧张局势加剧、气候变化等。这些挑战相互交织，给全球经济增长带来了不确定性。',
          '从地区来看，发达经济体的经济增长预计将从2022年的2.7%放缓至2023年的1.5%，2024年将进一步放缓至1.4%。新兴市场和发展中经济体的经济增长预计将从2022年的4.1%放缓至2023年的4.0%，2024年将回升至4.2%。',
          '在通货膨胀方面，报告预测，2023年全球通货膨胀率将从2022年的8.7%降至6.9%，2024年将进一步降至5.8%。尽管通货膨胀率有所下降，但仍然高于许多央行的目标水平，这意味着货币政策仍将保持紧缩态势。',
          '报告还指出，全球贸易增长预计将从2022年的5.1%放缓至2023年的0.9%，2024年将回升至3.5%。贸易增长放缓的主要原因是全球需求疲软和贸易保护主义抬头。',
          '此外，报告还强调了气候变化对全球经济的影响。报告指出，气候变化正在对全球经济增长产生负面影响，特别是对发展中国家的影响更为严重。报告呼吁各国加强合作，共同应对气候变化挑战，推动全球可持续发展。',
          '总体而言，全球经济正处于一个充满挑战的时期，经济增长放缓，通货膨胀高企，地缘政治紧张局势加剧。我们希望，各国能够加强合作，共同应对这些挑战，推动全球经济稳定增长。',
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

// 返回新闻列表
const backToNewsList = () => {
  showDetail.value = false;
  currentNews.value = null;
};

// 切换主板块
const switchMainTab = tabId => {
  // 切换主板块时，自动切换到该板块的第一个子分类
  const firstSubTab = subTabs.value[tabId][0]?.id || '';
  // 重置详情页状态，确保显示列表
  showDetail.value = false;
  currentNews.value = null;
  // 直接更新active状态并加载内容
  activeMainTab.value = tabId;
  activeSubTab.value = firstSubTab;
  loadContent();
  // 更新URL，保持路由同步
  router.push(`/newspage/${tabId}/${firstSubTab}`);
};

// 切换子分类
const switchSubTab = subTabId => {
  // 重置详情页状态，确保显示列表
  showDetail.value = false;
  currentNews.value = null;
  // 直接更新active状态并加载内容
  activeSubTab.value = subTabId;
  loadContent();
  // 更新URL，保持路由同步
  router.push(`/newspage/${activeMainTab.value}/${subTabId}`);
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
  padding: 120px 20px 20px;
}

.page-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
}

/* 主板块切换 */
.main-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.main-tab {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.main-tab:hover {
  color: #4a6491;
}

.main-tab.active {
  color: #4a6491;
  border-bottom-color: #4a6491;
}

/* 子分类切换 */
.sub-tabs {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.sub-tab {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #888;
  background-color: #f5f5f5;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.sub-tab:hover {
  background-color: #e0e0e0;
  color: #555;
}

.sub-tab.active {
  background-color: #4a6491;
  color: white;
}

/* 内容展示区域 */
.content-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  min-height: 400px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a6491;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.content-item {
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
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.content-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
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
  padding: 15px;
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

.back-button {
  background-color: #4a6491;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #3a5481;
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
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  .content-image {
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
</style>
