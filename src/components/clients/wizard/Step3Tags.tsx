import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, FolderPlus, Tag, Trash2 } from "lucide-react";
import { ClientProfile, TagCategory, SUGGESTED_AREA_TAGS } from "../types";

interface Step3Props {
  data: ClientProfile;
  onChange: (data: Partial<ClientProfile>) => void;
}

export function Step3Tags({ data, onChange }: Step3Props) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTags, setNewTags] = useState<Record<string, string>>({});

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: TagCategory = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      tags: []
    };
    
    onChange({ tagCategories: [...data.tagCategories, newCategory] });
    setNewCategoryName("");
  };

  const removeCategory = (categoryId: string) => {
    onChange({ tagCategories: data.tagCategories.filter(c => c.id !== categoryId) });
  };

  const addTagToCategory = (categoryId: string, tag?: string) => {
    const tagToAdd = tag || newTags[categoryId]?.trim();
    if (!tagToAdd) return;

    onChange({
      tagCategories: data.tagCategories.map(cat => 
        cat.id === categoryId && !cat.tags.includes(tagToAdd)
          ? { ...cat, tags: [...cat.tags, tagToAdd] }
          : cat
      )
    });
    
    if (!tag) {
      setNewTags(prev => ({ ...prev, [categoryId]: '' }));
    }
  };

  const removeTagFromCategory = (categoryId: string, tag: string) => {
    onChange({
      tagCategories: data.tagCategories.map(cat => 
        cat.id === categoryId
          ? { ...cat, tags: cat.tags.filter(t => t !== tag) }
          : cat
      )
    });
  };

  const addPresetCategory = (preset: { name: string; suggestedTags: string[] }) => {
    const newCategory: TagCategory = {
      id: crypto.randomUUID(),
      name: preset.name,
      tags: []
    };
    onChange({ tagCategories: [...data.tagCategories, newCategory] });
  };

  const hasAreasCategory = data.tagCategories.some(c => 
    c.name.toLowerCase().includes('área') || c.name.toLowerCase().includes('area')
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-1">Custom Tags</h2>
        <p className="text-sm text-muted-foreground">
          Create flexible tag categories to organize and filter alerts (e.g., Internal Areas, Topics of Interest)
        </p>
      </div>

      {/* Quick Add Presets */}
      {data.tagCategories.length === 0 && (
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
          <Label className="text-sm">Quick Start - Add a category:</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPresetCategory({ name: 'Áreas Internas', suggestedTags: SUGGESTED_AREA_TAGS })}
            >
              <Tag className="h-3 w-3 mr-1" /> Áreas Internas
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPresetCategory({ name: 'Temas de Interés', suggestedTags: [] })}
            >
              <Tag className="h-3 w-3 mr-1" /> Temas de Interés
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPresetCategory({ name: 'Productos', suggestedTags: [] })}
            >
              <Tag className="h-3 w-3 mr-1" /> Productos
            </Button>
          </div>
        </div>
      )}

      {/* Add New Category */}
      <div className="space-y-2">
        <Label>Add New Category</Label>
        <div className="flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name (e.g., Áreas Internas)"
            className="bg-background/50"
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
          />
          <Button type="button" onClick={addCategory} disabled={!newCategoryName.trim()}>
            <FolderPlus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Tag Categories */}
      {data.tagCategories.length > 0 && (
        <div className="space-y-4">
          {data.tagCategories.map((category) => (
            <div key={category.id} className="p-4 rounded-lg bg-background/30 border border-border/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <Label className="font-medium">{category.name}</Label>
                  <Badge variant="secondary" className="text-xs">
                    {category.tags.length} tags
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(category.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags in this category */}
              {category.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {category.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTagFromCategory(category.id, tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested tags for Areas category */}
              {category.name.toLowerCase().includes('área') && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Quick add:</Label>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_AREA_TAGS.filter(t => !category.tags.includes(t)).slice(0, 6).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer text-xs hover:bg-primary/20"
                        onClick={() => addTagToCategory(category.id, tag)}
                      >
                        <Plus className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Add tag input */}
              <div className="flex gap-2">
                <Input
                  value={newTags[category.id] || ''}
                  onChange={(e) => setNewTags(prev => ({ ...prev, [category.id]: e.target.value }))}
                  placeholder="Add tag..."
                  className="bg-background/50 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addTagToCategory(category.id)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addTagToCategory(category.id)}
                  disabled={!newTags[category.id]?.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.tagCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border/30 rounded-lg">
          <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No tag categories created yet.</p>
          <p className="text-sm mt-1">Add categories above or use Quick Start presets.</p>
        </div>
      )}
    </div>
  );
}
