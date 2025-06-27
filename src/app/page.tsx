'use client';

import { useState, useEffect, useCallback } from 'react';

interface ThemeColors {
  primaryColor?: string;
  accentColor?: string;
  colorB1?: string;
  colorB2?: string;
  colorB3?: string;
  colorT1?: string;
  colorT2?: string;
}

export default function Home() {
  const [userId, setUserId] = useState('879917497959219250');
  const [enableAboutMe, setEnableAboutMe] = useState(false);
  const [aboutMe, setAboutMe] = useState('');
  const [hideDecoration, setHideDecoration] = useState(false);
  const [hideSpotify, setHideSpotify] = useState(false);
  const [overrideBanner, setOverrideBanner] = useState(false);
  const [bannerUrl, setBannerUrl] = useState('');
  const [theme, setTheme] = useState('dark');
  const [width, setWidth] = useState(512);
  const [animated, setAnimated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [markdownUrl, setMarkdownUrl] = useState('');
  const [rawUrl, setRawUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const [themeColors, setThemeColors] = useState<ThemeColors>({
    primaryColor: '#8180ff',
    accentColor: '#fe80c0',
    colorB1: '#111214',
    colorB2: '#313338',
    colorB3: '#505059',
    colorT1: '#ffffff',
    colorT2: '#d2d6d8'
  });

  const updateThemeColor = (key: keyof ThemeColors, value: string) => {
    setThemeColors(prev => ({ ...prev, [key]: value }));
  };

  const generatePreview = useCallback(async () => {
    const trimmedUserId = userId.trim();
    if (!trimmedUserId || isNaN(Number(trimmedUserId)) || !(trimmedUserId.length === 18 || trimmedUserId.length === 17)) {
      return;
    }

    setIsGenerating(true);

    try {
      // Build URL
      let url = `/api/user/${trimmedUserId}`;
      const params = new URLSearchParams();

      if (enableAboutMe && aboutMe) {
        params.append('aboutMe', aboutMe);
      }

      if (overrideBanner && bannerUrl) {
        params.append('banner', bannerUrl);
      }

      if (hideDecoration) {
        params.append('hideDecoration', 'true');
      }

      if (hideSpotify) {
        params.append('hideSpotify', 'true');
      }

      params.append('theme', theme);
      
      if (theme === 'nitroDark' || theme === 'nitroLight') {
        params.append('primaryColor', themeColors.primaryColor?.replace(/^#/, '') || '');
        params.append('accentColor', themeColors.accentColor?.replace(/^#/, '') || '');
      } else if (theme === 'custom') {
        params.append('colorB1', themeColors.colorB1?.replace(/^#/, '') || '');
        params.append('colorB2', themeColors.colorB2?.replace(/^#/, '') || '');
        params.append('colorB3', themeColors.colorB3?.replace(/^#/, '') || '');
        params.append('colorT1', themeColors.colorT1?.replace(/^#/, '') || '');
        params.append('colorT2', themeColors.colorT2?.replace(/^#/, '') || '');
      }

      if (width) {
        params.append('width', width.toString());
      }

      if (animated) {
        params.append('animate', 'true');
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      // Fetch username
      const usernameResponse = await fetch(`/api/username/${trimmedUserId}`);
      if (!usernameResponse.ok) throw new Error('Failed to fetch username');
      
      const usernameData = await usernameResponse.json();
      const username = usernameData.username;

      // Test image load
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });

      const fullUrl = window.location.origin + url;
      const markdown = `[![${username}'s Discord status](${fullUrl})](https://github.com/TetraTsunami/discord-github-preview)`;
      
      setPreviewUrl(url);
      setMarkdownUrl(markdown);
      setRawUrl(fullUrl);

    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate image. Please check the User ID and try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [userId, enableAboutMe, aboutMe, overrideBanner, bannerUrl, hideDecoration, hideSpotify, theme, themeColors, width, animated]);

  const copyToClipboard = async () => {
    if (!markdownUrl) return;
    
    try {
      await navigator.clipboard.writeText(markdownUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy URL');
    }
  };

  // Initialize preview on mount
  useEffect(() => {
    const initializePreview = async () => {
      try {
        const response = await fetch(`/api/username/${userId.trim()}`);
        const data = await response.json();
        const initialUrl = `/api/user/${userId.trim()}`;
        const fullUrl = window.location.origin + initialUrl;
        setPreviewUrl(initialUrl);
        setMarkdownUrl(`[![${data.username}'s Discord status](${fullUrl})](https://github.com/TetraTsunami/discord-github-preview)`);
        setRawUrl(fullUrl);
      } catch (error) {
        console.error('Error fetching initial username:', error);
        const initialUrl = `/api/user/${userId.trim()}`;
        const fullUrl = window.location.origin + initialUrl;
        setPreviewUrl(initialUrl);
        setMarkdownUrl(fullUrl);
        setRawUrl(fullUrl);
      }
    };

    initializePreview();
  }, []);

  // Auto-generate on changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generatePreview();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [generatePreview]);

  return (
    <div className="min-h-screen py-8 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-discord-primary mb-4 relative inline-block">
            Discord Profile Preview Generator
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-discord-primary rounded-full mt-2"></div>
          </h1>
          <p className="text-discord-text-muted text-lg mb-5">
            Generate a preview of your Discord profile for use on GitHub or other platforms.
          </p>
          <div className="bg-red-600 text-black p-4 rounded-lg mb-5 max-w-2xl mx-auto">
            ⚠️ Before starting,{' '}
            <a 
              href="https://discord.gg/W59fcbydeG" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-900 underline font-medium"
            >
              join the Discord server
            </a>
            {' '}so the bot can access your profile information.
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls Column */}
          <div className="flex-1 min-w-0 lg:min-w-96 bg-discord-bg-secondary p-6 rounded-lg border border-discord-border shadow-lg">
            {/* User ID Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-discord-text-muted mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Discord User ID"
                className="w-full p-3 bg-discord-input-bg border border-discord-border rounded-lg text-discord-text focus:border-discord-primary focus:ring-2 focus:ring-discord-primary/20 outline-none transition-colors"
              />
            </div>

            {/* About Me Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="enableAboutMe"
                  checked={enableAboutMe}
                  onChange={(e) => setEnableAboutMe(e.target.checked)}
                  className="w-4 h-4 mr-3 accent-discord-primary"
                />
                <label htmlFor="enableAboutMe" className="text-sm font-medium cursor-pointer">
                  Enable About Me
                </label>
              </div>
              <label className="block text-sm font-semibold text-discord-text-muted mb-2">
                About Me
              </label>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                disabled={!enableAboutMe}
                placeholder="About me content..."
                className="w-full p-3 bg-discord-input-bg border border-discord-border rounded-lg text-discord-text focus:border-discord-primary focus:ring-2 focus:ring-discord-primary/20 outline-none transition-colors resize-vertical min-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Options Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="hideDecoration"
                  checked={hideDecoration}
                  onChange={(e) => setHideDecoration(e.target.checked)}
                  className="w-4 h-4 mr-3 accent-discord-primary"
                />
                <label htmlFor="hideDecoration" className="text-sm font-medium cursor-pointer">
                  Hide Avatar Decoration
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="hideSpotify"
                  checked={hideSpotify}
                  onChange={(e) => setHideSpotify(e.target.checked)}
                  className="w-4 h-4 mr-3 accent-discord-primary"
                />
                <label htmlFor="hideSpotify" className="text-sm font-medium cursor-pointer">
                  Hide Spotify Activity
                </label>
              </div>
            </div>

            {/* Theme Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-discord-text-muted mb-3">
                Theme
              </label>
              <div className="space-y-2 mb-4">
                {[
                  { value: 'dark', label: 'Dark (default)' },
                  { value: 'light', label: 'Light' },
                  { value: 'nitroDark', label: 'Nitro Dark' },
                  { value: 'nitroLight', label: 'Nitro Light' },
                  { value: 'custom', label: 'Custom' }
                ].map((themeOption) => (
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
                    {Object.entries({
                      colorB1: '#111214',
                      colorB2: '#313338',
                      colorB3: '#505059',
                      colorT1: '#ffffff',
                      colorT2: '#d2d6d8'
                    }).map(([key, defaultValue]) => (
                      <div key={key} className="flex items-center gap-3">
                        <input
                          type="color"
                          value={themeColors[key as keyof ThemeColors] || defaultValue}
                          onChange={(e) => updateThemeColor(key as keyof ThemeColors, e.target.value)}
                          className="w-12 h-10 rounded border border-discord-border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={themeColors[key as keyof ThemeColors] || defaultValue}
                          onChange={(e) => updateThemeColor(key as keyof ThemeColors, e.target.value)}
                          placeholder="#RRGGBB"
                          className="flex-1 p-2 bg-discord-input-bg border border-discord-border rounded text-discord-text focus:border-discord-primary outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Image Options Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-discord-text-muted mb-3">
                Image Options
              </label>
              <div className="mb-4">
                <label className="block text-sm font-medium text-discord-text-muted mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min="128"
                  max="2048"
                  step="1"
                  placeholder="Width in pixels"
                  className="w-full p-3 bg-discord-input-bg border border-discord-border rounded-lg text-discord-text focus:border-discord-primary outline-none"
                />
              </div>
              <div className="flex items-start mb-3">
                <input
                  type="checkbox"
                  id="animated"
                  checked={animated}
                  onChange={(e) => setAnimated(e.target.checked)}
                  className="w-4 h-4 mr-3 mt-1 accent-discord-primary"
                />
                <label htmlFor="animated" className="text-sm font-medium cursor-pointer">
                  Animated (avatar/banner/decoration)
                  <span className="block text-xs text-discord-text-muted mt-1">
                    Note: GitHub will not display animated images. This significantly increases the filesize of the image.
                  </span>
                </label>
              </div>
              <div className="flex items-center mb-3">
                <input
                  type="checkbox"
                  id="overrideBanner"
                  checked={overrideBanner}
                  onChange={(e) => setOverrideBanner(e.target.checked)}
                  className="w-4 h-4 mr-3 accent-discord-primary"
                />
                <label htmlFor="overrideBanner" className="text-sm font-medium cursor-pointer">
                  Override Banner
                </label>
              </div>
              <label className="block text-sm font-semibold text-discord-text-muted mb-2">
                Banner URL
              </label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                disabled={!overrideBanner}
                placeholder="https://example.com/banner.png"
                className="w-full p-3 bg-discord-input-bg border border-discord-border rounded-lg text-discord-text focus:border-discord-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              onClick={generatePreview}
              disabled={isGenerating}
              className="w-full bg-discord-primary hover:bg-discord-primary-hover text-white font-semibold py-3 px-4 rounded-lg transition-colors active:translate-y-px disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Preview'}
            </button>
          </div>

          {/* Preview Column */}
          <div className="flex-1 min-w-0 lg:min-w-96 bg-[var(--discord-bg-secondary)] p-6 rounded-lg border border-discord-border shadow-lg">
            {/* Preview Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-discord-text-muted mb-3">
                Preview
              </label>
              <div className="bg-discord-bg-tertiary p-5 rounded-lg border border-discord-border overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Discord Profile Preview"
                    className={`max-w-full h-auto rounded shadow-lg transition-all duration-300 hover:scale-105 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 text-discord-text-muted">
                    Loading preview...
                  </div>
                )}
              </div>
            </div>

            {/* Markdown URL Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-discord-text-muted mb-2">
                Markdown URL (for GitHub)
              </label>
              <div className="bg-discord-input-bg p-4 rounded-lg border border-discord-border font-mono text-sm text-discord-text-muted break-all">
                {markdownUrl}
              </div>
            </div>

            {/* Raw URL Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-discord-text-muted mb-2">
                Raw URL
              </label>
              <div className="bg-discord-input-bg p-4 rounded-lg border border-discord-border font-mono text-sm text-discord-text-muted break-all">
                {rawUrl}
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors active:translate-y-px ${
                copySuccess 
                  ? 'bg-discord-success text-white' 
                  : 'bg-discord-primary hover:bg-discord-primary-hover text-white'
              }`}
            >
              {copySuccess ? 'Copied!' : 'Copy Markdown URL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}