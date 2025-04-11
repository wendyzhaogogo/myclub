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
  list: Phrase[];
}

export const phraseListTable: PhraseListTableMeta[] = [
  {
    id: 1,
    list: [
      { id: 1, phrase: "老师", pinyin: "lǎo shī", vietnamese: "giáo viên" },
      { id: 2, phrase: "奶奶", pinyin: "nǎi nai", vietnamese: "bà nội" },
      { id: 3, phrase: "早上", pinyin: "zǎo shang", vietnamese: "buổi sáng" },
      { id: 4, phrase: "学生", pinyin: "xué sheng", vietnamese: "học sinh" },
    ],
  },
  {
    id: 2,
    list: [
      { id: 1, phrase: "发现", pinyin: "fā xiàn", vietnamese: "phát hiện" },
      { id: 2, phrase: "海边", pinyin: "hǎi biān", vietnamese: "bờ biển" },
      { id: 3, phrase: "护照", pinyin: "hù zhào", vietnamese: "hộ chiếu" },
      { id: 4, phrase: "画家", pinyin: "huà jiā", vietnamese: "họa sĩ" },
      { id: 5, phrase: "欢迎", pinyin: "huān yíng", vietnamese: "hoan nghênh" },
      { id: 6, phrase: "加油", pinyin: "jiā yóu", vietnamese: "cố lên" },
      { id: 7, phrase: "见过", pinyin: "jiàn guo", vietnamese: "đã gặp" },
      { id: 8, phrase: "节日", pinyin: "jié rì", vietnamese: "ngày lễ" },
      { id: 9, phrase: "开心", pinyin: "kāi xīn", vietnamese: "vui vẻ" },
      { id: 10, phrase: "可爱", pinyin: "kě ài", vietnamese: "đáng yêu" },
      { id: 11, phrase: "空气", pinyin: "kōng qì", vietnamese: "không khí" },
      { id: 12, phrase: "前年", pinyin: "qián nián", vietnamese: "năm kia" },
      { id: 13, phrase: "礼物", pinyin: "lǐ wù", vietnamese: "quà tặng" },
      { id: 14, phrase: "流利", pinyin: "liú lì", vietnamese: "lưu loát" },
      { id: 15, phrase: "拿到", pinyin: "ná dào", vietnamese: "nhận được" },
      { id: 16, phrase: "认为", pinyin: "rèn wéi", vietnamese: "cho rằng" },
      { id: 17, phrase: "入口", pinyin: "rù kǒu", vietnamese: "lối vào" },
      { id: 18, phrase: "爱好", pinyin: "ài hào", vietnamese: "sở thích" },
    ],
  },
];
