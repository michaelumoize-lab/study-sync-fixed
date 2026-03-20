// lib/pdf-client.ts
"use client";
import * as pdfjsLib from "pdfjs-dist";

interface PDFTextItem {
  str: string;
  transform: number[];
}

if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}
export async function parsePDFFile(file: File) {
  try {
    // 1. Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // 2. Load the PDF
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // --- TEXT EXTRACTION ---

    try {
      let fullText = "";
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        let lastY: number | null = null;
        let lastX: number | null = null;
        let pageText = "";

        for (const item of textContent.items) {
          const textItem = item as PDFTextItem & { transform: number[], width?: number };
          
          if (
            typeof textItem.str !== "string" ||
            !Array.isArray(textItem.transform) ||
            typeof textItem.transform[5] !== "number"
          ) {
            continue;
          }

          const currentY = textItem.transform[5]; // Y position on page
          const currentX = textItem.transform[4]; // X position on page

          if (lastY !== null && Math.abs(currentY - lastY) > 2) {
            // Y position changed — new line
            pageText += "\n";
            lastX = null;
          } else if (lastX !== null && (currentX - lastX) > 2) {
            pageText += " ";
          }

          pageText += textItem.str;
          lastY = currentY;
          lastX = currentX + (textItem.width ?? textItem.str.length * 5);
        }

        fullText += pageText + "\n\n"; // double newline between pages
      }

      return {
        fullText: fullText.trim(), // Just the raw text
      };
    } finally {
      if (pdfDocument) {
        await pdfDocument.destroy();
      }
    }
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error;
  }
}
