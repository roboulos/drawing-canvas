// This is a wrapper for our component for local testing purposes

// Import the template content as a string
const template = `
  <div class="krea-container" ref="containerRef">
    <!-- Main Canvas -->
    <canvas ref="canvasRef" class="krea-canvas"></canvas>

    <!-- Upload UI -->
    <div v-if="!hasImage" class="upload-area" @click="triggerFileInput">
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        accept="image/*" 
        class="file-input"
      >
      <div class="upload-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        <p>Drop image here or click to upload</p>
      </div>
    </div>

    <!-- Krea-style toolbar -->
    <div v-if="hasImage" class="krea-toolbar">
      <div class="toolbar-inner">
        <button @click="enableDrawing" class="tool-btn" :class="{ active: isDrawingMode }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
          <span>Draw</span>
        </button>
        
        <button @click="clearDrawing" class="tool-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Clear</span>
        </button>
        
        <div class="color-tool">
          <input type="color" v-model="brushColor" class="color-picker">
          <span class="color-indicator" :style="{ backgroundColor: brushColor }"></span>
        </div>
        
        <div class="size-tool">
          <input 
            type="range" 
            v-model.number="brushSize" 
            min="1" 
            max="50" 
            class="size-slider"
          >
          <div class="size-preview" :style="{ width: brushSize + 'px', height: brushSize + 'px' }"></div>
        </div>
        
        <button @click="clearImage" class="tool-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="3" x2="21" y2="21"></line>
          </svg>
          <span>New</span>
        </button>
        
        <button @click="saveDrawing" class="tool-btn save-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
`;

// Import the styles
const styles = `
.krea-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background-color: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
}

.krea-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none; /* Prevents scrolling on mobile */
}

.upload-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 3px dashed #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: #2196f3;
  background-color: rgba(33, 150, 243, 0.05);
}

.krea-container.dragging .upload-area {
  border-color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
}

.file-input {
  display: none;
}

.upload-content {
  text-align: center;
  padding: 20px;
}

.upload-content p {
  margin-top: 16px;
  color: #666;
  font-size: 16px;
}

/* Krea-style toolbar */
.krea-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.toolbar-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #2a2a2a;
  border-radius: 50px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #e0e0e0;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover, .tool-btn.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.tool-btn span {
  font-size: 11px;
}

.color-tool {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0 4px;
}

.color-picker {
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.color-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  pointer-events: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.size-tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 0 8px;
}

.size-slider {
  width: 60px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.size-preview {
  background-color: white;
  border-radius: 50%;
  margin-top: 4px;
}

.save-btn {
  background-color: #2196f3;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
}

.save-btn:hover {
  background-color: #1976d2;
}
`;

// Export the component
export default {
  name: 'DrawingCanvas',
  template,
  props: {
    content: { type: Object, required: true },
    uid: { type: String, default: 'test-uid' }
  },
  
  data() {
    return {
      isDrawing: false,
      isDrawingMode: true,
      ctx: null,
      hasImage: false,
      lastX: 0,
      lastY: 0,
      brushColor: this.content?.defaultBrushColor || '#000000',
      brushSize: this.content?.defaultBrushSize || 5,
      originalImage: null,
      imageData: null
    };
  },
  
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.handleResize);
    
    // Track pointer events for drawing
    this.$refs.canvasRef.addEventListener('pointerdown', this.startDrawing);
    this.$refs.canvasRef.addEventListener('pointermove', this.draw);
    this.$refs.canvasRef.addEventListener('pointerup', this.stopDrawing);
    this.$refs.canvasRef.addEventListener('pointerleave', this.stopDrawing);
    
    // Support drag and drop
    const container = this.$refs.containerRef;
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('dragging');
    });
    
    container.addEventListener('dragleave', (e) => {
      e.preventDefault();
      container.classList.remove('dragging');
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('dragging');
      
      const file = e.dataTransfer.files[0];
      if (file && file.type.match('image.*')) {
        this.loadImage(file);
      }
    });
  },
  
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    
    // Clean up event listeners
    this.$refs.canvasRef.removeEventListener('pointerdown', this.startDrawing);
    this.$refs.canvasRef.removeEventListener('pointermove', this.draw);
    this.$refs.canvasRef.removeEventListener('pointerup', this.stopDrawing);
    this.$refs.canvasRef.removeEventListener('pointerleave', this.stopDrawing);
  },
  
  watch: {
    brushColor() {
      if (this.ctx) {
        this.ctx.strokeStyle = this.brushColor;
      }
    },
    
    brushSize() {
      if (this.ctx) {
        this.ctx.lineWidth = this.brushSize;
      }
    },
    
    'content.defaultBrushColor': function(newVal) {
      if (newVal) this.brushColor = newVal;
    },
    
    'content.defaultBrushSize': function(newVal) {
      if (newVal) this.brushSize = parseInt(newVal);
    }
  },
  
  methods: {
    initCanvas() {
      try {
        const canvas = this.$refs.canvasRef;
        const container = this.$refs.containerRef;
        
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        this.ctx = canvas.getContext('2d');
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
      } catch (error) {
        console.error('Failed to initialize canvas:', error);
        this.emitError('Failed to initialize canvas');
      }
    },
    
    handleResize() {
      try {
        // Store current canvas content
        const canvas = this.$refs.canvasRef;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        
        // Resize canvas
        const container = this.$refs.containerRef;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Restore context settings
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.brushColor;
        this.ctx.lineWidth = this.brushSize;
        
        // Restore original image if exists
        if (this.hasImage && this.originalImage) {
          this.drawImageOnCanvas(this.originalImage);
        } else {
          // Restore drawn content
          this.ctx.drawImage(tempCanvas, 0, 0);
        }
      } catch (error) {
        console.error('Failed to resize canvas:', error);
        this.emitError('Failed to resize canvas');
      }
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileSelect(event) {
      try {
        const file = event.target.files[0];
        if (file) {
          this.loadImage(file);
        }
      } catch (error) {
        console.error('Failed to select file:', error);
        this.emitError('Failed to select file');
      }
    },
    
    loadImage(file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            this.originalImage = img;
            this.drawImageOnCanvas(img);
            this.hasImage = true;
            
            // Emit success event
            this.$emit('trigger-event', {
              name: 'imageUploaded',
              event: { success: true }
            });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Failed to load image:', error);
        this.emitError('Failed to load image');
      }
    },
    
    drawImageOnCanvas(img) {
      try {
        const canvas = this.$refs.canvasRef;
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate scaling to fit
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        ) * 0.9; // Scale down slightly to leave margins
        
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        // Draw image centered
        ctx.drawImage(img, x, y, width, height);
        
        // Store the current state for clearing drawings
        this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error('Failed to draw image:', error);
        this.emitError('Failed to draw image');
      }
    },
    
    enableDrawing() {
      this.isDrawingMode = true;
      this.$refs.canvasRef.style.cursor = 'crosshair';
    },
    
    startDrawing(event) {
      if (!this.hasImage || !this.isDrawingMode) return;
      
      try {
        this.isDrawing = true;
        
        const canvas = this.$refs.canvasRef;
        const rect = canvas.getBoundingClientRect();
        
        // Get position relative to canvas
        this.lastX = event.clientX - rect.left;
        this.lastY = event.clientY - rect.top;
      } catch (error) {
        console.error('Failed to start drawing:', error);
        this.emitError('Failed to start drawing');
      }
    },
    
    draw(event) {
      if (!this.isDrawing || !this.isDrawingMode) return;
      
      try {
        const canvas = this.$refs.canvasRef;
        const rect = canvas.getBoundingClientRect();
        
        // Get current position
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;
        
        // Draw line
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(currentX, currentY);
        this.ctx.stroke();
        
        // Update last position
        this.lastX = currentX;
        this.lastY = currentY;
      } catch (error) {
        console.error('Failed while drawing:', error);
        this.emitError('Failed while drawing');
      }
    },
    
    stopDrawing() {
      this.isDrawing = false;
    },
    
    clearDrawing() {
      try {
        if (!this.hasImage || !this.imageData) return;
        
        // Restore the original image state
        this.ctx.putImageData(this.imageData, 0, 0);
      } catch (error) {
        console.error('Failed to clear drawing:', error);
        this.emitError('Failed to clear drawing');
      }
    },
    
    clearImage() {
      try {
        const canvas = this.$refs.canvasRef;
        
        // Clear the entire canvas
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset state
        this.hasImage = false;
        this.originalImage = null;
        this.imageData = null;
      } catch (error) {
        console.error('Failed to clear image:', error);
        this.emitError('Failed to clear image');
      }
    },
    
    saveDrawing() {
      try {
        const canvas = this.$refs.canvasRef;
        const dataUrl = canvas.toDataURL('image/png');
        
        this.$emit('trigger-event', {
          name: 'save',
          event: { value: dataUrl }
        });
      } catch (error) {
        console.error('Failed to save drawing:', error);
        this.emitError('Failed to save drawing');
      }
    },
    
    emitError(message) {
      this.$emit('trigger-event', {
        name: 'error',
        event: { error: message }
      });
    }
  }
};

// Add the styles to the document
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
