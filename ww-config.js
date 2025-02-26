export default {
    editor: {
        label: 'Drawing Canvas Uploader',
        icon: 'edit',
    },
    properties: {
        brushSize: {
            label: 'Brush size',
            type: 'Number',
            defaultValue: 5,
            bindable: true,
        },
        brushColor: {
            label: 'Brush color',
            type: 'Color',
            defaultValue: '#000000',
            bindable: true,
        },
        canvasHeight: {
            label: 'Canvas height',
            type: 'Length',
            defaultValue: '400px',
            bindable: true,
        },
        backgroundColor: {
            label: 'Background color',
            type: 'Color',
            defaultValue: '#FFFFFF',
            bindable: true,
        },
        saveFormat: {
            label: 'Save format',
            type: 'TextSelect',
            options: {
                options: [
                    { label: 'PNG', value: 'png' },
                    { label: 'JPEG', value: 'jpeg' },
                ],
            },
            defaultValue: 'png',
            bindable: true,
        }
    },
    triggerEvents: [
        { name: 'onDraw', label: 'On Draw', event: { data: {} } },
        { name: 'onChange', label: 'On Change', event: { data: {} } },
        { name: 'onSave', label: 'On Save', event: { data: {} } }
    ],
    actions: [
        { name: 'clear', label: 'Clear canvas' },
        { name: 'save', label: 'Save drawing' },
        { name: 'undo', label: 'Undo last action' }
    ]
};
