interface ThemeColors {
  primaryColor?: string;
  accentColor?: string;
  colorB1?: string;
  colorB2?: string;
  colorB3?: string;
  colorT1?: string;
  colorT2?: string;
}

interface ThemeSelectorProps {
  theme: string;
  setTheme: (theme: string) => void;
  themeColors: ThemeColors;
  updateThemeColor: (key: keyof ThemeColors, value: string) => void;
}

export default function ThemeSelector({ theme, setTheme, themeColors, updateThemeColor }: ThemeSelectorProps) {
  const themeOptions = [
    { value: 'dark', label: 'Dark (default)' },
    { value: 'light', label: 'Light' },
    { value: 'nitroDark', label: 'Nitro Dark' },
    { value: 'nitroLight', label: 'Nitro Light' },
    { value: 'custom', label: 'Custom' }
  ];

  const customColorKeys = [
    { key: 'colorB1' as const, default: '#111214' },
    { key: 'colorB2' as const, default: '#313338' },
    { key: 'colorB3' as const, default: '#505059' },
    { key: 'colorT1' as const, default: '#ffffff' },
    { key: 'colorT2' as const, default: '#d2d6d8' }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-discord-text-muted mb-3">
        Theme
      </label>
      <div className="space-y-2 mb-4">
        {themeOptions.map((themeOption) => (
          <div key={themeOption.value} className="flex items-center">
            <input
              type="radio"
              id={themeOption.value}
              name="theme"
              value={themeOption.value}
              checked={theme === themeOption.value}
              onChange={(e) => setTheme(e.target.value)}
              className="w-4 h-4 mr-3 accent-discord-primary"
            />
            <label htmlFor={themeOption.value} className="text-sm font-medium cursor-pointer">
              {themeOption.label}
            </label>
          </div>
        ))}
      </div>

      {/* Nitro Colors */}
      {(theme === 'nitroDark' || theme === 'nitroLight') && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-discord-text-muted mb-2">
            Nitro Colors
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeColors.primaryColor}
                onChange={(e) => updateThemeColor('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-discord-border cursor-pointer"
              />
              <input
                type="text"
                value={themeColors.primaryColor}
                onChange={(e) => updateThemeColor('primaryColor', e.target.value)}
                placeholder="#RRGGBB"
                className="flex-1 p-2 bg-discord-input-bg border border-discord-border rounded text-discord-text focus:border-discord-primary outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={themeColors.accentColor}
                onChange={(e) => updateThemeColor('accentColor', e.target.value)}
                className="w-12 h-10 rounded border border-discord-border cursor-pointer"
              />
              <input
                type="text"
                value={themeColors.accentColor}
                onChange={(e) => updateThemeColor('accentColor', e.target.value)}
                placeholder="#RRGGBB"
                className="flex-1 p-2 bg-discord-input-bg border border-discord-border rounded text-discord-text focus:border-discord-primary outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Colors */}
      {theme === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-discord-text-muted mb-2">
            Custom Colors
          </label>
          <div className="space-y-3">
            {customColorKeys.map(({ key, default: defaultValue }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={themeColors[key] || defaultValue}
                  onChange={(e) => updateThemeColor(key, e.target.value)}
                  className="w-12 h-10 rounded border border-discord-border cursor-pointer"
                />
                <input
                  type="text"
                  value={themeColors[key] || defaultValue}
                  onChange={(e) => updateThemeColor(key, e.target.value)}
                  placeholder="#RRGGBB"
                  className="flex-1 p-2 bg-discord-input-bg border border-discord-border rounded text-discord-text focus:border-discord-primary outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}