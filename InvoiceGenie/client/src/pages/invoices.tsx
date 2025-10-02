import { useState } from "react";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { PDFUploadZone } from "@/components/pdf-upload-zone";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Upload, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { parsePDFInvoice, createInvoice } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Invoices() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(
    location.includes("action=upload")
  );
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const { toast } = useToast();

  const invoices = [
    {
      id: "INV-001",
      number: "INV-2024-001",
      vendor: "Acme Corp",
      type: "payable",
      amount: "$2,450.00",
      issueDate: "2024-09-15",
      dueDate: "2024-10-15",
      status: "unpaid" as const,
    },
    {
      id: "INV-002",
      number: "INV-2024-002",
      vendor: "Global LLC",
      type: "payable",
      amount: "$5,230.00",
      issueDate: "2024-09-05",
      dueDate: "2024-10-05",
      status: "overdue" as const,
    },
    {
      id: "INV-003",
      number: "INV-2024-003",
      vendor: "Tech Solutions",
      type: "receivable",
      amount: "$1,850.00",
      issueDate: "2024-08-28",
      dueDate: "2024-09-28",
      status: "paid" as const,
    },
    {
      id: "INV-004",
      number: "INV-2024-004",
      vendor: "Office Supplies Co",
      type: "payable",
      amount: "$890.00",
      issueDate: "2024-09-20",
      dueDate: "2024-10-20",
      status: "unpaid" as const,
    },
    {
      id: "INV-005",
      number: "INV-2024-005",
      vendor: "Marketing Agency",
      type: "receivable",
      amount: "$3,200.00",
      issueDate: "2024-08-30",
      dueDate: "2024-09-30",
      status: "paid" as const,
    },
    {
      id: "INV-006",
      number: "INV-2024-006",
      vendor: "Cloud Services Inc",
      type: "payable",
      amount: "$1,299.00",
      issueDate: "2024-09-01",
      dueDate: "2024-10-01",
      status: "overdue" as const,
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    const matchesType = typeFilter === "all" || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage and track all your invoices
          </p>
        </div>
        <Button size="sm" onClick={() => setUploadDialogOpen(true)} data-testid="button-upload-invoice">
          <Upload className="h-4 w-4 mr-2" />
          Upload Invoice
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] h-9" data-testid="select-type-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payable">Payable</SelectItem>
                  <SelectItem value="receivable">Receivable</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Invoice #
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Vendor/Customer
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b hover-elevate cursor-pointer"
                    onClick={() => setLocation(`/invoices/${invoice.id}`)}
                    data-testid={`row-invoice-${invoice.id}`}
                  >
                    <td className="p-2">
                      <span className="font-mono text-xs font-medium">{invoice.number}</span>
                    </td>
                    <td className="p-2 text-sm">{invoice.vendor}</td>
                    <td className="p-2">
                      <span className="text-sm capitalize">{invoice.type}</span>
                    </td>
                    <td className="p-2 font-semibold text-sm">{invoice.amount}</td>
                    <td className="p-2 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    <td className="p-2">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No invoices found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Invoice</DialogTitle>
            <DialogDescription>
              Upload a PDF invoice to extract and store invoice data automatically
            </DialogDescription>
          </DialogHeader>
          {isParsing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Extracting invoice data from PDF...</p>
            </div>
          ) : parsedData ? (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-medium text-sm">Extracted Data</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Invoice #:</p>
                    <p className="font-medium">{parsedData.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vendor/Customer:</p>
                    <p className="font-medium">{parsedData.vendorCustomer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issue Date:</p>
                    <p className="font-medium">{parsedData.issueDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date:</p>
                    <p className="font-medium">{parsedData.dueDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subtotal:</p>
                    <p className="font-medium">${parsedData.subtotal}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax:</p>
                    <p className="font-medium">${parsedData.tax}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total:</p>
                    <p className="font-medium text-lg">${parsedData.total}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency:</p>
                    <p className="font-medium">{parsedData.currency}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setParsedData(null); }}>
                  Cancel
                </Button>
                <Button onClick={async () => {
                  try {
                    const invoice = await createInvoice({
                      invoiceNumber: parsedData.invoiceNumber,
                      type: 'payable',
                      vendorCustomer: parsedData.vendorCustomer,
                      issueDate: parsedData.issueDate || new Date().toISOString().split('T')[0],
                      dueDate: parsedData.dueDate || new Date().toISOString().split('T')[0],
                      subtotal: parsedData.subtotal,
                      tax: parsedData.tax,
                      total: parsedData.total,
                      currency: parsedData.currency,
                      status: 'unpaid',
                      notes: parsedData.notes,
                      extractedJson: parsedData
                    });
                    
                    if (parsedData.lineItems && parsedData.lineItems.length > 0) {
                      for (const item of parsedData.lineItems) {
                        await fetch(`/api/invoices/${invoice.id}/line-items`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(item),
                          credentials: 'include',
                        });
                      }
                    }
                    
                    toast({
                      title: "Success",
                      description: `Invoice created with ${parsedData.lineItems?.length || 0} line items`,
                    });
                    setParsedData(null);
                    setUploadDialogOpen(false);
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  }
                }}>
                  Create Invoice
                </Button>
              </div>
            </div>
          ) : (
            <PDFUploadZone
              onFileSelect={async (file) => {
                setIsParsing(true);
                try {
                  const result = await parsePDFInvoice(file);
                  setParsedData(result.data);
                  toast({
                    title: "PDF Parsed",
                    description: "Invoice data extracted successfully",
                  });
                } catch (error: any) {
                  toast({
                    title: "Error",
                    description: error.message || "Failed to parse PDF",
                    variant: "destructive",
                  });
                  setUploadDialogOpen(false);
                } finally {
                  setIsParsing(false);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
