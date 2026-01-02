# Tactical Retreat's Wallet Tagger

A Chrome extension that recognizes EVM wallet addresses on any webpage, displays user-defined tags for known addresses, and provides quick actions for interacting with those addresses across various blockchain tools.

## Features

- **Address Detection**: Automatically detects EVM addresses (0x...) on any webpage, including truncated formats
- **Custom Tags**: Load your own tags from CSV files to label wallet addresses
- **Visual Indicators**: Tagged addresses are highlighted with a green dashed border and your tag name
- **Hover Control Panel**: Hover over any address to see tags and quick action buttons
- **Quick Actions**: One-click links to Twitter search, Arkham, DeBank, Snowtrace, Snowscan, OpenSea, and Joepegs
- **Arkham Integration**: Import your private labels directly from Arkham
- **Site-Specific Enhancements**: Special handling for Arkham, Snowtrace, Snowscan, and Dexscreener

## Installation

### From Source

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `dist/` folder

### Adding Your Tags

Create CSV files in the `src/data/` directory with the format:
```csv
address,name
0x1234567890abcdef1234567890abcdef12345678,My Wallet
0xabcdefabcdefabcdefabcdefabcdefabcdefabcd,Friend's Wallet
```

Then rebuild the extension with `npm run build`.

You can also add CSV URLs in the extension's options page to load tags from remote sources.

## Development

### Prerequisites

- Node.js 18+
- npm
- Chrome browser

### Commands

```bash
npm install        # Install dependencies
npm run dev        # Build with watch mode
npm run build      # Production build
npm run package    # Create .zip for distribution
```

### Project Structure

```
src/
├── background/      # Service worker
├── content/         # Content script (injected into pages)
├── popup/           # Extension popup UI
├── options/         # Settings page
├── storage/         # Tag database and CSV parsing
├── types/           # TypeScript definitions
├── utils/           # Utility functions
├── icons/           # Extension and action icons
├── data/            # Your CSV tag files (git-ignored)
└── manifest.json    # Chrome extension manifest
```

### After Making Changes

1. If running `npm run dev`, the build auto-updates
2. Go to `chrome://extensions/` and click the refresh icon on the extension
3. Refresh the page you're testing on

### Debugging

- **Background Script**: Click "Service worker" on the extension card in `chrome://extensions/`
- **Content Script**: Open DevTools (F12) and look for `[WalletTagger]` messages in Console

## Importing from Arkham

1. Log into [Arkham Intelligence](https://intel.arkm.com)
2. Navigate to your [Labels page](https://intel.arkm.com/labels)
3. Click the "Import to Wallet Tagger" button that appears
4. Your private labels will be imported into the extension

## Adding Custom Action Buttons

Edit `src/types/index.ts` to add new action buttons:

```typescript
export const ACTION_LINKS: ActionLink[] = [
  // ... existing actions
  {
    name: 'New Service',
    iconFile: 'action-newservice.png',
    urlTemplate: 'https://newservice.com/address/{address}',
  },
];
```
