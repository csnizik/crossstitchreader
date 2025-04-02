# Browser vs Native App: Architecture Decision Notes

## What We're Building

We're building an **interactive, graphical, stateful application** with:

- Precise click/touch handling
- Tools for select, measure, zoom, mark, navigate
- Support for multiple stitching workflows (English, Danish, Parking, Cross Country, etc.)
- A rich canvas-based UI
- Hobbyists as the target users, with workflows similar to graphic design tools

## Option 1: Browser-Based SPA (Single Page Application)

### ✅ Pros

- **Instant access**: No install required, great for casual users
- **Fast updates**: One deployment, no app store reviews
- **Cross-platform**: Runs on Mac, Windows, iOS, Android via browser
- **PWA support**: Can be "installed" on mobile and work offline
- **Lower development cost**: Single codebase

### ❌ Cons

- **Performance**: Limited by browser environment, especially with large canvases and gestures
- **Offline support**: Requires explicit setup with service workers
- **File system access**: Limited to File Picker APIs
- **Touch gesture support**: Difficult to perfect on mobile Safari and Android

## Option 2: Native Desktop/Mobile App

### ✅ Pros

- **High performance**: Leverages GPU, memory, and threading
- **OS integration**: Real file dialogs, auto-save, local file system, better printing
- **Mobile UX**: Native gestures, haptics, system integrations

### ❌ Cons

- **Multiple codebases**: Or require Electron/Flutter/React Native expertise
- **Slower iteration**: Build pipelines, store reviews

## Hybrid Option: Electron/Tauri + PWA

- Use **React** for core app logic
- **Tauri** for desktop (smaller and faster than Electron)
- **PWA** for browser/mobile

### Benefits:

- Desktop app for power users
- Web app for accessibility and ease
- Still a single codebase (React)

## Recommendation

> **Start browser-based.**

Build the MVP as a SPA. If performance or offline/UX needs grow:

- Wrap with Tauri for desktop experience
- Explore React Native for a native mobile app

We're already using tech (React + Zustand + Vitest + canvas) that ports well in either direction.

## Future Tickets to Consider

- [ ] Explore PWA support
- [ ] Research Tauri integration
- [ ] Define performance thresholds that would trigger native migration
