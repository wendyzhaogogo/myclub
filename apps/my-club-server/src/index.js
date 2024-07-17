/* eslint-disable @typescript-eslint/no-var-requires */
const download = require('download');
const querystring = require('querystring');

let chineseSentences = [
  '你有男朋友吗？',
  '有啊，我有一个男朋友。你呢？',
  '我还没有呢，不过我喜欢一个人。',
  '哦，真的吗？他是谁？',
  '他是我的同班同学，我们已经认识很久了。',
  '那你表白了吗？',
  '还没有，我有点紧张，不知道他的想法。',
  '放心吧，勇敢地告诉他吧，也许他也喜欢你呢！',
  '好的，我会试试的，谢谢你的鼓励！',
  '你最近和谁聊天呢？',
  '我在和一个很漂亮的女孩聊天。',
  '哦，她是你的心上人吗？',
  '是的，我一见钟情了。',
  '那你打算怎么追她呢？',
  '我会经常和她聊天，还会时不时地关心她。',
  '不错，那你什么时候表白呢？',
  '我正在准备，相信她会喜欢我的。',
  '祝你好运！我也想试试约会和关心。',
  '哈哈，那你要找到一个好看的女孩才行哦。',
  '没错，我会努力的。',
];

let chineseWords = [
  '男朋友',
  '女朋友',
  '喜欢',
  '同班同学',
  '表白',
  '紧张',
  '想法',
  '勇敢',
  '告诉',
  '鼓励',
  '聊天',
  '漂亮',
  '心上人',
  '一见钟情',
  '追',
  '关心',
  '喜悦',
  '约会',
  '好看',
];

const words = [...chineseWords, ...chineseSentences];

// for (let index = 0; index < words.length; index++) {
//   const word = array[index];
//   const url = `https://fanyi.baidu.com/gettts?lan=zh&spd=5&text=${querystring.escape(word)}`;
//   // Download the file

//   await download(url, '/Users/wendy/Desktop/中文学习/俱乐部/读音素材/爱情', {
//     filename: v + '.mp3',
//   });
// }

async function requestFunc(v) {
  // File URL
  const url = `https://fanyi.baidu.com/gettts?lan=zh&spd=5&text=${querystring.escape(v)}`;
  // Download the file
  console.log(v);
  await download(url, '/Users/wendy/Desktop/中文学习/俱乐部/读音素材/爱情', {
    filename: v + '.mp3',
  });
}

function waitPromise(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

let current = 0;

async function loopfunc() {
  if (current <= words.length - 1) {
    await requestFunc(words[current]);
    await waitPromise(100);
    current++;
    loopfunc();
  }
}
loopfunc();
