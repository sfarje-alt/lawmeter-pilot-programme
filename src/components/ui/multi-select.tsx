import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface MultiSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  maxDisplay?: number;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Seleccionar...",
  emptyText = "Sin resultados.",
  className,
  maxDisplay = 2,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== value));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectedLabels = selected.map(
    (value) => options.find((opt) => opt.value === value)?.label || value
  );

  const displayText = () => {
    if (selected.length === 0) {
      return <span className="text-muted-foreground">{placeholder}</span>;
    }
    if (selected.length <= maxDisplay) {
      return (
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="h-5 px-1.5 text-xs flex items-center gap-1"
              >
                {option?.icon}
                <span className="max-w-[80px] truncate">{option?.label || value}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(value, e)}
                  className="ml-0.5 hover:bg-muted rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
          {selected.length} seleccionados
        </Badge>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 justify-between bg-muted/30 border-border/50 text-sm font-normal",
            selected.length > 0 && "border-primary/50",
            className
          )}
        >
          <div className="flex-1 text-left overflow-hidden">
            {displayText()}
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0 z-50" align="start">
        <Command>
          <CommandInput placeholder="Buscar..." className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
