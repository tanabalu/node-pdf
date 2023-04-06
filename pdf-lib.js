import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';

const pdfParser = async (inputPath, outputPath) => {
  // 读取 PDF 文件
  const inputPdf = await fs.readFile(inputPath);
  // 创建 PDFDocument 实例
  const pdfDoc = await PDFDocument.load(inputPdf);
  // 获取所有页数
  const totalPages = pdfDoc.getPageCount();
  // 定义空的 JSON 对象
  const pdfData = {};

  // 循环遍历所有页数
  for (let i = 0; i < totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    // console.log(page)
    // 解析文本内容
    const textContent = await page.getContentStream();
    console.log('textContent', textContent.computeContents())
    // 将文本内容转换为字符串
    const pageText = await textContent.items.map((item) => item.str).join('');
    // 将页码和页内容添加到 JSON 对象中
    pdfData[i + 1] = pageText;
  }

  // 将 JSON 对象转换为字符串
  const jsonString = JSON.stringify(pdfData, null, 2);
  // 将字符串写入输出文件
  await fs.writeFile(outputPath, jsonString);
};

// 调用 pdfParser 函数，并传入输入和输出文件路径
pdfParser('./input.pdf', './output_pdf-lib.json');
