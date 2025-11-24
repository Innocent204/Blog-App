import { SettingsPanel } from '@/components/SettingsPanel';

export default function AdminSettingsPage() {
  const handleSaveSettings = (settings: any) => {
    // TODO: Implement save settings logic
    console.log('Saving admin settings:', settings);
    // Add API call to save settings
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <SettingsPanel 
        userRole="admin" 
        onSave={handleSaveSettings} 
      />
    </div>
  );
}
