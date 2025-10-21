import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Mail, Phone, User, ChevronLeft, ChevronRight } from "lucide-react";

export function ContactForm() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock calendar dates (next 7 days)
  const mockDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Mock time slots (6 PM - 9 PM)
  const mockTimeSlots = [
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"
  ];

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

        {/* Book a Meeting - Calendly Style Mock */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Book a Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">Sebastian Ganz</h3>
                <p className="text-sm text-muted-foreground mb-4">30 Minute Meeting</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>30 min</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-foreground">Select a Date</h4>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {mockDates.map((date, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date.toDateString())}
                          className={`w-full p-3 rounded-lg border text-left transition-colors ${
                            selectedDate === date.toDateString()
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-medium text-foreground">
                            {date.toLocaleDateString('en-US', { weekday: 'long' })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">
                      {selectedDate ? "Select a Time" : "Choose a date first"}
                    </h4>
                    {selectedDate ? (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {mockTimeSlots.map((time, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedTime(time)}
                            className={`w-full p-3 rounded-lg border text-center transition-colors ${
                              selectedTime === time
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary/50 text-foreground"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">Please select a date to view available times</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedDate && selectedTime && (
                <div className="border-t pt-6">
                  <div className="bg-accent/50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Selected Time</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate} at {selectedTime} (Central Time)
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    Confirm Booking
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    A calendar invitation will be sent to your email
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}