<template>
  <div class="drawing-canvas-container" ref="containerRef">
    <canvas 
      ref="canvasRef"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="handleTouch($event, startDrawing)"
      @touchmove="handleTouch($event, draw)"
      @touchend="stopDrawing"
    ></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

export default {
  props: {
    content: { type: Object, default: () => ({}) },
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {
    // State management
    const { value: state, setValue: setState } = (typeof wwLib !== 'undefined' 
      ? wwLib.wwVariable.useComponentVariable()
      : { value: {}, setValue: () => {} });

    const containerRef = ref(null);
    const canvasRef = ref(null);
    const isDrawing = ref(false);
    const ctx = ref(null);
    const drawHistory = ref([]);
    const currentPath = ref([]);

    // Drawing state
    const lastX = ref(0);
    const lastY = ref(0);

    const initCanvas = () => {
      const canvas = canvasRef.value;
      const container = containerRef.value;
      if (!canvas || !container) return;

      // Set canvas size based on container
      canvas.width = container.offsetWidth;
      canvas.height = parseInt(props.content?.canvasHeight || '400');

      // Get context and set initial styles
      ctx.value = canvas.getContext('2d');
      if (ctx.value) {
        ctx.value.fillStyle = props.content?.backgroundColor || '#FFFFFF';
        ctx.value.fillRect(0, 0, canvas.width, canvas.height);
        ctx.value.strokeStyle = props.content?.brushColor || '#000000';
        ctx.value.lineWidth = props.content?.brushSize || 5;
        ctx.value.lineCap = 'round';
        ctx.value.lineJoin = 'round';
      }
    };

    const startDrawing = (event) => {
      isDrawing.value = true;
      const { x, y } = getCoordinates(event);
      lastX.value = x;
      lastY.value = y;
      currentPath.value = [[x, y]];
      emit('trigger-event', { name: 'onDraw', event: { started: true } });
    };

    const draw = (event) => {
      if (!isDrawing.value) return;
      const { x, y } = getCoordinates(event);
      
      ctx.value.beginPath();
      ctx.value.moveTo(lastX.value, lastY.value);
      ctx.value.lineTo(x, y);
      ctx.value.stroke();

      currentPath.value.push([x, y]);
      lastX.value = x;
      lastY.value = y;

      emit('trigger-event', { name: 'onDraw', event: { drawing: true } });
    };

    const stopDrawing = () => {
      if (!isDrawing.value) return;
      isDrawing.value = false;
      if (currentPath.value.length > 1) {
        drawHistory.value.push([...currentPath.value]);
        currentPath.value = [];
      }
      emit('trigger-event', { name: 'onDraw', event: { finished: true } });
      emit('trigger-event', { name: 'onChange', event: { historyLength: drawHistory.value.length } });
    };

    const getCoordinates = (event) => {
      const canvas = canvasRef.value;
      const rect = canvas.getBoundingClientRect();
      let x, y;

      if (event.touches) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      return { x, y };
    };

    const handleTouch = (event, handler) => {
      event.preventDefault();
      handler(event);
    };

    const clear = () => {
      if (!ctx.value) return;
      ctx.value.fillStyle = props.content?.backgroundColor || '#FFFFFF';
      ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      drawHistory.value = [];
      emit('trigger-event', { name: 'onChange', event: { cleared: true } });
    };

    const undo = () => {
      if (!ctx.value || drawHistory.value.length === 0) return;
      
      drawHistory.value.pop();
      clear();
      
      // Redraw remaining paths
      drawHistory.value.forEach(path => {
        ctx.value.beginPath();
        ctx.value.moveTo(path[0][0], path[0][1]);
        path.forEach(([x, y]) => {
          ctx.value.lineTo(x, y);
        });
        ctx.value.stroke();
      });

      emit('trigger-event', { name: 'onChange', event: { historyLength: drawHistory.value.length } });
    };

    const save = () => {
      if (!canvasRef.value) return;
      try {
        const format = props.content?.saveFormat || 'png';
        const dataUrl = canvasRef.value.toDataURL(`image/${format}`);
        emit('trigger-event', { name: 'onSave', event: { dataUrl } });
      } catch (error) {
        console.error('Failed to save canvas:', error);
        emit('trigger-event', { name: 'error', event: { message: error.message } });
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      initCanvas();
      window.addEventListener('resize', initCanvas);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', initCanvas);
    });

    // Watch for property changes
    watch(() => props.content?.brushColor, (newColor) => {
      if (ctx.value && newColor) {
        ctx.value.strokeStyle = newColor;
      }
    });

    watch(() => props.content?.brushSize, (newSize) => {
      if (ctx.value && newSize) {
        ctx.value.lineWidth = newSize;
      }
    });

    watch(() => props.content?.backgroundColor, (newColor) => {
      if (ctx.value && newColor) {
        const imageData = ctx.value.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height);
        ctx.value.fillStyle = newColor;
        ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        ctx.value.putImageData(imageData, 0, 0);
      }
    });

    // Expose actions
    if (typeof wwLib !== 'undefined') {
      wwLib.wwVariable.useComponentActions({
        clear,
        save,
        undo,
      });
    }

    return {
      containerRef,
      canvasRef,
      startDrawing,
      draw,
      stopDrawing,
      handleTouch,
    };
  },
};
</script>

<style scoped>
.drawing-canvas-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: crosshair;
}</style>
