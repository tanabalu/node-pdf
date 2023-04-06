import PDFParser from 'pdf2json';
import fs from 'fs/promises';

const pdfParser = new PDFParser();

pdfParser.loadPDF("input.pdf");

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

pdfParser.on("pdfParser_dataReady", async (pdfData) => {
  // 这里的pdfData代表解析出来的PDF文件数据，可以进行任何自定义的处理操作
  console.log(pdfData);

  // 将 JSON 对象转换为字符串
  const jsonString = JSON.stringify(pdfData, null, 2);
  // 将字符串写入输出文件
  await fs.writeFile('./output_pdf2json.json', jsonString);
});
