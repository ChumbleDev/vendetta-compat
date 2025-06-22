# VendettaCompat v2.0 - Multi-Layer Discord Compatibility Plugin

A comprehensive Enmity plugin that enables compatibility with multiple Discord modification frameworks: **Bunny**, **Vendetta**, and **Revenge**. Enhanced with performance optimizations and a modern UI.

## 🚀 Key Features

### Multi-Layer Support
- **Bunny**: Full support for Bunny plugins, themes, and features
- **Vendetta**: Complete Vendetta compatibility layer 
- **Revenge**: Comprehensive Revenge framework support
- **Independent Control**: Enable/disable each layer individually

### Performance Optimizations
- **Async Loading**: Non-blocking initialization prevents app freezing
- **Smart Caching**: 1-hour cache system reduces network requests
- **Parallel Loading**: Multiple layers load simultaneously
- **Timeout Protection**: 10-second timeout prevents hanging
- **Graceful Fallbacks**: Uses cached versions when networks fail

### Enhanced UI
- **Organized Sections**: Each compatibility layer has its own settings section
- **Real-time Status**: Shows version info and last loaded timestamps
- **Individual Controls**: Separate cache management for each layer
- **Custom URLs**: Support for development/custom servers per layer

## 📱 Installation

1. Download the plugin files
2. Place in your Enmity plugins directory
3. Enable the plugin in Enmity settings
4. Configure desired compatibility layers

## ⚙️ Configuration

### Per-Layer Settings
Each compatibility layer (Bunny, Vendetta, Revenge) includes:
- **Enable/Disable Toggle**: Turn each layer on/off independently
- **Custom URL Support**: Use development builds or custom servers
- **Version Information**: View currently loaded version and last update
- **Cache Management**: Clear cached data to force fresh downloads

### Global Settings
- **Clear All Data**: Reset all layers and settings
- **Force Reload**: Restart Discord with fresh compatibility layers
- **Bulk Operations**: Manage all layers simultaneously

## 🔧 Performance Improvements

### Before (v1.x)
- ❌ Blocked app startup with synchronous network requests
- ❌ No caching strategy - downloaded fresh code every launch
- ❌ Single compatibility layer support
- ❌ Prone to hanging on network issues

### After (v2.0)
- ✅ Asynchronous loading with non-blocking startup
- ✅ Smart 1-hour caching system
- ✅ Support for 3+ compatibility layers
- ✅ Timeout protection and graceful fallbacks
- ✅ Parallel processing for faster initialization

## 🛠️ Technical Details

### Caching Strategy
- **Cache Duration**: 1 hour per layer
- **Fallback Logic**: Uses cached version if network fails
- **Version Tracking**: Automatic version detection and storage
- **Manual Override**: Force refresh option available

### Loading Process
1. **Parallel Initialization**: All enabled layers start loading simultaneously
2. **Cache Check**: Determines if cached version is still valid
3. **Network Fetch**: Downloads fresh code with timeout protection
4. **Async Execution**: Runs compatibility layer code without blocking UI
5. **Status Update**: Shows success/failure states and version info

### Memory Management
- **Proper Unloading**: Cleanly removes compatibility layers on disable
- **Resource Cleanup**: Prevents memory leaks during layer switching
- **State Isolation**: Each layer maintains independent state

## 🔄 Migration from v1.x

Your existing Bunny configuration will be automatically migrated to the new system. The plugin remains backward compatible while adding new features.

### What's Preserved
- ✅ Existing Bunny settings and custom URLs
- ✅ Cached Bunny code and preferences
- ✅ Plugin enable/disable state

### What's New
- 🆕 Vendetta and Revenge layer support
- 🆕 Individual layer controls
- 🆕 Enhanced caching and performance
- 🆕 Modern UI with better organization

## 🐛 Troubleshooting

### Layer Won't Load
1. Check network connectivity
2. Verify custom URL if using development builds
3. Clear layer cache and retry
4. Check console for error messages

### Performance Issues
1. Disable unnecessary layers
2. Clear old cached data
3. Use official URLs instead of custom ones
4. Restart Discord after configuration changes

### UI Problems
1. Force reload Discord
2. Clear all plugin data
3. Reinstall plugin if issues persist

## 🤝 Contributing

This plugin is community-driven. Report issues, suggest features, or contribute code improvements.

### Authors
- **Rosie<3** - Original creator
- **SerStars** - Co-maintainer  
- **Enhanced by AI** - Performance optimizations and multi-layer support

## 📄 License

See LICENSE file for details.

---

**Version 2.0.0** - Enhanced with multi-layer support and performance optimizations

Plugin Link: https://raw.githubusercontent.com/SerStars/Vendetta-Compat/main/dist/VendettaCompat.js