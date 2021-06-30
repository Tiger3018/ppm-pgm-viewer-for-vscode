const styles = {
  canvas: `padding: 0;
           margin: auto;
           display: block;`,
  info: `position: fixed;
         padding: 0px 15px;
         margin: 15px 15px;
         width: 100px;`,
  sizingButton: `width: 48%;
                 display: inline-block;
                 text-align: center;
                 cursor: pointer;
                 user-select: none;`,
  resetButton: `text-align: center;
                margin-bottom: 15px;
                cursor: pointer;
                user-select: none;`,
};

const generateHTMLCanvas = (
  data: string,
  width: number,
  height: number,
  imgType: string,
  bgColor: string,
  btnColor: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <div style="${styles.info} background-color: ${bgColor};">
          <p>Type: ${imgType}</p>
          <p>Width: ${width}px</p>
          <p>Height: ${height}px</p>
          <p id="scale-display">Zoom: 100%</p>
          <div style="margin-bottom: 5px">
            <div onclick="scale = scale * 2; showImg(scale);" style="${styles.sizingButton} background-color: ${btnColor};">+</div>
            <div onclick="scale = scale / 2; showImg(scale);" style="${styles.sizingButton} background-color: ${btnColor};">-</div>
          </div>
          <div onclick="scale = 1; showImg(scale);" style="${styles.resetButton} background-color: ${btnColor};">Reset</div>
        </div>
        <div id="canvas-container" style="overflow: auto">
          <canvas width="${width}" height="${height}" id="canvas-area" style="${styles.canvas}"></canvas>
        </div>
        <script>
          let scale = 1;
          let jsonStr = '${data}';
          const message = JSON.parse(jsonStr);
          let colorData = message.colorData;
          let canvas = document.getElementById('canvas-area');
          let scaleDisplay = document.getElementById('scale-display');
          function showImg(scale) {
            let ctx = canvas.getContext('2d');
            canvas.width = ${width} * scale;
            canvas.height = ${height} * scale;
            for (let x = 0; x < ${width}; x++){
              for (let y = 0; y < ${height}; y++){
                let color = colorData[(y * ${width}) + x];
                ctx.fillStyle = "rgba(" + color.r + "," + color.g + "," + color.b + "," + 1.0 + ")";
                ctx.fillRect(x * scale, y * scale, scale, scale);
              }
            }
            scaleDisplay.innerHTML = "Zoom: " + String(scale * 100) + "%";
          }
          showImg(scale);

          const lastPos = { x: 0, y: 0 };
          let isDragging = false;
          const canvasContainer = document.getElementById('canvas-container');
          const root = document.documentElement;

          function onMouseDown(e) {
            lastPos.x = e.clientX;
            lastPos.y = e.clientY;
            canvasContainer.style.cursor = 'grabbing';
            isDragging = true;
          };

          function onMouseMove(e) {
            if (isDragging) {
              canvasContainer.style.cursor = 'grabbing';

              const dx = lastPos.x - e.clientX;
              const dy = lastPos.y - e.clientY;

              canvasContainer.scrollLeft += dx;
              root.scrollTop += dy;

              lastPos.x = e.clientX;
              lastPos.y = e.clientY;
            }
          };

          function onMouseUp(e) {
            canvasContainer.style.cursor = 'grab';
            isDragging = false;
          };

          canvasContainer.onmousedown = onMouseDown;
          canvasContainer.onmousemove = onMouseMove;
          canvasContainer.onmouseup = onMouseUp;
        </script>
      </body>
    </html>`;
};

export default generateHTMLCanvas;