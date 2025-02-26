<template>
  <div class="drawing-canvas-container" ref="containerRef">
    <!-- Upload Zone -->
    <div 
      class="upload-zone" 
      @dragover.prevent="() => isDragging = true"
      @dragleave.prevent="() => isDragging = false"
      @drop.prevent="handleDrop"
      :class="{ 'is-dragging': isDragging }"
      v-if="!hasBackgroundImage"
      @click="$refs.fileInput.click()"
    >
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        accept="image/*" 
        class="file-input"
      >
      <div class="upload-content">
        <div class="upload-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 16L4 17C4 18.6569 5.34315 20 7 20L17 20C18.6569 20 20 18.6569 20 17L20 16M16 8L12 4M12 4L8 8M12 4L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p>Drop image here or click to upload</p>
      </div>
    </div>

    <!-- Canvas -->
    <canvas ref="canvasRef" @mousedown="startDrawing" @mouseup="stopDrawing" @mouseleave="stopDrawing"></canvas>

    <!-- Controls -->
    <div class="controls" v-if="hasBackgroundImage">
      <div class="control-group">
        <button @click="clearImage" class="control-btn">
          Clear Image
        </button>
        <button @click="clearDrawing" class="control-btn">
          Clear Drawing
        </button>
      </div>
      
      <div class="color-brush-control">
        <div class="brush-preview" :style="{ backgroundColor: brushColor, width: `${brushSize}px`, height: `${brushSize}px` }"></div>
        <div class="control-group">
          <input 
            type="color" 
            v-model="brushColor" 
            class="color-picker"
            title="Brush Color"
          >
          <div class="brush-size-container">
            <span class="brush-size-value">{{brushSize}}px</span>
            <input 
              type="range" 
              v-model="brushSize" 
              min="1" 
              max="50" 
              class="brush-size"
              title="Brush Size"
            >
          </div>
        </div>
      </div>

      <button @click="saveDrawing" class="save-btn">
        Save
      </button>
    </div>
  </div>
</template>

<script>
// Follow WeWeb component development rules for external resource loading
const resourceContainer = document.getElementById('ww-resources') || (() => {
  const container = document.createElement('div');
  container.id = 'ww-resources';
  document.body.appendChild(container);
  return container;
})();

let fabricLoaded = false;
let fabricInstance = null;

async function loadFabricJS() {
  if (!fabricLoaded) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/6.6.1/fabric.min.js';
      script.onload = () => {
        fabricLoaded = true;
        fabricInstance = window.fabric;
        resolve();
      };
      script.onerror = reject;
      resourceContainer.appendChild(script);
    });
  }
  return fabricInstance || window.fabric;
}

import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';

export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  
  setup(props, { emit }) {
    // Reference setup
    const containerRef = ref(null);
    const canvasRef = ref(null);
    const fileInput = ref(null);
    const canvas = ref(null);
    const isDragging = ref(false);
    const hasBackgroundImage = ref(false);
    const isDrawing = ref(false);

    // Canvas settings
    const canvasWidth = computed(() => props.content.canvasWidth || '100%');
    const canvasHeight = computed(() => props.content.canvasHeight || '400px');

    // Drawing settings
    const brushColor = ref(props.content.defaultBrushColor || '#000000');
    const brushSize = ref(props.content.defaultBrushSize || 5);
    
    // Error handling
    const reportError = (error, message = 'An error occurred') => {
      console.error(`${message}:`, error);
      emit('trigger-event', {
        name: 'error',
        event: { error: message, details: error.message }
      });
    };

    // Initialize canvas
    const initCanvas = async () => {
      try {
        await nextTick();
        if (!canvasRef.value || !containerRef.value) return;

        const fabric = await loadFabricJS();
        
        const container = containerRef.value;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        // Dispose existing canvas if it exists
        if (canvas.value) {
          canvas.value.dispose();
        }

        canvas.value = new fabric.Canvas(canvasRef.value, {
          width,
          height,
          isDrawingMode: true,
          backgroundColor: '#ffffff'
        });

        // Set initial brush settings
        canvas.value.freeDrawingBrush = new fabric.PencilBrush(canvas.value);
        canvas.value.freeDrawingBrush.color = brushColor.value;
        canvas.value.freeDrawingBrush.width = parseInt(brushSize.value);
        
        // Set up event listeners for brush
        setupCanvasEvents();
        
        // Handle window resize
        const handleResize = () => {
          const newWidth = container.offsetWidth;
          const newHeight = container.offsetHeight;
          
          // Save current state
          const objects = canvas.value.getObjects();
          const json = canvas.value.toJSON();
          
          // Resize canvas
          canvas.value.setWidth(newWidth);
          canvas.value.setHeight(newHeight);
          
          // Restore state with proper scaling
          if (objects.length > 0) {
            canvas.value.loadFromJSON(json, () => {
              canvas.value.renderAll();
            });
          }
        };
        
        window.addEventListener('resize', handleResize);
        
        // Clean up resize listener on unmount
        onBeforeUnmount(() => {
          window.removeEventListener('resize', handleResize);
        });
      } catch (error) {
        reportError(error, 'Failed to initialize canvas');
      }
    };
    
    // Setup canvas events for smoother drawing
    const setupCanvasEvents = () => {
      if (!canvas.value) return;
      
      // Make drawing smoother
      canvas.value.freeDrawingBrush.decimate = 8; // Smoothing factor
    };
    
    const startDrawing = () => {
      isDrawing.value = true;
    };
    
    const stopDrawing = () => {
      isDrawing.value = false;
    };

    // Handle file upload
    const handleFileSelect = (event) => {
      try {
        const file = event.target.files[0];
        if (file) loadImage(file);
      } catch (error) {
        reportError(error, 'Failed to select file');
      }
    };

    const handleDrop = (event) => {
      try {
        isDragging.value = false;
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          loadImage(file);
        }
      } catch (error) {
        reportError(error, 'Failed to process dropped file');
      }
    };

    // Load image to canvas
    const loadImage = async (file) => {
      try {
        const fabric = await loadFabricJS();
        
        const reader = new FileReader();
        reader.onload = (e) => {
          fabric.Image.fromURL(e.target.result, (img) => {
            if (!canvas.value) return;

            // Scale image to fit canvas while maintaining aspect ratio
            const canvasWidth = canvas.value.width;
            const canvasHeight = canvas.value.height;
            const scale = Math.min(
              canvasWidth / img.width,
              canvasHeight / img.height
            ) * 0.9; // Scale down slightly to leave border

            img.scale(scale);
            img.center();
            img.selectable = false;

            canvas.value.clear();
            canvas.value.add(img);
            canvas.value.sendToBack(img);
            hasBackgroundImage.value = true;

            // Emit upload success event
            emit('trigger-event', {
              name: 'imageUploaded',
              event: { success: true, imageWidth: img.width, imageHeight: img.height }
            });
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reportError(error, 'Failed to load image');
      }
    };

    // Clear functions
    const clearImage = () => {
      try {
        if (!canvas.value) return;
        canvas.value.clear();
        hasBackgroundImage.value = false;
      } catch (error) {
        reportError(error, 'Failed to clear image');
      }
    };

    const clearDrawing = () => {
      try {
        if (!canvas.value) return;
        const objects = canvas.value.getObjects();
        const backgroundImage = objects.length > 0 ? objects[0] : null;
        canvas.value.clear();
        if (backgroundImage) {
          canvas.value.add(backgroundImage);
          canvas.value.sendToBack(backgroundImage);
        }
      } catch (error) {
        reportError(error, 'Failed to clear drawing');
      }
    };

    // Save drawing
    const saveDrawing = () => {
      try {
        if (!canvas.value) return;
        const dataUrl = canvas.value.toDataURL({
          format: 'png',
          quality: 1
        });
        emit('trigger-event', {
          name: 'save',
          event: { value: dataUrl }
        });
      } catch (error) {
        reportError(error, 'Failed to save drawing');
      }
    };

    // Watch brush settings
    watch(brushColor, (newColor) => {
      if (canvas.value) {
        canvas.value.freeDrawingBrush.color = newColor;
      }
    });

    watch(brushSize, (newSize) => {
      if (canvas.value) {
        canvas.value.freeDrawingBrush.width = parseInt(newSize);
      }
    });
    
    // Watch for property changes from WeWeb editor
    watch(() => props.content.defaultBrushColor, (newColor) => {
      if (newColor) brushColor.value = newColor;
    });
    
    watch(() => props.content.defaultBrushSize, (newSize) => {
      if (newSize) brushSize.value = newSize;
    });

    // Lifecycle hooks
    onMounted(() => {
      initCanvas();
    });

    onBeforeUnmount(() => {
      if (canvas.value) {
        canvas.value.dispose();
      }
    });

    return {
      containerRef,
      canvasRef,
      fileInput,
      isDragging,
      hasBackgroundImage,
      isDrawing,
      brushColor,
      brushSize,
      handleFileSelect,
      handleDrop,
      clearImage,
      clearDrawing,
      saveDrawing,
      startDrawing,
      stopDrawing
    };
  }
};
</script>

<style lang="scss" scoped>
.drawing-canvas-container {
  position: relative;
  width: v-bind('canvasWidth');
  height: v-bind('canvasHeight');
  min-height: 400px;
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover {
    .controls {
      opacity: 1;
    }
  }
}

.upload-zone {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2196f3;
    background: rgba(33, 150, 243, 0.05);
  }
  
  &.is-dragging {
    border-color: #2196f3;
    background: rgba(33, 150, 243, 0.1);
  }

  .file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .upload-content {
    text-align: center;
    color: #666;
    
    .upload-icon {
      margin-bottom: 16px;
      svg {
        width: 48px;
        height: 48px;
      }
    }
  }
}

.controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: opacity 0.3s ease;
  align-items: center;
  z-index: 100;

  .control-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .control-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
  
  .color-brush-control {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .brush-preview {
      border-radius: 50%;
      min-width: 16px;
      min-height: 16px;
      border: 1px solid #ddd;
    }
  }

  .color-picker {
    width: 40px;
    height: 40px;
    padding: 2px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .brush-size-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .brush-size-value {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
    }
  }

  .brush-size {
    width: 120px;
    margin: 0;
    cursor: pointer;
  }

  .save-btn {
    padding: 8px 24px;
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:hover {
      background: #1976d2;
    }
    
    &:active {
      transform: translateY(1px);
    }
  }
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
}
</style>