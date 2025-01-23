let selectedStyle = null;

function handleImageUpload() {
    const stylePreview = document.getElementById('stylePreview');
    const transformButton = document.getElementById('transformButton');

    // 사진 업로드 후 화풍 선택 표시
    stylePreview.style.display = "block";
    transformButton.style.display = "block";
}

function selectStyle(style) {
    // 선택된 화풍 강조
    const styleImages = document.querySelectorAll('.style-image');
    styleImages.forEach((img) => img.classList.remove('selected'));

    const selectedImage = document.querySelector(`img[onclick="selectStyle('${style}')"]`);
    if (selectedImage) {
        selectedImage.classList.add('selected');
    }

    // 선택된 화풍 저장
    selectedStyle = style;
}

async function applyStyle() {
    const fileInput = document.getElementById('upload');
    const resultImage = document.getElementById('result');

    if (!fileInput.files[0]) {
        alert("Upload your image!");
        return;
    }

    if (!selectedStyle) {
        alert("Choose a style!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("style", selectedStyle);

    const response = await fetch("http://localhost:8000/transform", {
        method: "POST",
        body: formData
    });

    if (response.ok) {
        const blob = await response.blob();
        resultImage.src = URL.createObjectURL(blob);
        resultImage.style.display = "block";
    } else {
        alert("Error: Image conversion failed..");
    }
}
