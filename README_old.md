# STnametracker - Name Tracker Extension for SillyTavern

A SillyTavern extension that tracks and displays character names mentioned in your chat conversations.

## Features

- **Automatic Name Detection**: Scans chat messages to identify and track character names
- **Name Frequency Tracking**: Shows how many times each name has been mentioned
- **Auto-refresh Option**: Automatically updates the tracked names list when new messages arrive
- **Manual Controls**: Refresh or clear the tracked names list at any time
- **Persistent Settings**: Your preferences are saved between sessions

## Installation

### Using SillyTavern's Extension Installer (Recommended)

1. Open SillyTavern
2. Go to Extensions > Install Extension
3. Enter the repository URL: `https://github.com/ATreemanDork/STnametracker`
4. Click Install

### Manual Installation

1. Navigate to your SillyTavern installation folder
2. Go to `public/scripts/extensions/third-party/`
3. Clone this repository: `git clone https://github.com/ATreemanDork/STnametracker`
4. Restart SillyTavern

## Usage

1. After installation, find the "Name Tracker" panel in the Extensions settings
2. Enable name tracking using the checkbox
3. The extension will automatically scan your chat messages for names
4. Use the "Refresh Names" button to manually update the list
5. Use "Clear Tracked Names" to reset the tracking data

## Configuration Options

| Option | Description |
|--------|-------------|
| Enable Name Tracking | Turn the name tracking feature on or off |
| Auto-refresh on new messages | Automatically update the names list when new messages are sent/received |

## Prerequisites

- SillyTavern version 1.10.0 or higher

## How It Works

The extension uses pattern matching to identify potential names in chat messages. It looks for capitalized words that follow common naming conventions while filtering out common English words that are typically capitalized at the start of sentences.

## Support and Contributions

- **Issues**: Please report bugs or feature requests on the [GitHub Issues](https://github.com/ATreemanDork/STnametracker/issues) page
- **Contributions**: Pull requests are welcome! Please ensure your code follows the existing style

## License

This project is open source. Feel free to use, modify, and distribute according to the license terms.