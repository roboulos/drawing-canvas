---
name: drawing-canvas
description: A stable canvas-based drawing component with krea.ai-like image editing functionality, allowing users to draw over uploaded images and save the result
keywords: [drawing, canvas, image upload, painting, sketch, krea.ai, fabric.js]
---

# Drawing Canvas Component for WeWeb

A professional drawing canvas that allows users to upload images and paint over them, similar to the krea.ai interface. The component is designed to be stable, responsive and easy to use in both WeWeb editor and published sites.

## Features

- **Stable Drawing Experience:** Smooth drawing with optimized brush settings
- **Image Upload and Manipulation:** Upload images via drag & drop or file picker
- **Responsive Canvas:** Adapts to container size with proper scaling
- **Mobile-Friendly:** Supports touch interactions for mobile devices
- **Enhanced UI Controls:** Intuitive controls for brush size and color
- **Real-Time Preview:** Live brush size preview
- **Error Handling:** Comprehensive error catching and reporting
- **Event Triggers:** Well-defined events for integration with workflows
- **WeWeb Integration:** Follows WeWeb component best practices

## Properties

- `canvasWidth`: `string` - Width of the canvas. Default: `'100%'`
- `canvasHeight`: `string` - Height of the canvas. Default: `'400px'`
- `defaultBrushColor`: `string` - Initial brush color. Default: `'#000000'`
- `defaultBrushSize`: `number` - Initial brush size (1-50). Default: `5`

## Events

- `save`: Triggered when drawing is saved
  - payload: `{ value: string }` - Base64 PNG data
- `imageUploaded`: Triggered when image is uploaded
  - payload: `{ success: boolean, imageWidth: number, imageHeight: number }`
- `error`: Triggered on error
  - payload: `{ error: string, details: string }`

## Usage

### Basic Implementation

1. Add the component to your WeWeb page
2. Configure the canvas dimensions as needed
3. Set default brush color and size
4. Create workflows to handle save events

### Integration with Backend

To save drawings to your backend:

```javascript
// In your WeWeb workflow triggered by 'On Save Drawing'
const drawingData = trigger.event.value; // Base64 PNG
const response = await wwAxios.post('YOUR_API_ENDPOINT', {
  image: drawingData
});
```

### Example with Xano

```javascript
// In your WeWeb workflow
const drawingData = trigger.event.value; // Base64 PNG
const response = await wwAxios.post('YOUR_XANO_ENDPOINT', {
  image: drawingData
});

// Process the response
if (response.status === 200) {
  // Handle success
} else {
  // Handle error
}
```

## Tips for Best Performance

- Set appropriate canvas dimensions for your use case
- For mobile, consider using percentage width and fixed height
- When handling large images, monitor memory usage
- Create clear UI instructions for users on how to interact with the canvas