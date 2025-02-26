export default {
    name: 'drawing-canvas',
    editor: {
      label: {
        en: 'Drawing Canvas',
      },
      icon: 'pencil',
    },
    properties: {
      canvasWidth: {
        label: { en: 'Canvas Width' },
        type: 'Length',
        options: {
          unitChoices: [
            { value: 'px', label: 'px', min: 100, max: 2000 },
            { value: '%', label: '%', min: 10, max: 100 }
          ]
        },
        defaultValue: '100%',
        bindable: true,
        section: 'settings',
        /* wwEditor:start */
        bindingValidation: {
          type: 'string',
          tooltip: 'A valid CSS length value (px or %)',
        },
        propertyHelp: {
          tooltip: 'Set the width of the drawing canvas',
        },
        /* wwEditor:end */
      },
      canvasHeight: {
        label: { en: 'Canvas Height' },
        type: 'Length',
        options: {
          unitChoices: [
            { value: 'px', label: 'px', min: 100, max: 2000 },
            { value: '%', label: '%', min: 10, max: 100 }
          ]
        },
        defaultValue: '400px',
        bindable: true,
        section: 'settings',
        /* wwEditor:start */
        bindingValidation: {
          type: 'string',
          tooltip: 'A valid CSS length value (px or %)',
        },
        propertyHelp: {
          tooltip: 'Set the height of the drawing canvas',
        },
        /* wwEditor:end */
      },
      defaultBrushColor: {
        label: { en: 'Default Brush Color' },
        type: 'Color',
        defaultValue: '#000000',
        bindable: true,
        section: 'settings',
        /* wwEditor:start */
        bindingValidation: {
          type: 'string',
          tooltip: 'A valid color value',
        },
        propertyHelp: {
          tooltip: 'Set the default color for the drawing brush',
        },
        /* wwEditor:end */
      },
      defaultBrushSize: {
        label: { en: 'Default Brush Size' },
        type: 'Number',
        defaultValue: 5,
        bindable: true,
        section: 'settings',
        options: {
          min: 1,
          max: 50,
          step: 1
        },
        /* wwEditor:start */
        bindingValidation: {
          type: 'number',
          tooltip: 'A number between 1 and 50',
        },
        propertyHelp: {
          tooltip: 'Set the default size of the drawing brush',
        },
        /* wwEditor:end */
      }
    },
    triggerEvents: [
      {
        name: 'save',
        label: { en: 'On Save Drawing' },
        event: { value: '' },
        description: 'Triggered when the drawing is saved. Returns base64 PNG data.'
      },
      {
        name: 'imageUploaded',
        label: { en: 'On Image Upload' },
        event: { success: true },
        description: 'Triggered when an image is successfully uploaded to the canvas'
      },
      {
        name: 'error',
        label: { en: 'On Error' },
        event: { error: '' },
        description: 'Triggered when an error occurs'
      }
    ]
  };