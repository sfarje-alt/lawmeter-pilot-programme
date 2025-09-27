import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Star, ExternalLink, MessageSquare, User, Phone, Mail, Calendar, FileText, Users, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: number;
  title: string;
  type: string;
  portfolio: string;
  regulator: string;
  party: string;
  mp: string;
  status: string;
  riskScore: string;
  effectiveDate: string;
  summary: string;
  starred: boolean;
  isNew: boolean;
}

interface AlertCardProps {
  alert: Alert;
  showEnhancedFeatures?: boolean;
}

export function AlertCard({ alert, showEnhancedFeatures = false }: AlertCardProps) {
  const [isStarred, setIsStarred] = useState(alert.starred);
  const [showComments, setShowComments] = useState(false);
  const [teamComment, setTeamComment] = useState("");
  const [privateComment, setPrivateComment] = useState("");

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case 'labor':
        return 'party-labor';
      case 'liberal':
        return 'party-liberal';
      case 'greens':
        return 'party-greens';
      default:
        return 'party-crossbench';
    }
  };

  const toggleStar = () => {
    setIsStarred(!isStarred);
  };

  return (
    <Card className="relative">
      {alert.isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-success text-success-foreground">NEW</Badge>
        </div>
      )}
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {alert.type}
              </Badge>
              <Badge 
                variant={getRiskBadgeVariant(alert.riskScore)}
                className="text-xs"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {alert.riskScore} Risk
              </Badge>
              {alert.isNew && (
                <Badge className="bg-accent text-accent-foreground text-xs">
                  New This Week
                </Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-foreground leading-tight">
              {alert.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {alert.portfolio}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {alert.regulator}
              </span>
              {alert.mp && (
                <>
                  <span>•</span>
                  <span 
                    className="flex items-center"
                    style={{ color: `hsl(var(--${getPartyColor(alert.party)}))` }}
                  >
                    <User className="h-3 w-3 mr-1" />
                    {alert.mp} ({alert.party})
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleStar}
              className={isStarred ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground"}
            >
              <Star className={`h-4 w-4 ${isStarred ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Status:</span>
            <p className="text-foreground">{alert.status}</p>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Effective Date:</span>
            <p className="text-foreground">{new Date(alert.effectiveDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <span className="font-medium text-muted-foreground text-sm">Summary:</span>
          <p className="text-foreground text-sm mt-1 leading-relaxed">{alert.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Mother Act
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-1" />
            View Amendment
          </Button>
          {alert.type === "Bill" && (
            <Button variant="outline" size="sm">
              <Calendar className="h-3 w-3 mr-1" />
              Track Progress
            </Button>
          )}
        </div>

        {/* Enhanced Features for Starred Items */}
        {showEnhancedFeatures && isStarred && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Enhanced Tracking</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comments
                </Button>
              </div>

              {/* MP/Senator Contact Info for Bills */}
              {alert.type === "Bill" && (
                <div className="bg-muted p-3 rounded-lg">
                  <h5 className="font-medium text-foreground mb-2">Contact Information</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <User className="h-3 w-3 mr-2" />
                      {alert.mp} - {alert.party}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="h-3 w-3 mr-2" />
                      (02) 6277 7320
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="h-3 w-3 mr-2" />
                      {alert.mp.toLowerCase().replace(' ', '.')}.mp@aph.gov.au
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              {showComments && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Team Comment (Visible to all)
                    </label>
                    <Textarea
                      placeholder="Add a comment for the whole team..."
                      value={teamComment}
                      onChange={(e) => setTeamComment(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">
                      Private Comment (Only you can see)
                    </label>
                    <Textarea
                      placeholder="Add a private comment..."
                      value={privateComment}
                      onChange={(e) => setPrivateComment(e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">Save Comments</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}