---
name: drawing-canvas
description: A Krea.ai-style drawing canvas component for WeWeb that allows users to upload images and draw on them with an intuitive interface
keywords: [drawing, canvas, image upload, painting, sketch, krea.ai, fabric.js]
---

# Drawing Canvas Component for WeWeb

A Krea.ai-style drawing canvas component for WeWeb that allows users to upload images and draw on them with an intuitive interface.

![Drawing Canvas Component](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Drawing_in_progress.jpg/450px-Drawing_in_progress.jpg)

## Features

- **Krea.ai-Style Interface**: Clean, modern UI with a pill-shaped toolbar and intuitive controls
- **Image Upload**: Upload images via drag-and-drop or file selection
- **Drawing Tools**: Customizable brush color and size with real-time preview
- **Touch Support**: Works on touch devices with proper event handling
- **Responsive Design**: Automatically adjusts to container size changes
- **Error Handling**: Comprehensive error handling and reporting
- **Modern Aesthetics**: Sleek dark toolbar with intuitive controls following Krea.ai design patterns

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `defaultBrushColor` | String | `#000000` | Default brush color in hexadecimal format |
| `defaultBrushSize` | Number | `5` | Default brush size in pixels (1-50) |

## Events

| Event Name | Payload | Description |
|------------|---------|-------------|
| `imageUploaded` | `{ success: true }` | Triggered when an image is successfully uploaded |
| `save` | `{ value: "data:image/png;base64,..." }` | Triggered when the Save button is clicked, containing the canvas as a data URL |
| `error` | `{ error: "Error message" }` | Triggered when an error occurs |

## Usage

1. Add the component to your WeWeb project
2. Configure the default brush color and size as needed
3. Connect event handlers for save, imageUploaded, and error events
4. Style the container to the desired size

```javascript
// Example event handler for the 'save' event
function handleSave(event) {
  const imageData = event.value;
  // Save the image data or send it to your server
}
```

## Styling

The component automatically adapts to its container size. For best results, set a minimum height and width on the container. The component will respect the constraints of its container while maintaining optimal usability.

```css
/* Example container styling */
.canvas-container {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
}
```

## Design Choices

This component was designed with the following principles in mind:

1. **Intuitive UX**: The Krea.ai-style interface is immediately familiar and easy to use with minimal instructions
2. **Visual Feedback**: All actions provide visual feedback to the user
3. **Responsive Design**: Works across different screen sizes and devices
4. **Error Resilience**: Handles errors gracefully and provides meaningful feedback
5. **Performance**: Optimized drawing experience with smooth lines
6. **Modern Aesthetics**: Clean, sleek design with attention to detail

## Local Development and Testing

For local development and testing:

1. Clone the repository
2. Open `index.html` in your browser to test the component
3. Make changes to the component in `src/wwElement.vue`
4. Refresh the test page to see your changes

```bash
# Install dependencies
npm install

# Run local development server
npm run serve
```

## License

MIT