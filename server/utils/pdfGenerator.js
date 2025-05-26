// utils/pdfGenerator.js
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function generatePDF({ title, content }) {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();

  // Add a page to the document
  const page = pdfDoc.addPage();

  // Get the width and height of the page
  const { width, height } = page.getSize();

  // Set the font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Title
  const fontSizeTitle = 24;
  page.drawText(title, {
    x: 50,
    y: height - 4 * fontSizeTitle,
    size: fontSizeTitle,
    font,
    color: rgb(0, 0, 0),
  });

  // Content (wrap text simply by splitting lines)
  const fontSizeContent = 14;
  const lines = content.split("\n");
  let yPosition = height - 6 * fontSizeTitle;

  for (const line of lines) {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: fontSizeContent,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSizeContent + 5;
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  return pdfBytes; // return the generated PDF file bytes
}
