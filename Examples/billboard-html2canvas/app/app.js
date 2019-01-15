import html2canvas from 'html2canvas'
import createHistogram from './scripts/histogram'

window.addEventListener('load', () => {
    drawCanvasTexture();
})

function drawCanvasTexture(htmlTarget = "#billboard-html-target", textureCanvas = '#snapshot-canvas'){
    let canvasElement = document.querySelector(textureCanvas);
    createHistogram('#histogram',200,380);
    html2canvas(document.querySelector(htmlTarget),
        {
            canvas: canvasElement
        }
    );
}

window.drawCanvasTexture = drawCanvasTexture;
