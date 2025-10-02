import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, FileText, Pencil } from "lucide-react";

export default function InvoiceDetail() {
  const [, params] = useRoute("/invoices/:id");
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: "INV-2024-001",
    vendor: "Acme Corp",
    type: "payable",
    issueDate: "2024-09-15",
    dueDate: "2024-10-15",
    subtotal: "2200.00",
    tax: "250.00",
    total: "2450.00",
    currency: "USD",
    status: "unpaid",
    notes: "Net 30 payment terms",
  });

  const lineItems = [
    { id: 1, description: "Web Development Services", qty: 40, unitPrice: 50, amount: 2000 },
    { id: 2, description: "Hosting & Maintenance", qty: 1, unitPrice: 200, amount: 200 },
  ];

  const handleSave = () => {
    console.log("Saving invoice:", formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/invoices")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invoice {formData.invoiceNumber}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">{formData.vendor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} data-testid="button-save">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setIsEditing(true)} data-testid="button-edit">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceNumber: e.target.value })
                    }
                    disabled={!isEditing}
                    className="font-mono"
                    data-testid="input-invoice-number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor/Customer</Label>
                  <Input
                    id="vendor"
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-vendor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="type" data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payable">Payable</SelectItem>
                      <SelectItem value="receivable">Receivable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="status" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDate: e.target.value })
                    }
                    disabled={!isEditing}
                    data-testid="input-issue-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={!isEditing}
                    data-testid="input-due-date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  data-testid="input-notes"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left p-2 text-xs font-medium text-muted-foreground uppercase">
                        Description
                      </th>
                      <th className="text-right p-2 text-xs font-medium text-muted-foreground uppercase">
                        Qty
                      </th>
                      <th className="text-right p-2 text-xs font-medium text-muted-foreground uppercase">
                        Unit Price
                      </th>
                      <th className="text-right p-2 text-xs font-medium text-muted-foreground uppercase">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-2 text-sm">{item.description}</td>
                        <td className="p-2 text-sm text-right">{item.qty}</td>
                        <td className="p-2 text-sm text-right font-mono">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="p-2 text-sm text-right font-semibold font-mono">
                          ${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">${formData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-mono">${formData.tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span className="font-mono" data-testid="text-total">${formData.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PDF Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] border rounded-lg bg-muted/20 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">PDF preview</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">
                  <InvoiceStatusBadge status={formData.status as any} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize mt-1">{formData.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-medium mt-1">{formData.currency}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
