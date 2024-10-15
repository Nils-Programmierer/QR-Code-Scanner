const code = document.getElementById("code");
const picContainer = document.getElementById('Pic');
const LinkDiv = document.getElementById("link");
let videoStream;
let link;
let qr;



function ChangeToScannen() {
    scannen.style.backgroundColor = "yellow";
    create.style.backgroundColor = "";
    scannenDiv.style.display = "block";
    createDiv.style.display = "none";
    picContainer.innerText = "";
    LinkDiv.innerHTML = "";
}


function ChangeToCreate() {
    scannen.style.backgroundColor = "";
    create.style.backgroundColor = "yellow";
    scannenDiv.style.display = "none";
    download.style.display = "none";
    successful.style.display = "none";
    createDiv.style.display = "block";
    url.value = "";
    code.innerText = "";
}


function CreateCode(event) {
    event.preventDefault();
    const Pfad = url.value;

    qr = new QRious({
        element: document.createElement('canvas'),
        value: Pfad,
        size: 128
    });

    code.innerHTML = '';
    successful.style.display = "none";
    code.appendChild(qr.element);
    download.style.display = "flex";
}


function DownloadCode() {
    if (!qr) return;
    const qrImage = qr.toDataURL("image/png");

    const link = document.createElement('a');
    link.href = qrImage;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    successful.style.display = "flex";
}


function Gallery() {
    LinkDiv.innerHTML = "";
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = 'auto';
        img.style.height = '270px';

        picContainer.innerHTML = '';
        picContainer.appendChild(img);


        img.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);


            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            link = jsQR(imageData.data, canvas.width, canvas.height);

            if (link) {
                let LinkShort = link.data.substring(0, 24);
                LinkDiv.innerHTML = `
                    <a href="${link.data}">${LinkShort}</a>
                `;
            } else {
                LinkDiv.innerHTML = `
                    <span class="red">Kein QR-Code gefunden!</span>
                `;
            }
        };
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}



function Camera() {
    LinkDiv.innerHTML = "";
    const video = document.createElement('video');
    video.style.maxWidth = '100%';
    video.style.height = "270px";
    video.autoplay = true;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } })
        .then(stream => {
            videoStream = stream;
            video.srcObject = stream;

            picContainer.innerHTML = '';
            picContainer.appendChild(video);

            detectQRCode(video);
        })
        .catch(err => {
            console.error("Kamerazugriff fehlgeschlagen:", err);
        });
}


function detectQRCode(video) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    setInterval(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
            let LinkShort = qrCode.data.substring(0, 24);
            LinkDiv.innerHTML = `
                <a href="${qrCode.data}">${LinkShort}</a>
            `;
        }
    }, 500);
}