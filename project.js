let selectedStyle = null;
let uploadedImage = null;

function handleImageUpload() {
    const fileInput = document.getElementById('upload');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const previewSize = document.getElementById('previewSize');

    if (fileInput.files.length > 0) {
        uploadedImage = fileInput.files[0];

        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
            previewImage.style.width = `${previewSize.value}px`; // 기본 크기 설정
        };
        reader.readAsDataURL(uploadedImage);
    } else {
        previewContainer.style.display = 'none';
    }
}

function uploadImage() {
    const fileInput = document.getElementById('upload');
    if (!fileInput.value) {
        alert("Please select an image before uploading!");
        return;
    }

    const stylePreview = document.getElementById('stylePreview');
    const transformButton = document.getElementById('transformButton');
    stylePreview.style.display = 'block';
    transformButton.style.display = 'block';
}

function adjustPreviewSize() {
    const previewImage = document.getElementById('previewImage');
    const previewSize = document.getElementById('previewSize');
    previewImage.style.width = `${previewSize.value}px`; // 슬라이더 값에 따라 크기 변경
}

function deselectStyle() {
    const styleImages = document.querySelectorAll('.style-image');
    styleImages.forEach((img) => img.classList.remove('selected')); // 모든 선택 초기화
    selectedStyle = null;

    // "Transform" 버튼 숨기기
    const transformButton = document.getElementById('transformButton');
    transformButton.style.display = 'none';
}


function selectStyle(style) {
    const styleImages = document.querySelectorAll('.style-image');

    // 이전 선택 해제
    styleImages.forEach((img) => img.classList.remove('selected'));

    // 선택된 화풍에 강조 테두리 추가
    const selectedImage = document.querySelector(`img[onclick="selectStyle('${style}')"]`);
    if (selectedImage) {
        selectedImage.classList.add('selected');
    }

    selectedStyle = style;

    // "Transform" 버튼 활성화
    const transformButton = document.getElementById('transformButton');
    if (selectedStyle && uploadedImage) {
        transformButton.style.display = 'block';
    }
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