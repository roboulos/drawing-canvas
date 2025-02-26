---
name: drawing-canvas-uploader
description: A canvas-based drawing component with image upload capabilities, allowing users to draw over uploaded images and save the result
keywords: [drawing, canvas, image upload, fabric.js, paint, sketch]
---

#### Drawing Canvas with Image Upload

Properties:
- `canvasWidth`: `string` - Width of the canvas. Default: `'100%'`
- `canvasHeight`: `string` - Height of the canvas. Default: `'400px'`
- `defaultBrushColor`: `string` - Initial brush color. Default: `'#000000'`
- `defaultBrushSize`: `number` - Initial brush size (1-50). Default: `5`

Events:
- `save`: Triggered when drawing is saved
  - payload: `{ value: string }` - Base64 PNG data
- `imageUploaded`: Triggered when image is uploaded
  - payload: `{ success: boolean }`
- `error`: Triggered on error
  - payload: `{ error: string }`

Special features:
- Drag and drop image upload
- Draw over uploaded images
- Adjustable brush size and color
- Clear drawing while keeping background
- Clear everything and start over
- Export as PNG in base64 format

To use with Xano:
1. Add the component to your page
2. Create a workflow triggered by the "On Save Drawing" event
3. Use WWAxios to POST the base64 image data to your Xano endpoint
4. Handle the response in your workflow

Example Xano workflow:
```javascript
// In your WeWeb workflow
const drawingData = trigger.event.value; // Base64 PNG
const response = await wwAxios.post('YOUR_XANO_ENDPOINT', {
  image: drawingData
});
```