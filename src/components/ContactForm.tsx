import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Phone, User, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    meetingPurpose: "",
    preferredDate: "",
    preferredTime: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Meeting Request Submitted",
        description: "We'll contact you within 24 hours to confirm your meeting.",
      });
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      meetingPurpose: "",
      preferredDate: "",
      preferredTime: ""
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-success mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Meeting Request Submitted Successfully
            </h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest. We'll review your request and contact you within 24 hours to confirm the meeting details.
            </p>
            <Button onClick={resetForm} variant="outline">
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Schedule a Meeting</h2>
        <p className="text-muted-foreground">
          Book a consultation with Sebastian and Tomas to discuss legislative compliance and monitoring strategies.
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
                  <div className="font-medium text-foreground">General Inquiries</div>
                  <div className="text-muted-foreground">info@legaldashboard.com.au</div>
                </div>
              </div>
              
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Direct Line</div>
                  <div className="text-muted-foreground">+61 2 8765 4321</div>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">Business Hours</div>
                  <div className="text-muted-foreground">Mon-Fri, 9:00 AM - 5:00 PM</div>
                  <div className="text-xs text-muted-foreground">Australian Eastern Time</div>
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

        {/* Meeting Request Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Meeting Request Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Company/Organization
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Preferred Date
                  </label>
                  <Input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Preferred Time
                  </label>
                  <Input
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Meeting Purpose *
                </label>
                <Textarea
                  value={formData.meetingPurpose}
                  onChange={(e) => handleInputChange('meetingPurpose', e.target.value)}
                  placeholder="Please describe the purpose of the meeting, specific topics you'd like to discuss, and any particular compliance challenges you're facing..."
                  rows={4}
                  required
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Minimum 20 characters required
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || formData.meetingPurpose.length < 20}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Meeting Request
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t">
                <p>
                  * Required fields. By submitting this form, you agree to be contacted by our team 
                  regarding your meeting request. We typically respond within 24 hours during business days.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}