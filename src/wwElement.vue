<template>
  <div class="drawing-canvas-container" ref="containerRef">
    <!-- Upload Zone -->
    <div 
      class="upload-zone" 
      @dragover.prevent
      @drop.prevent="handleDrop"
      :class="{ 'is-dragging': isDragging }"
      v-if="!hasBackgroundImage"
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
    <canvas ref="canvasRef"></canvas>

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
      
      <div class="control-group">
        <input 
          type="color" 
          v-model="brushColor" 
          class="color-picker"
          title="Brush Color"
        >
        <input 
          type="range" 
          v-model="brushSize" 
          min="1" 
          max="50" 
          class="brush-size"
          title="Brush Size"
        >
      </div>

      <button @click="saveDrawing" class="save-btn">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue';
import { fabric } from 'fabric';

export default {
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  
  setup(props, { emit }) {
    const containerRef = ref(null);
    const canvasRef = ref(null);
    const fileInput = ref(null);
    const canvas = ref(null);
    const isDragging = ref(false);
    const hasBackgroundImage = ref(false);

    // Drawing settings
    const brushColor = ref('#000000');
    const brushSize = ref(5);

    // Initialize canvas
    const initCanvas = async () => {
      await nextTick();
      if (!canvasRef.value || !containerRef.value) return;

      const container = containerRef.value;
      const width = container.offsetWidth;
      const height = container.offsetHeight;

      canvas.value = new fabric.Canvas(canvasRef.value, {
        width,
        height,
        isDrawingMode: true,
        backgroundColor: '#ffffff'
      });

      // Set initial brush settings
      canvas.value.freeDrawingBrush.color = brushColor.value;
      canvas.value.freeDrawingBrush.width = brushSize.value;
    };

    // Handle file upload
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) loadImage(file);
    };

    const handleDrop = (event) => {
      isDragging.value = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        loadImage(file);
      }
    };

    // Load image to canvas
    const loadImage = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          if (!canvas.value) return;

          // Scale image to fit canvas
          const canvasWidth = canvas.value.width;
          const canvasHeight = canvas.value.height;
          const scale = Math.min(
            canvasWidth / img.width,
            canvasHeight / img.height
          );

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
            event: { success: true }
          });
        });
      };
      reader.readAsDataURL(file);
    };

    // Clear functions
    const clearImage = () => {
      if (!canvas.value) return;
      canvas.value.clear();
      hasBackgroundImage.value = false;
    };

    const clearDrawing = () => {
      if (!canvas.value) return;
      const objects = canvas.value.getObjects();
      const backgroundImage = objects[0];
      canvas.value.clear();
      if (backgroundImage) {
        canvas.value.add(backgroundImage);
      }
    };

    // Save drawing
    const saveDrawing = () => {
      if (!canvas.value) return;
      try {
        const dataUrl = canvas.value.toDataURL({
          format: 'png',
          quality: 1
        });
        emit('trigger-event', {
          name: 'save',
          event: { value: dataUrl }
        });
      } catch (error) {
        console.error('Error saving drawing:', error);
        emit('trigger-event', {
          name: 'error',
          event: { error: 'Failed to save drawing' }
        });
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
      brushColor,
      brushSize,
      handleFileSelect,
      handleDrop,
      clearImage,
      clearDrawing,
      saveDrawing
    };
  }
};
</script>

<style lang="scss" scoped>
.drawing-canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
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
  padding: 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .control-group {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .control-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    
    &:hover {
      background: #f5f5f5;
    }
  }

  .color-picker {
    width: 40px;
    height: 40px;
    padding: 2px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .brush-size {
    width: 100px;
  }

  .save-btn {
    padding: 8px 24px;
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #1976d2;
    }
  }
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>