import { extractText } from 'unpdf';
import { createWorker } from 'tesseract.js';
import fs from 'fs/promises';
import { existsSync } from 'fs';

interface ExtractedInvoiceData {
  invoiceNumber: string;
  vendorCustomer: string;
  issueDate: string;
  dueDate: string;
  subtotal: string;
  tax: string;
  total: string;
  currency: string;
  notes: string;
  lineItems: Array<{
    description: string;
    qty: number;
    unitPrice: string;
    amount: string;
  }>;
}

export async function parsePDF(filePath: string): Promise<ExtractedInvoiceData> {
  if (!existsSync(filePath)) {
    throw new Error('PDF file not found');
  }

  let extractedText = '';

  try {
    extractedText = await extractTextFromPDF(filePath);

    if (!extractedText || extractedText.trim().length < 50) {
      console.log('Minimal text found in PDF, attempting OCR...');
      extractedText = await performOCR(filePath);
    }
  } catch (error) {
    console.log('PDF text extraction failed, falling back to OCR:', error);
    extractedText = await performOCR(filePath);
  }

  return extractInvoiceFields(extractedText);
}

async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const { text } = await extractText(dataBuffer);
  return text;
}

async function performOCR(filePath: string): Promise<string> {
  const worker = await createWorker('eng');
  
  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(filePath);
    return text;
  } finally {
    await worker.terminate();
  }
}

function extractInvoiceFields(text: string): ExtractedInvoiceData {
  const invoiceNumberRegex = /(?:invoice|bill)\s*(?:number|#|no\.?)?:?\s*([A-Z0-9-]+)/i;
  const invoiceNumberMatch = text.match(invoiceNumberRegex);
  
  const vendorRegex = /(?:from|vendor|seller|company):\s*([^\n]+)/i;
  const vendorMatch = text.match(vendorRegex);
  
  const issueDateRegex = /(?:invoice\s*)?date:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i;
  const issueDateMatch = text.match(issueDateRegex);
  
  const dueDateRegex = /due\s*date:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i;
  const dueDateMatch = text.match(dueDateRegex);
  
  const totalRegex = /(?:total|amount\s*due):?\s*\$?\s*([\d,]+\.?\d{0,2})/i;
  const totalMatch = text.match(totalRegex);
  const total = totalMatch ? totalMatch[1].replace(/,/g, '') : '0.00';
  
  const taxRegex = /(?:tax|vat|gst):?\s*\$?\s*([\d,]+\.?\d{0,2})/i;
  const taxMatch = text.match(taxRegex);
  const tax = taxMatch ? taxMatch[1].replace(/,/g, '') : '0.00';
  
  const subtotalRegex = /(?:subtotal|sub-total):?\s*\$?\s*([\d,]+\.?\d{0,2})/i;
  const subtotalMatch = text.match(subtotalRegex);
  let subtotal = subtotalMatch ? subtotalMatch[1].replace(/,/g, '') : '0.00';
  
  if (parseFloat(subtotal) === 0 && parseFloat(total) > 0) {
    subtotal = (parseFloat(total) - parseFloat(tax)).toFixed(2);
  }
  
  let currency = 'USD';
  if (/\$|USD|US\$/i.test(text)) currency = 'USD';
  else if (/€|EUR/i.test(text)) currency = 'EUR';
  else if (/£|GBP/i.test(text)) currency = 'GBP';
  else if (/₹|INR/i.test(text)) currency = 'INR';
  
  const lineItems = extractLineItems(text);
  
  const notes = text.substring(0, 500).replace(/\s+/g, ' ').trim();
  
  return {
    invoiceNumber: invoiceNumberMatch ? invoiceNumberMatch[1] : 'UNKNOWN',
    vendorCustomer: vendorMatch ? vendorMatch[1].trim() : 'Unknown Vendor',
    issueDate: issueDateMatch ? normalizeDate(issueDateMatch[1]) : '',
    dueDate: dueDateMatch ? normalizeDate(dueDateMatch[1]) : '',
    subtotal,
    tax,
    total,
    currency,
    notes,
    lineItems
  };
}

function extractLineItems(text: string): Array<{description: string; qty: number; unitPrice: string; amount: string}> {
  const lineItems: Array<{description: string; qty: number; unitPrice: string; amount: string}> = [];
  
  const lineItemRegex = /([A-Za-z][A-Za-z\s]+?)\s+(\d+)\s+\$?\s*([\d,]+\.?\d{0,2})\s+\$?\s*([\d,]+\.?\d{0,2})/g;
  let match;
  
  while ((match = lineItemRegex.exec(text)) !== null) {
    lineItems.push({
      description: match[1].trim(),
      qty: parseInt(match[2]),
      unitPrice: match[3].replace(/,/g, ''),
      amount: match[4].replace(/,/g, '')
    });
  }
  
  return lineItems;
}

function normalizeDate(dateStr: string): string {
  const parts = dateStr.split(/[-/]/);
  if (parts.length !== 3) return dateStr;
  
  let [month, day, year] = parts;
  
  if (year.length === 2) {
    year = '20' + year;
  }
  
  if (month.length === 1) month = '0' + month;
  if (day.length === 1) day = '0' + day;
  
  return `${year}-${month}-${day}`;
}
