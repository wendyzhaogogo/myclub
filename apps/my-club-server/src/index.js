/* eslint-disable @typescript-eslint/no-var-requires */
const download = require('download');
const querystring = require('querystring');

// 词语数组
const words22 = [
  '您好',
  '欢迎光临',
  '请问',
  '买',
  '裙子',
  '图片',
  '售货员',
  '新样式',
  '上市',
  '尺寸',
  '等',
  '结账',
  '支付',
  '扫码',
  '成功',
  '支持',
  '再次光临',
  '订购',
  '西服',
  '货',
  '检查',
  '规定',
  '试',
  '帮助',
  '好评',
];

// 句子数组
const sentences = [
  '您好！欢迎光临。请问您想买什么？',
  '你好。我想看这条裙子',
  '哦，这是我们的新样式，周一刚上市。请问，您的尺寸是多少？',
  '我平时穿M号。',
  '好的，请您等一会儿。我马上带上去。',
  '这是您想看的那条裙子。',
  '就是这个裙子了，真好看哇！请帮我结账这条裙子。',
  '好的，请稍等一会。您的这条裙子200块。您怎么支付呢？',
  '扫码吧。',
  '扫码成功',
  '谢谢您的支持。欢迎您再次光临。',
  '你好。我本周在你们的网上市场订购一套西服。可是收到货之后，穿上去有点紧了。今天我来这里是想换另一个尺寸，不知道可以吗？',
  '根据老板的规定，我们要检查检查，请给我您的货品。',
  '给你',
  '我检查好了。幸亏衣服没什么问题，我们可以给您换一部。请问您想换哪个尺寸？',
  'L号吧',
  '请您去试试，免得再发生问题。',
  '行了。谢谢你们的帮助。我回去后会给你们一个好评。',
  '谢谢您的支持，欢迎您再次光临。',
];

const words = [...words22, ...sentences];

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
  await download(url, '/Users/wendy/Desktop/中文学习/俱乐部/读音素材/购物', {
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
