import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientProfile, TIMEZONES } from "../types";
import { Mail, MessageSquare, Clock, Calendar } from "lucide-react";

interface Step7Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export function Step7DeliverySettings({ data, onChange }: Step7Props) {
  const toggleEmailDaily = (email: string) => {
    const current = data.emailRecipients.daily;
    if (current.includes(email)) {
      onChange({
        emailRecipients: {
          ...data.emailRecipients,
          daily: current.filter(e => e !== email)
        }
      });
    } else {
      onChange({
        emailRecipients: {
          ...data.emailRecipients,
          daily: [...current, email]
        }
      });
    }
  };

  const toggleEmailWeekly = (email: string) => {
    const current = data.emailRecipients.weekly;
    if (current.includes(email)) {
      onChange({
        emailRecipients: {
          ...data.emailRecipients,
          weekly: current.filter(e => e !== email)
        }
      });
    } else {
      onChange({
        emailRecipients: {
          ...data.emailRecipients,
          weekly: [...current, email]
        }
      });
    }
  };

  const toggleWhatsappRecipient = (phone: string) => {
    if (data.whatsappRecipients.includes(phone)) {
      onChange({ whatsappRecipients: data.whatsappRecipients.filter(p => p !== phone) });
    } else {
      onChange({ whatsappRecipients: [...data.whatsappRecipients, phone] });
    }
  };

  const availableEmails = data.clientUsers.map(u => u.email);
  const availablePhones = data.clientUsers.filter(u => u.whatsappEnabled && u.phone).map(u => u.phone!);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Delivery Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure how and when alerts and reports are delivered
        </p>
      </div>

      {/* Channels */}
      <div className="space-y-4">
        <Label>Delivery Channels</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            data.deliveryChannels.email 
              ? 'border-primary bg-primary/10' 
              : 'border-border/30 bg-background/30'
          }`} onClick={() => onChange({
            deliveryChannels: { ...data.deliveryChannels, email: !data.deliveryChannels.email }
          })}>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-xs text-muted-foreground">Receive reports via email</div>
              </div>
              <Switch 
                checked={data.deliveryChannels.email} 
                className="ml-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            data.deliveryChannels.whatsapp 
              ? 'border-primary bg-primary/10' 
              : 'border-border/30 bg-background/30'
          }`} onClick={() => onChange({
            deliveryChannels: { ...data.deliveryChannels, whatsapp: !data.deliveryChannels.whatsapp }
          })}>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5" />
              <div>
                <div className="font-medium">WhatsApp</div>
                <div className="text-xs text-muted-foreground">Receive alerts via WhatsApp</div>
              </div>
              <Switch 
                checked={data.deliveryChannels.whatsapp} 
                className="ml-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Recipients */}
      {data.deliveryChannels.email && (
        <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <Label>Email Recipients</Label>
          </div>
          
          {availableEmails.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Daily Report Recipients</Label>
                <div className="flex flex-wrap gap-2">
                  {availableEmails.map((email) => (
                    <Badge
                      key={`daily-${email}`}
                      variant={data.emailRecipients.daily.includes(email) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEmailDaily(email)}
                    >
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Weekly Report Recipients</Label>
                <div className="flex flex-wrap gap-2">
                  {availableEmails.map((email) => (
                    <Badge
                      key={`weekly-${email}`}
                      variant={data.emailRecipients.weekly.includes(email) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEmailWeekly(email)}
                    >
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Add client users first to configure email recipients.</p>
          )}
        </div>
      )}

      {/* WhatsApp Recipients */}
      {data.deliveryChannels.whatsapp && (
        <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border/30">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <Label>WhatsApp Recipients</Label>
          </div>
          
          {availablePhones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availablePhones.map((phone) => (
                <Badge
                  key={phone}
                  variant={data.whatsappRecipients.includes(phone) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleWhatsappRecipient(phone)}
                >
                  {phone}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add client users with WhatsApp enabled to configure recipients.
            </p>
          )}
        </div>
      )}

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Daily Report Schedule
          </Label>
          <Input
            type="time"
            value={data.dailyReportSchedule || "08:00"}
            onChange={(e) => onChange({ dailyReportSchedule: e.target.value })}
            className="bg-background/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Report Day
          </Label>
          <Select
            value={data.weeklyReportSchedule?.dayOfWeek?.toString() || "1"}
            onValueChange={(value) => onChange({
              weeklyReportSchedule: {
                dayOfWeek: parseInt(value),
                time: data.weeklyReportSchedule?.time || "08:00"
              }
            })}
          >
            <SelectTrigger className="bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <Label>Timezone</Label>
        <Select
          value={data.timezone}
          onValueChange={(value) => onChange({ timezone: value })}
        >
          <SelectTrigger className="bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Send Only If Alerts */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-border/30">
        <div>
          <Label htmlFor="sendOnlyIfAlerts">Send Only If There Are Alerts</Label>
          <p className="text-sm text-muted-foreground">
            Skip sending reports when there are no new alerts
          </p>
        </div>
        <Switch
          id="sendOnlyIfAlerts"
          checked={data.sendOnlyIfAlerts}
          onCheckedChange={(checked) => onChange({ sendOnlyIfAlerts: checked })}
        />
      </div>
    </div>
  );
}
