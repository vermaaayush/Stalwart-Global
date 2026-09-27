/**
 * CANVAS TEXT ANIMATION (Aceternity / Fluid Sine Wave Canvas Text)
 * Native Vanilla JS Canvas Implementation for High Performance Web
 */

export function initCanvasText(target) {
  const elements = typeof target === 'string' 
    ? document.querySelectorAll(target)
    : (target ? [target] : document.querySelectorAll('.canvas-text, [data-canvas-text]'));

  elements.forEach((container) => {
    if (container.dataset.canvasInitialized === 'true') return;
    container.dataset.canvasInitialized = 'true';

    const text = container.getAttribute('data-text') || container.textContent.trim() || 'Lightning Speed';
    const bgClassName = container.getAttribute('data-bg-class') || 'bg-blue-600';
    const rawColors = container.getAttribute('data-colors');
    const colors = rawColors ? JSON.parse(rawColors) : [
      "rgba(255, 223, 0, 1)",
      "rgba(245, 215, 127, 0.95)",
      "rgba(212, 175, 55, 0.9)",
      "rgba(255, 240, 160, 0.85)",
      "rgba(212, 175, 55, 0.75)",
      "rgba(245, 215, 127, 0.65)",
      "rgba(212, 175, 55, 0.5)",
      "rgba(255, 223, 0, 0.4)",
      "rgba(245, 215, 127, 0.3)",
      "rgba(212, 175, 55, 0.15)"
    ];
    const animationDuration = parseFloat(container.getAttribute('data-duration')) || 16;
    const lineWidth = parseFloat(container.getAttribute('data-line-width')) || 1.6;
    const lineGap = parseFloat(container.getAttribute('data-line-gap')) || 4;
    const curveIntensity = parseFloat(container.getAttribute('data-curve-intensity')) || 65;

    // Clear and build internal DOM structure
    container.innerHTML = '';
    container.classList.add('canvas-text-wrapper');

    // Invisible text element for layout sizing
    const textRef = document.createElement('span');
    textRef.className = 'canvas-text-sizer';
    textRef.setAttribute('aria-hidden', 'true');
    textRef.textContent = text;
    container.appendChild(textRef);

    // Canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'canvas-text-canvas';
    canvas.setAttribute('aria-label', text);
    canvas.setAttribute('role', 'img');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let font = '';
    let animationFrameId = 0;
    let startTime = performance.now();
    const bgColor = '#050505';

    function updateDimensions() {
      const rect = textRef.getBoundingClientRect();
      const computed = window.getComputedStyle(textRef);
      width = Math.ceil(rect.width) || 300;
      height = Math.ceil(rect.height) || 120;
      font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(textRef);

    function animate(currentTime) {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const elapsed = (currentTime - startTime) / 1000;
      const phase = (elapsed / animationDuration) * Math.PI * 2;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      ctx.font = font;
      const metrics = ctx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || 40;
      const descent = metrics.actualBoundingBoxDescent || 10;
      const baselineY = (height + ascent - descent) / 2;

      const numLines = Math.floor(height / lineGap) + 10;

      // 1. Render base text silhouette
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = font;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#000000';
      ctx.fillText(text, 0, baselineY);

      // 2. Color the text fill
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw animated undulating sine/bezier wave lines within the text
      ctx.globalCompositeOperation = 'source-atop';
      for (let i = 0; i < numLines; i++) {
        const y = i * lineGap;
        const curve1 = Math.sin(phase) * curveIntensity;
        const curve2 = Math.sin(phase + 0.5) * curveIntensity * 0.6;

        const colorIndex = i % colors.length;
        ctx.strokeStyle = colors[colorIndex];
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
          width * 0.33,
          y + curve1,
          width * 0.66,
          y + curve2,
          width,
          y
        );
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);
  });
}
