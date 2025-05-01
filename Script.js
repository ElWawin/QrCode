function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('active');
}

function generateQR() {
    const text = document.getElementById('qr-text').value;
    const imageInput = document.getElementById('qr-image');
    const qrContainer = document.getElementById('qr-code');
    
    qrContainer.innerHTML = '';
    
    if (text) {
        const qr = new QRCode(qrContainer, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        document.getElementById('qr-result').classList.add('show');
        
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    const size = 256;
                    canvas.width = size;
                    canvas.height = size;
                    
                    // Dibujar el código QR
                    context.drawImage(qrContainer.querySelector('img'), 0, 0, size, size);
                    
                    // Superponer la imagen en el centro
                    const imageSize = size * 0.3;
                    context.drawImage(img, 
                        (size - imageSize) / 2,
                        (size - imageSize) / 2,
                        imageSize,
                        imageSize
                    );
                    
                    qrContainer.innerHTML = '';
                    qrContainer.appendChild(canvas);
                };
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    }
}

function downloadQR() {
    const qrImage = document.querySelector('#qr-code canvas, #qr-code img');
    const link = document.createElement('a');
    link.download = 'mi-codigo-qr.png';
    link.href = qrImage.src || qrImage.toDataURL();
    link.click();
}

async function shareQR() {
    const qrImage = document.querySelector('#qr-code canvas, #qr-code img');
    const blob = await (await fetch(qrImage.src || qrImage.toDataURL())).blob();
    const file = new File([blob], 'codigo-qr.png', { type: 'image/png' });
    
    if (navigator.share) {
        try {
            await navigator.share({
                files: [file],
                title: 'Mi Código QR',
                text: '¡Mira el código QR que he creado!'
            });
        } catch (error) {
            console.error('Error al compartir:', error);
        }
    } else {
        alert('Tu navegador no soporta la función de compartir');
    }
}
