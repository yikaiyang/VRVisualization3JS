import html2canvas from 'html2canvas'



window.addEventListener('load', () => {
    let canvasElement = document.querySelector('#snapshot-canvas');
    html2canvas(document.querySelector('#target'),
        {
            width: '512px',
            height: '512px',
            canvas: canvasElement
        }
    )/* .then( (canvas) => {
        console.log(canvas);
      
        let pixelRatio = window.devicePixelRatio || 1;
        let canvasElement = document.querySelector('#snapshot-canvas');
        let canvasCtx = canvasElement.getContext('2d');
        canvasCtx.drawImage(canvas, 0, 0, canvas.height * pixelRatio, canvas.width * pixelRatio);
    }) */;
})
