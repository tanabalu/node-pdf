import fs from 'fs/promises';
import PDFJS from 'pdfjs-dist';

const pdfParser = async (inputPath, outputPath) => {
  // 读取 PDF 文件
  const inputPdf = await fs.readFile(inputPath);
  // 将二进制数据转换为 ArrayBuffer
  const pdfData = new Uint8Array(inputPdf).buffer;

  // 使用 PDF.js 解析 PDF 文件
  const loadingTask = PDFJS.getDocument({ data: pdfData });
  const pdf = await loadingTask.promise;
  console.log(pdf);
  // 获取所有页数
  const totalPages = pdf.numPages;
  // 定义空的 JSON 对象
  const parsedData = {};

  // 循环遍历所有页数
  for (let i = 1; i <= totalPages; i++) {
    // 获取 PDF 页面对象
    const page = await pdf.getPage(i);
    // 解析文本内容
    const content = await page.getTextContent();
    // 将文本内容转换为字符串
    const pageText = await content.items.map((item) => item.str).join('');
    // 将页码和页内容添加到 JSON 对象中
    parsedData[i] = pageText;
  }

  // 将 JSON 对象转换为字符串
  const jsonString = JSON.stringify(parsedData, null, 2);
  // const pdfString = JSON.stringify(pdf, null, 2);
  // await fs.writeFile('./origin_pd.json', pdfString)
  // 将字符串写入输出文件
  await fs.writeFile(outputPath, jsonString);

  console.log('PDF 文件解析完成！');
};

// 调用 pdfParser 函数，并传入输入和输出文件路径
pdfParser('./input.pdf', './output_pdfjs-dist.json');
