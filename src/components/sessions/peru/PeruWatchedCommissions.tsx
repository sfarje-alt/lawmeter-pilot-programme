// Peru Watched Commissions Management Component

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Star, 
  Plus, 
  X, 
  Building, 
  Check,
  Info
} from 'lucide-react';

interface PeruWatchedCommissionsProps {
  watchedCommissions: string[];
  allCommissions: string[];
  onAdd: (commission: string) => void;
  onRemove: (commission: string) => void;
}

export function PeruWatchedCommissions({
  watchedCommissions,
  allCommissions,
  onAdd,
  onRemove,
}: PeruWatchedCommissionsProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const availableCommissions = allCommissions.filter(
    c => !watchedCommissions.includes(c)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Watched Commissions
          </CardTitle>
          <CardDescription>
            Sessions from these commissions will be marked as "Recommended" automatically.
            You will see them highlighted in the sessions list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Commission Button */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Add Commission to Watchlist
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search commissions..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No commission found.</CommandEmpty>
                  <CommandGroup heading="Available Commissions">
                    <ScrollArea className="h-[300px]">
                      {availableCommissions.map(commission => (
                        <CommandItem
                          key={commission}
                          value={commission}
                          onSelect={() => {
                            onAdd(commission);
                            setOpen(false);
                            setSearchValue('');
                          }}
                          className="cursor-pointer"
                        >
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="flex-1 text-sm">{commission}</span>
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </CommandItem>
                      ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Watched Commissions List */}
          {watchedCommissions.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-border rounded-lg">
              <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No commissions watched</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add commissions to receive recommendations for relevant sessions.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {watchedCommissions.map(commission => (
                <div
                  key={commission}
                  className="flex items-center justify-between p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium text-foreground">{commission}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(commission)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-muted/30 border-muted">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>How it works:</strong> When you add a commission to your watchlist, 
                all sessions from that commission will be marked with a ⭐ and appear in the 
                "Recommended" filter.
              </p>
              <p>
                <strong>Video Resolution:</strong> For recommended sessions, you can click 
                "Resolve Video" to automatically find the corresponding YouTube stream from 
                the official Congress channel.
              </p>
              <p>
                <strong>Coming Soon:</strong> Agenda-based recommendations will match sessions 
                with your starred bills automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
