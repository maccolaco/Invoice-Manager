import { ThemeProvider } from "../theme-provider";
import Calendar from "@/pages/calendar";

export default function CalendarExample() {
  return (
    <ThemeProvider>
      <div className="p-6">
        <Calendar />
      </div>
    </ThemeProvider>
  );
}
