import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Calendar() {
  const [, setLocation] = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1));

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const invoiceEvents = [
    { date: 5, id: "INV-002", vendor: "Global LLC", amount: "$5,230", status: "overdue" as const },
    { date: 15, id: "INV-001", vendor: "Acme Corp", amount: "$2,450", status: "unpaid" as const },
    { date: 20, id: "INV-004", vendor: "Office Supplies", amount: "$890", status: "unpaid" as const },
    { date: 28, id: "INV-007", vendor: "Software License", amount: "$1,299", status: "unpaid" as const },
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: number) => {
    return invoiceEvents.filter(event => event.date === day);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          View upcoming invoice due dates and reminders
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={previousMonth} data-testid="button-prev-month">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={nextMonth} data-testid="button-next-month">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-1"
              >
                {day}
              </div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-20" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDay(day);
              const isToday = day === 2 && currentDate.getMonth() === 9;

              return (
                <div
                  key={day}
                  className={`min-h-20 border rounded-lg p-1.5 ${
                    isToday ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  data-testid={`calendar-day-${day}`}
                >
                  <div className={`text-xs font-medium mb-1 ${
                    isToday ? "text-primary" : ""
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setLocation(`/invoices/${event.id}`)}
                        className="text-xs p-1 rounded bg-card border hover-elevate cursor-pointer"
                        data-testid={`event-${event.id}`}
                      >
                        <div className="font-mono font-medium">{event.id}</div>
                        <div className="text-muted-foreground truncate">
                          {event.vendor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upcoming Due Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {invoiceEvents
              .sort((a, b) => a.date - b.date)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 rounded-lg border hover-elevate cursor-pointer"
                  onClick={() => setLocation(`/invoices/${event.id}`)}
                  data-testid={`upcoming-${event.id}`}
                >
                  <div>
                    <p className="font-mono font-medium text-xs">{event.id}</p>
                    <p className="text-xs text-muted-foreground">{event.vendor}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{event.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: Oct {event.date}, 2024
                      </p>
                    </div>
                    <InvoiceStatusBadge status={event.status} />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
