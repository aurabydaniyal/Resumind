import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up pdf.js worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

/**
 * Extracts plain text from an uploaded resume file (PDF or DOCX or TXT)
 * @param {File} file 
 * @returns {Promise<string>}
 */
export async function extractTextFromFile(file) {
  if (!file) {
    throw new Error('No file provided for text extraction');
  }

  const fileType = file.name.split('.').pop().toLowerCase();

  if (fileType === 'pdf') {
    return extractTextFromPdf(file);
  } else if (fileType === 'docx') {
    return extractTextFromDocx(file);
  } else if (fileType === 'txt' || fileType === 'md') {
    return extractTextFromPlain(file);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF (.pdf), Word Document (.docx), or plain text file.');
  }
}

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  const numPages = pdf.numPages;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map(item => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }

  return cleanExtractedText(fullText);
}

async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return cleanExtractedText(result.value);
}

async function extractTextFromPlain(file) {
  const text = await file.text();
  return cleanExtractedText(text);
}

function cleanExtractedText(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
