import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Settings, User, Palette, Bell, Lock, Save } from 'lucide-react';

interface SettingsPanelProps {
  userRole: 'admin' | 'editor';
  onSave?: (settings: any) => void;
}

export function SettingsPanel({ userRole, onSave }: SettingsPanelProps) {
  const [settings, setSettings] = React.useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
    },
    preferences: {
      theme: 'system',
      notifications: true,
      emailNotifications: true,
    },
    // Admin only settings
    blogSettings: userRole === 'admin' ? {
      blogTitle: 'My Awesome Blog',
      blogDescription: 'A blog about interesting things',
      postsPerPage: 10,
      allowComments: true,
    } : null,
  });

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(settings);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={settings.profile.name}
                onChange={(e) => handleChange('profile', 'name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.profile.email}
                onChange={(e) => handleChange('profile', 'email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <span>Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <Select 
                value={settings.preferences.theme} 
                onValueChange={(value) => handleChange('preferences', 'theme', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable in-app notifications</p>
              </div>
              <Switch
                checked={settings.preferences.notifications}
                onCheckedChange={(checked) => handleChange('preferences', 'notifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications</p>
              </div>
              <Switch
                checked={settings.preferences.emailNotifications}
                onCheckedChange={(checked) => handleChange('preferences', 'emailNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Blog Settings (Admin only) */}
        {userRole === 'admin' && settings.blogSettings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span>Blog Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blogTitle">Blog Title</Label>
                <Input
                  id="blogTitle"
                  value={settings.blogSettings.blogTitle}
                  onChange={(e) => handleChange('blogSettings', 'blogTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogDescription">Blog Description</Label>
                <Input
                  id="blogDescription"
                  value={settings.blogSettings.blogDescription}
                  onChange={(e) => handleChange('blogSettings', 'blogDescription', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Posts Per Page</Label>
                  <p className="text-sm text-muted-foreground">Number of posts to show per page</p>
                </div>
                <Input
                  type="number"
                  className="w-20"
                  min="1"
                  max="50"
                  value={settings.blogSettings.postsPerPage}
                  onChange={(e) => handleChange('blogSettings', 'postsPerPage', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Comments</Label>
                  <p className="text-sm text-muted-foreground">Allow readers to comment on posts</p>
                </div>
                <Switch
                  checked={settings.blogSettings.allowComments}
                  onCheckedChange={(checked) => handleChange('blogSettings', 'allowComments', checked)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
