import { ThemeProvider } from "../theme-provider";
import Invoices from "@/pages/invoices";

export default function InvoicesExample() {
  return (
    <ThemeProvider>
      <div className="p-6">
        <Invoices />
      </div>
    </ThemeProvider>
  );
}
