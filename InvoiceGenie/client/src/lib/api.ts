interface ParsedInvoiceData {
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

interface ParsePDFResponse {
  success: boolean;
  data: ParsedInvoiceData;
  filePath: string;
}

export async function parsePDFInvoice(file: File): Promise<ParsePDFResponse> {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('/api/invoices/parse-pdf', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to parse PDF');
  }

  return response.json();
}

export async function createInvoice(data: any) {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create invoice');
  }

  return response.json();
}

export async function getInvoices(filters?: { type?: string; status?: string; search?: string }) {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`/api/invoices?${params.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return response.json();
}
