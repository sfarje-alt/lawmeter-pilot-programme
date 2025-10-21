import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Phone, User } from "lucide-react";

export function ContactForm() {

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Schedule a Meeting</h2>
        <p className="text-muted-foreground">
          Book a consultation to discuss legislative compliance and monitoring strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Email</div>
                  <div className="text-muted-foreground">sganz@lawmeter.io</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Phone</div>
                  <div className="text-muted-foreground">+1 (219) 877-4354</div>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Available Hours</div>
                  <div className="text-muted-foreground">6:00 PM - 9:00 PM</div>
                  <div className="text-xs text-muted-foreground">Central Time (Chicago)</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-foreground mb-2">Available Meeting Types</h4>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">Compliance Review</Badge>
                <Badge variant="outline" className="mr-2">Risk Assessment</Badge>
                <Badge variant="outline" className="mr-2">Training Session</Badge>
                <Badge variant="outline" className="mr-2">System Demo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Book a Meeting via Calendly */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book a Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Use the calendar below to book a meeting directly. Choose a time that works best for you during available hours (6 PM - 9 PM Central Time).
              </p>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                <iframe
                  src="https://calendly.com/sganz-lawmeter"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Book a meeting with LawMeter"
                  className="bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}