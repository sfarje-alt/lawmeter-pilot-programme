import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Tags, FileText, Bell, Plus, X, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { toast } from 'sonner';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Radio Regulations': 'RF/wireless device compliance (FCC, CE RED, etc.)',
  'Product Safety': 'Consumer protection and safety standards',
  'Cybersecurity': 'IoT security and data protection requirements',
  'Battery Regulations': 'Power storage and energy regulations',
  'Food Contact Material': 'FDA/EU food-safe materials compliance'
};

const SUGGESTED_KEYWORDS_BY_INDUSTRY: Record<string, string[]> = {
  'kitchen': ['cooking', 'temperature', 'food safety', 'heating element', 'thermostat'],
  'electronics': ['circuit', 'PCB', 'semiconductor', 'voltage regulator', 'power supply'],
  'IoT': ['firmware', 'OTA updates', 'cloud connectivity', 'API', 'encryption']
};

export default function Settings() {
  const navigate = useNavigate();
  const { profile, updateProfile, resetToDefaults, defaultCategories, defaultKeywords, defaultJurisdictions } = useBusinessProfile();
  
  const [newProductType, setNewProductType] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState('daily');
  const [riskThreshold, setRiskThreshold] = useState('medium');

  const handleAddProductType = () => {
    if (newProductType.trim() && !profile.productTypes.includes(newProductType.trim())) {
      updateProfile({ productTypes: [...profile.productTypes, newProductType.trim()] });
      setNewProductType('');
    }
  };

  const handleRemoveProductType = (type: string) => {
    updateProfile({ productTypes: profile.productTypes.filter(t => t !== type) });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !profile.portfolioKeywords.includes(newKeyword.trim().toLowerCase())) {
      updateProfile({ portfolioKeywords: [...profile.portfolioKeywords, newKeyword.trim().toLowerCase()] });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    updateProfile({ portfolioKeywords: profile.portfolioKeywords.filter(k => k !== keyword) });
  };

  const handleToggleCategory = (category: string) => {
    if (profile.regulatoryCategories.includes(category)) {
      updateProfile({ regulatoryCategories: profile.regulatoryCategories.filter(c => c !== category) });
    } else {
      updateProfile({ regulatoryCategories: [...profile.regulatoryCategories, category] });
    }
  };

  const handleAddCustomCategory = () => {
    if (newCategory.trim() && !profile.regulatoryCategories.includes(newCategory.trim())) {
      updateProfile({ regulatoryCategories: [...profile.regulatoryCategories, newCategory.trim()] });
      setNewCategory('');
    }
  };

  const handleToggleJurisdiction = (jurisdiction: string) => {
    if (profile.monitoredJurisdictions.includes(jurisdiction)) {
      updateProfile({ monitoredJurisdictions: profile.monitoredJurisdictions.filter(j => j !== jurisdiction) });
    } else {
      updateProfile({ monitoredJurisdictions: [...profile.monitoredJurisdictions, jurisdiction] });
    }
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    resetToDefaults();
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure your business profile and alert preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Business Profile</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">Keywords</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>
                  Define your company information to personalize legislation monitoring and risk assessments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={profile.companyName}
                    onChange={(e) => updateProfile({ companyName: e.target.value })}
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry Description</Label>
                  <Textarea
                    id="industry"
                    value={profile.industryDescription}
                    onChange={(e) => updateProfile({ industryDescription: e.target.value })}
                    placeholder="Describe your industry and business focus"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Types</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.productTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        {type}
                        <button onClick={() => handleRemoveProductType(type)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newProductType}
                      onChange={(e) => setNewProductType(e.target.value)}
                      placeholder="Add product type"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddProductType()}
                    />
                    <Button onClick={handleAddProductType} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Monitored Jurisdictions</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {defaultJurisdictions.map((jurisdiction) => (
                      <div key={jurisdiction} className="flex items-center space-x-2">
                        <Checkbox
                          id={`jurisdiction-${jurisdiction}`}
                          checked={profile.monitoredJurisdictions.includes(jurisdiction)}
                          onCheckedChange={() => handleToggleJurisdiction(jurisdiction)}
                        />
                        <Label htmlFor={`jurisdiction-${jurisdiction}`} className="text-sm cursor-pointer">
                          {jurisdiction}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Categories</CardTitle>
                <CardDescription>
                  Select the regulatory areas relevant to your business for targeted monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {defaultCategories.map((category) => (
                    <div
                      key={category}
                      className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                        profile.regulatoryCategories.includes(category)
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <Checkbox
                        id={`category-${category}`}
                        checked={profile.regulatoryCategories.includes(category)}
                        onCheckedChange={() => handleToggleCategory(category)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`category-${category}`} className="font-medium cursor-pointer">
                          {category}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {CATEGORY_DESCRIPTIONS[category] || 'Custom regulatory category'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-2 block">Add Custom Category</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter custom category name"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCustomCategory()}
                    />
                    <Button onClick={handleAddCustomCategory}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Keywords Tab */}
          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Keywords</CardTitle>
                <CardDescription>
                  Define keywords to identify relevant legislation and track regulatory trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Active Keywords ({profile.portfolioKeywords.length})</Label>
                  <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg min-h-[120px] max-h-[300px] overflow-y-auto">
                    {profile.portfolioKeywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                        {keyword}
                        <button onClick={() => handleRemoveKeyword(keyword)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add new keyword"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <Button onClick={handleAddKeyword}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Suggested Keywords</Label>
                  <div className="space-y-3">
                    {Object.entries(SUGGESTED_KEYWORDS_BY_INDUSTRY).map(([industry, keywords]) => (
                      <div key={industry}>
                        <p className="text-sm text-muted-foreground mb-2 capitalize">{industry}</p>
                        <div className="flex flex-wrap gap-2">
                          {keywords
                            .filter((k) => !profile.portfolioKeywords.includes(k))
                            .map((keyword) => (
                              <Badge
                                key={keyword}
                                variant="secondary"
                                className="cursor-pointer hover:bg-primary/20"
                                onClick={() => updateProfile({ portfolioKeywords: [...profile.portfolioKeywords, keyword] })}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                {keyword}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => updateProfile({ portfolioKeywords: defaultKeywords })}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alert Preferences Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications about regulatory changes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="space-y-2">
                  <Label>Alert Frequency</Label>
                  <Select value={alertFrequency} onValueChange={setAlertFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Risk Threshold</Label>
                  <Select value={riskThreshold} onValueChange={setRiskThreshold}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low and above</SelectItem>
                      <SelectItem value="medium">Medium and above</SelectItem>
                      <SelectItem value="high">High and above</SelectItem>
                      <SelectItem value="critical">Critical only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Only receive alerts for legislation meeting this risk level
                  </p>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Jurisdiction-Specific Alerts</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {profile.monitoredJurisdictions.map((jurisdiction) => (
                      <div key={jurisdiction} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <span className="text-sm">{jurisdiction}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6 pt-6 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset All to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
