let selectedStyle = null;
let uploadedImage = null;

function handleImageUpload() {
    const fileInput = document.getElementById('upload');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
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

    const loadingMessage = document.getElementById('loading');
    const resultImage = document.getElementById('result');
    const downloadButton = document.getElementById('downloadButton');
    loadingMessage.style.display = 'block';
    resultImage.style.display = 'none';
    downloadButton.style.display = 'none';

    const formData = new FormData();
    formData.append("file", uploadedImage);
    formData.append("style", selectedStyle);

    const response = await fetch("http://localhost:8000/transform", {
        method: "POST",
        body: formData,
    });

    loadingMessage.style.display = 'none';

    if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        // Display the result image
        resultImage.src = url;
        resultImage.style.display = 'block';

        // Enable the download button
        downloadButton.href = url;
        downloadButton.style.display = 'block';
    } else {
        alert("Error: Image conversion failed.");
    }
}

function resetSelection() {
    // Reset file input
    const fileInput = document.getElementById('upload');
    fileInput.value = '';

    // Hide preview and result
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const resultImage = document.getElementById('result');
    const stylePreview = document.getElementById('stylePreview');
    const transformButton = document.getElementById('transformButton');
    const downloadButton = document.getElementById('downloadButton');

    previewContainer.style.display = 'none';
    stylePreview.style.display = 'none';
    transformButton.style.display = 'none';
    resultImage.style.display = 'none';
    downloadButton.style.display = 'none';

    // Reset styles
    const styleImages = document.querySelectorAll('.style-image');
    styleImages.forEach((img) => img.classList.remove('selected'));

    // Reset variables
    selectedStyle = null;
    uploadedImage = null;
}

const validExtensions = ['image/jpeg', 'image/png', 'image/gif'];
if (!validExtensions.includes(file.type)) {
    alert("Please upload a valid image file (JPG, PNG, GIF).");
    return;
}