import { BillItem, Comment } from "@/types/legislation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Trash2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { daysSince } from "@/lib/dateUtils";

interface BillDrawerProps {
  bill: BillItem | null;
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (visibility: "TEAM" | "PRIVATE", body: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export function BillDrawer({
  bill,
  isOpen,
  onClose,
  comments,
  onAddComment,
  onDeleteComment,
}: BillDrawerProps) {
  const [teamComment, setTeamComment] = useState("");
  const [privateComment, setPrivateComment] = useState("");
  const { toast } = useToast();

  if (!bill) return null;

  const teamComments = comments.filter((c) => c.visibility === "TEAM");
  const privateComments = comments.filter((c) => c.visibility === "PRIVATE");

  const handleCopySummary = () => {
    navigator.clipboard.writeText(bill.summary);
    toast({ title: "Summary copied to clipboard" });
  };

  const statuses = [
    "Introduced",
    "Second Reading",
    "Committee",
    "Consideration in Detail",
    "Passed House",
    "Passed Senate",
    "Royal Assent Pending",
  ];
  const currentStatusIndex = statuses.indexOf(bill.status);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{bill.title}</SheetTitle>
          <SheetDescription className="sr-only">Bill details</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="flex flex-wrap gap-2">
            {bill.party && <Badge variant="secondary">{bill.party}</Badge>}
            <Badge variant="outline">{bill.chamber}</Badge>
            <Badge variant="outline">{bill.status}</Badge>
            {bill.portfolio && <Badge variant="outline">{bill.portfolio}</Badge>}
          </div>

          {bill.mps && bill.mps.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Members of Parliament</h4>
              <div className="space-y-3">
                {bill.mps.map((mp, idx) => (
                  <div key={idx} className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium">{mp.name}</p>
                    {mp.role && <p className="text-sm text-muted-foreground">{mp.role}</p>}
                    <div className="flex gap-3 mt-2">
                      {mp.email && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${mp.email}`}>
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </a>
                        </Button>
                      )}
                      {mp.phone && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`tel:${mp.phone}`}>
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3">Status Timeline</h4>
            <div className="relative pl-6 space-y-4">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
              {statuses.map((status, idx) => {
                const isPast = idx < currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;
                const isFuture = idx > currentStatusIndex;

                return (
                  <div key={status} className="relative">
                    <div
                      className={`absolute left-[-1.3rem] w-4 h-4 rounded-full border-2 ${
                        isCurrent
                          ? "bg-primary border-primary"
                          : isPast
                          ? "bg-success border-success"
                          : "bg-background border-muted"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          isCurrent ? "text-primary" : isFuture ? "text-muted-foreground" : ""
                        }`}
                      >
                        {status}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-muted-foreground">{bill.stageLocation}</p>
                      )}
                      {isCurrent && (
                        <p className="text-xs text-muted-foreground">
                          Last action: {daysSince(bill.lastActionDate)} days ago
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Summary</p>
            <p className="text-sm">{bill.summary}</p>
          </div>

          {bill.bullets.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Key Points</p>
              <ul className="space-y-2">
                {bill.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handleCopySummary}>
            <Copy className="h-3 w-3 mr-2" />
            Copy Summary
          </Button>

          <div>
            <h4 className="font-semibold mb-3">Comments</h4>
            <Tabs defaultValue="team">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team">Team ({teamComments.length})</TabsTrigger>
                <TabsTrigger value="private">Private ({privateComments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="team" className="space-y-3">
                <div className="space-y-2">
                  {teamComments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{comment.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm">{comment.body}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add team comment..."
                    value={teamComment}
                    onChange={(e) => setTeamComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (teamComment.trim()) {
                        onAddComment("TEAM", teamComment);
                        setTeamComment("");
                      }
                    }}
                  >
                    Add Team Comment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="private" className="space-y-3">
                <div className="space-y-2">
                  {privateComments.map((comment) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{comment.userName}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{comment.body}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add private comment..."
                    value={privateComment}
                    onChange={(e) => setPrivateComment(e.target.value)}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (privateComment.trim()) {
                        onAddComment("PRIVATE", privateComment);
                        setPrivateComment("");
                      }
                    }}
                  >
                    Add Private Comment
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
