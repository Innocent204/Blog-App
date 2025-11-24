import { SettingsPanel } from '@/components/SettingsPanel';

export default function EditorSettingsPage() {
  const handleSaveSettings = (settings: any) => {
    // TODO: Implement save settings logic
    console.log('Saving editor settings:', settings);
    // Add API call to save settings
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <SettingsPanel 
        userRole="editor" 
        onSave={handleSaveSettings} 
      />
    </div>
  );
}
