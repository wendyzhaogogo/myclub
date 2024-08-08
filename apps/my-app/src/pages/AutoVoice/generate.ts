async function downloadFromLink(word: string) {
  //   setTimeout(() => {
  // const el_a = document.createElement('a');
  // el_a.download = word;
  // el_a.target = '_blank';
  const url = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURIComponent(word)}&spd=5`;
  //     el_a.href = url;
  //     document.body.appendChild(el_a);
  //     el_a.click();
  //     el_a.remove();
  //   }, 500);
  window.open(url);
  // const url = `https://fanyi.baidu.com/gettts?lan=zh&spd=5&text=${encodeURIComponent(word)}`;
  // const response = await fetch(url);
  // const blob = await response.blob();
  // const a = document.createElement('a');
  // a.href = URL.createObjectURL(blob);
  // a.download = 'file.js'; // 下载文件时的文件名
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // URL.revokeObjectURL(a.href);
}

export async function generate(str?: string) {
  if (!str) return;
  const words = str.split('\n').map((v) => v.trim());
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    await downloadFromLink(word);
  }
}
