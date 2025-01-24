let selectedStyle = null;
let uploadedImage = null;

function handleImageUpload() {
    const stylePreview = document.getElementById('stylePreview');
    const transformButton = document.getElementById('transformButton');

    // 업로드된 이미지를 저장하고 화풍 선택 영역과 버튼을 활성화
    uploadedImage = document.getElementById('upload').files[0];
    if (uploadedImage) {
        stylePreview.style.display = 'block';
        transformButton.style.display = 'block';
    }
}

function selectStyle(style) {
    const styleImages = document.querySelectorAll('.style-image');
    styleImages.forEach((img) => img.classList.remove('selected'));

    const selectedImage = document.querySelector(`img[onclick="selectStyle('${style}')"]`);
    if (selectedImage) {
        selectedImage.classList.add('selected');
    }

    selectedStyle = style;
}

async function applyStyle() {
    if (!uploadedImage) {
        alert("Please upload an image first!");
        return;
    }

    if (!selectedStyle) {
        alert("Please select a style!");
        return;
    }

    // 로딩 중 메시지 표시
    const loadingMessage = document.getElementById('loading');
    const resultImage = document.getElementById('result');
    loadingMessage.style.display = 'block';
    resultImage.style.display = 'none';

    const formData = new FormData();
    formData.append("file", uploadedImage);
    formData.append("style", selectedStyle);

    const response = await fetch("http://localhost:8000/transform", {
        method: "POST",
        body: formData
    });

    loadingMessage.style.display = 'none';

    if (response.ok) {
        const blob = await response.blob();
        resultImage.src = URL.createObjectURL(blob);
        resultImage.style.display = 'block';
    } else {
        alert("Error: Image conversion failed.");
    }
}