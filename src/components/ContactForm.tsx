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

        {/* Calendly-Style Booking Interface */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border overflow-hidden">
          {/* Calendly Header */}
          <div className="bg-white dark:bg-gray-900 border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#006BFF] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">Calendly</span>
              </div>
              <Badge variant="outline" className="text-xs">Demo</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 min-h-[600px]">
            {/* Left Panel - Meeting Details */}
            <div className="md:col-span-2 bg-white dark:bg-gray-900 p-8 border-r">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sebastian Ganz
                  </h2>
                  <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    30 Minute Meeting
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
                    <Clock className="h-5 w-5 text-[#006BFF]" />
                    <span>30 min</span>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-[#006BFF]" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Available Hours</p>
                        <p>6:00 PM - 9:00 PM</p>
                        <p className="text-xs">Central Time (Chicago)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="pt-6 border-t">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Selected Time</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedDate}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {selectedTime} (Central Time)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Calendar & Time Selection */}
            <div className="md:col-span-3 bg-gray-50 dark:bg-gray-800 p-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Select a Date & Time
                </h3>

                {/* Date Selection */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-6 border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {mockDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>
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
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedDate === date.toDateString()
                            ? "bg-[#006BFF] text-white shadow-md"
                            : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              {date.toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                            <div className="text-sm opacity-80">
                              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          {selectedDate === date.toDateString() && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Available Times
                    </h4>
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                      {mockTimeSlots.map((time, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg text-center transition-all font-medium ${
                            selectedTime === time
                              ? "bg-[#006BFF] text-white shadow-md"
                              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border text-gray-900 dark:text-white"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedDate && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center border">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select a date to view available times
                    </p>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="mt-6">
                    <Button 
                      className="w-full h-12 bg-[#006BFF] hover:bg-[#0055CC] text-white font-medium text-base shadow-md"
                      size="lg"
                    >
                      Confirm Booking
                    </Button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
                      By proceeding, you confirm that you have read and agree to Calendly's Terms of Use and Privacy Notice
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calendly Footer */}
          <div className="bg-white dark:bg-gray-900 border-t p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by <span className="text-[#006BFF] font-semibold">Calendly</span> • Cookie settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}