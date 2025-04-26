export interface GameText {
  id: number;
  char: string;
  description?: string;
}

export const gameTexts: GameText[] = [
  { id: 1, char: "爱", description: "表示对人或事物的深厚感情" },
  { id: 2, char: "和", description: "表示和谐、和睦" },
  { id: 3, char: "美", description: "表示美丽、美好" },
  { id: 4, char: "善", description: "表示善良、善行" },
  { id: 5, char: "真", description: "表示真实、真诚" },
  { id: 6, char: "智", description: "表示智慧、聪明" },
  { id: 7, char: "勇", description: "表示勇敢、勇气" },
  { id: 8, char: "信", description: "表示诚信、信任" },
  { id: 9, char: "礼", description: "表示礼貌、礼仪" },
  { id: 10, char: "义", description: "表示正义、道义" },
  { id: 11, char: "孝", description: "表示孝顺、孝敬" },
  { id: 12, char: "忠", description: "表示忠诚、忠心" },
  { id: 13, char: "仁", description: "表示仁爱、仁慈" },
  { id: 14, char: "德", description: "表示道德、品德" },
  { id: 15, char: "诚", description: "表示诚实、诚信" },
  { id: 16, char: "敬", description: "表示尊敬、敬重" },
  { id: 17, char: "谦", description: "表示谦虚、谦逊" },
  { id: 18, char: "让", description: "表示谦让、礼让" },
  { id: 19, char: "勤", description: "表示勤奋、勤劳" },
  { id: 20, char: "俭", description: "表示节俭、俭朴" },
  { id: 21, char: "乐", description: "表示快乐、欢乐" },
  { id: 22, char: "福", description: "表示幸福、福气" },
  { id: 23, char: "寿", description: "表示长寿、寿命" },
  { id: 24, char: "康", description: "表示健康、安康" },
  { id: 25, char: "宁", description: "表示安宁、宁静" },
];

export interface Phrase {
  id: number;
  phrase: string;
  pinyin: string;
  vietnamese: string;
}

export interface PhraseListTableMeta {
  id: number;
  name: string;
  list: Phrase[];
}

export const phraseListTable: PhraseListTableMeta[] = [
  {
    id: 1,
    name: "Basic Greetings",
    list: [
      {
        id: 1,
        phrase: "你好",
        pinyin: "nǐ hǎo",
        vietnamese: "Xin chào",
      },
      {
        id: 2,
        phrase: "谢谢",
        pinyin: "xiè xiè",
        vietnamese: "Cảm ơn",
      },
      {
        id: 3,
        phrase: "再见",
        pinyin: "zài jiàn",
        vietnamese: "Tạm biệt",
      },
      {
        id: 4,
        phrase: "对不起",
        pinyin: "duì bù qǐ",
        vietnamese: "Xin lỗi",
      },
      {
        id: 5,
        phrase: "没关系",
        pinyin: "méi guān xi",
        vietnamese: "Không sao",
      },
      {
        id: 6,
        phrase: "请",
        pinyin: "qǐng",
        vietnamese: "Xin mời",
      },
      {
        id: 7,
        phrase: "不客气",
        pinyin: "bù kè qì",
        vietnamese: "Không có gì",
      },
      {
        id: 8,
        phrase: "早上好",
        pinyin: "zǎo shàng hǎo",
        vietnamese: "Chào buổi sáng",
      },
      {
        id: 9,
        phrase: "晚上好",
        pinyin: "wǎn shàng hǎo",
        vietnamese: "Chào buổi tối",
      },
      {
        id: 10,
        phrase: "晚安",
        pinyin: "wǎn ān",
        vietnamese: "Chúc ngủ ngon",
      },
    ],
  },
  {
    id: 2,
    name: "Fruits",
    list: [
      {
        id: 1,
        phrase: "苹果",
        pinyin: "píng guǒ",
        vietnamese: "Táo",
      },
      {
        id: 2,
        phrase: "香蕉",
        pinyin: "xiāng jiāo",
        vietnamese: "Chuối",
      },
      {
        id: 3,
        phrase: "橙子",
        pinyin: "chéng zi",
        vietnamese: "Cam",
      },
      {
        id: 4,
        phrase: "葡萄",
        pinyin: "pú tao",
        vietnamese: "Nho",
      },
      {
        id: 5,
        phrase: "西瓜",
        pinyin: "xī guā",
        vietnamese: "Dưa hấu",
      },
      {
        id: 6,
        phrase: "草莓",
        pinyin: "cǎo méi",
        vietnamese: "Dâu tây",
      },
      {
        id: 7,
        phrase: "菠萝",
        pinyin: "bō luó",
        vietnamese: "Dứa",
      },
      {
        id: 8,
        phrase: "芒果",
        pinyin: "máng guǒ",
        vietnamese: "Xoài",
      },
      {
        id: 9,
        phrase: "梨",
        pinyin: "lí",
        vietnamese: "Lê",
      },
      {
        id: 10,
        phrase: "桃子",
        pinyin: "táo zi",
        vietnamese: "Đào",
      },
    ],
  },
  {
    id: 3,
    name: "Food and Drinks",
    list: [
      {
        id: 1,
        phrase: "蛋糕",
        pinyin: "dàn gāo",
        vietnamese: "Bánh kem",
      },
      {
        id: 2,
        phrase: "糖果",
        pinyin: "táng guǒ",
        vietnamese: "Kẹo",
      },
      {
        id: 3,
        phrase: "冰淇淋",
        pinyin: "bīng qí lín",
        vietnamese: "Kem",
      },
      {
        id: 4,
        phrase: "水果",
        pinyin: "shuǐ guǒ",
        vietnamese: "Trái cây",
      },
      {
        id: 5,
        phrase: "奶茶",
        pinyin: "nǎi chá",
        vietnamese: "Trà sữa",
      },
      {
        id: 6,
        phrase: "咖啡",
        pinyin: "kā fēi",
        vietnamese: "Cà phê",
      },
      {
        id: 7,
        phrase: "果汁",
        pinyin: "guǒ zhī",
        vietnamese: "Nước hoa quả",
      },
      {
        id: 8,
        phrase: "可乐",
        pinyin: "kě lè",
        vietnamese: "Coca",
      },
    ],
  },
  {
    id: 4,
    name: "Shopping and Commerce",
    list: [
      {
        id: 1,
        phrase: "商品",
        pinyin: "shāng pǐn",
        vietnamese: "hàng hóa",
      },
      {
        id: 2,
        phrase: "价格",
        pinyin: "jià gé",
        vietnamese: "giá cả",
      },
      {
        id: 3,
        phrase: "便宜",
        pinyin: "pián yi",
        vietnamese: "rẻ",
      },
      {
        id: 4,
        phrase: "付款",
        pinyin: "fù kuǎn",
        vietnamese: "thanh toán",
      },
      {
        id: 5,
        phrase: "支付",
        pinyin: "zhī fù",
        vietnamese: "trả tiền",
      },
      {
        id: 6,
        phrase: "找钱",
        pinyin: "zhǎo qián",
        vietnamese: "trả lại tiền thừa",
      },
      {
        id: 7,
        phrase: "收据",
        pinyin: "shōu jù",
        vietnamese: "hóa đơn",
      },
      {
        id: 8,
        phrase: "发票",
        pinyin: "fā piào",
        vietnamese: "hóa đơn đỏ",
      },
      {
        id: 9,
        phrase: "折扣",
        pinyin: "zhé kòu",
        vietnamese: "giảm giá",
      },
      {
        id: 10,
        phrase: "促销",
        pinyin: "cù xiāo",
        vietnamese: "khuyến mãi",
      },
      {
        id: 11,
        phrase: "特价",
        pinyin: "tè jià",
        vietnamese: "giá đặc biệt",
      },
      {
        id: 12,
        phrase: "退货",
        pinyin: "tuì huò",
        vietnamese: "trả hàng",
      },
      {
        id: 13,
        phrase: "换货",
        pinyin: "huàn huò",
        vietnamese: "đổi hàng",
      },
      {
        id: 14,
        phrase: "保修",
        pinyin: "bǎo xiū",
        vietnamese: "bảo hành",
      },
      {
        id: 15,
        phrase: "质量",
        pinyin: "zhì liàng",
        vietnamese: "chất lượng",
      },
      {
        id: 16,
        phrase: "尺寸",
        pinyin: "chǐ cùn",
        vietnamese: "kích cỡ",
      },
      {
        id: 17,
        phrase: "款式",
        pinyin: "kuǎn shì",
        vietnamese: "kiểu dáng",
      },
      {
        id: 18,
        phrase: "现金",
        pinyin: "xiàn jīn",
        vietnamese: "tiền mặt",
      },
      {
        id: 19,
        phrase: "刷卡",
        pinyin: "shuā kǎ",
        vietnamese: "quẹt thẻ",
      },
      {
        id: 20,
        phrase: "网购",
        pinyin: "wǎng gòu",
        vietnamese: "mua hàng online",
      },
      {
        id: 21,
        phrase: "快递",
        pinyin: "kuài dì",
        vietnamese: "giao hàng nhanh",
      }
    ],
  },
];
