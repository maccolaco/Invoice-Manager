import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    defaultCurrency: "USD",
    reminderDays: "7",
    enableNotifications: true,
    notifyBeforeDue: true,
    notifyOnDue: true,
    notifyAfterDue: true,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your application preferences and notifications
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">General Settings</CardTitle>
            <CardDescription className="text-sm">
              Configure default values for invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={settings.defaultCurrency}
                onValueChange={(value) =>
                  setSettings({ ...settings, defaultCurrency: value })
                }
              >
                <SelectTrigger id="currency" data-testid="select-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderDays">Default Reminder Days</Label>
              <Select
                value={settings.reminderDays}
                onValueChange={(value) =>
                  setSettings({ ...settings, reminderDays: value })
                }
              >
                <SelectTrigger id="reminderDays" data-testid="select-reminder-days">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">7 days before</SelectItem>
                  <SelectItem value="14">14 days before</SelectItem>
                  <SelectItem value="30">30 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notification Preferences</CardTitle>
            <CardDescription className="text-sm">
              Configure when you want to receive reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableNotifications" className="text-base">
                  Enable Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications for invoice reminders
                </p>
              </div>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableNotifications: checked })
                }
                data-testid="switch-enable-notifications"
              />
            </div>

            <div className="space-y-3 pl-4 border-l-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyBeforeDue" className="text-sm">
                    Before Due Date
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    7 days before invoice is due
                  </p>
                </div>
                <Switch
                  id="notifyBeforeDue"
                  checked={settings.notifyBeforeDue}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyBeforeDue: checked })
                  }
                  disabled={!settings.enableNotifications}
                  data-testid="switch-notify-before"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyOnDue" className="text-sm">
                    On Due Date
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    On the day the invoice is due
                  </p>
                </div>
                <Switch
                  id="notifyOnDue"
                  checked={settings.notifyOnDue}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyOnDue: checked })
                  }
                  disabled={!settings.enableNotifications}
                  data-testid="switch-notify-on-due"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifyAfterDue" className="text-sm">
                    After Due Date
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    3 days after invoice is overdue
                  </p>
                </div>
                <Switch
                  id="notifyAfterDue"
                  checked={settings.notifyAfterDue}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifyAfterDue: checked })
                  }
                  disabled={!settings.enableNotifications}
                  data-testid="switch-notify-after"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline">Reset to Defaults</Button>
          <Button size="sm" onClick={handleSave} data-testid="button-save-settings">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
