# Drawing Canvas Uploader WeWeb Component

A WeWeb component that provides a drawing canvas with touch support and image export capabilities.

## Features

- Responsive drawing canvas
- Touch and mouse support
- Adjustable brush size and color
- Background color customization
- PNG/JPEG export
- Undo functionality
- Clear canvas option

## Properties

- `brushSize`: Number - Size of the drawing brush
- `brushColor`: Color - Color of the brush
- `canvasHeight`: Length - Height of the canvas
- `backgroundColor`: Color - Background color of the canvas
- `saveFormat`: Select - Image save format (PNG/JPEG)

## Events

- `onDraw`: Triggered during drawing operations
- `onChange`: Triggered when canvas content changes
- `onSave`: Triggered when drawing is saved

## Actions

- `clear()`: Clears the canvas
- `save()`: Saves the current drawing
- `undo()`: Removes the last drawing action

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run serve
```

3. Build for production:
```bash
npm run build
```

## Usage

1. Add the component to your WeWeb project
2. Configure the properties in the WeWeb editor
3. Use the component's events and actions to integrate with your application

## Development

This component follows WeWeb's component guidelines and best practices:
- Uses Vue 3 Composition API
- Implements proper touch/mouse event handling
- Handles window resize for canvas scaling
- Includes proper cleanup on component unmount
- Provides comprehensive error handling
- Supports different pixel ratios
