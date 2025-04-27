import { createHash } from 'crypto';

// Common patterns for extracting data
const AMOUNT_PATTERN = /\$?\d+\.\d{2}/;
const DATE_PATTERN = /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/;

export const processOCR = async (imageUri: string): Promise<any> => {
  // Simulate Tesseract.js OCR processing (replace with actual OCR library)
  return new Promise((resolve) => {
    setTimeout(() => {
      const rawText = 'Sample Vendor\nInvoice #123\n04-10-2025\nItem 1 $49.99\nItem 2 $50.00\nTotal $99.99';
      const validation = validateReceipt(rawText);

      resolve({
        isValid: validation.isValid,
        confidence: validation.confidence,
        rawText,
        vendor: extractVendor(rawText),
        date: extractDate(rawText),
        amount: extractAmount(rawText),
        items: [
          { name: 'Item 1', price: 49.99 },
          { name: 'Item 2', price: 50.00 },
        ],
      });
    }, 1000);
  });
};

export const validateReceipt = (text: string): { isValid: boolean; confidence: number } => {
  // Placeholder validation (adapt based on actual requirements)
  const hasAmount = AMOUNT_PATTERN.test(text);
  const hasDate = DATE_PATTERN.test(text);
  const lines = text.split('\n').filter(line => line.trim());
  const hasMultipleLines = lines.length > 2;

  const confidence = (hasAmount ? 30 : 0) + (hasDate ? 30 : 0) + (hasMultipleLines ? 40 : 0);
  return { isValid: hasAmount && hasDate && hasMultipleLines, confidence };
};

export const extractDate = (text: string): string | null => {
  const match = text.match(DATE_PATTERN);
  if (!match) return null;
  try {
    const dateStr = match[0];
    const [month, day, year] = dateStr.split(/[-/]/);
    const fullYear = year.length === 2 ? `20${year}` : year;
    const date = new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
};

export const extractAmount = (text: string): string | null => {
  const match = text.match(AMOUNT_PATTERN);
  return match ? match[0].replace('$', '') : null;
};

export const extractVendor = (text: string): string => {
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !AMOUNT_PATTERN.test(trimmed) && !DATE_PATTERN.test(trimmed)) {
      return trimmed;
    }
  }
  return '';
};

export const computeImageHash = async (imageUri: string): Promise<string> => {
  // Simulate image hash computation (replace with actual image processing)
  return createHash('sha256').update(imageUri).digest('hex');
};