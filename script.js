//ML Model Start

const URL = "https://teachablemachine.withgoogle.com/models/Rc1T7FLqq/";

let model, labelContainer, maxPredictions;


document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('image-input').click();
 });
 

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        const imageTag = document.getElementById("uploaded-image");
        reader.onload = async function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = async function () {
                imageTag.src = image.src;
                imageTag.style.display = 'block'; // Show the image

                // Clear the label-container
                const labelContainer = document.getElementById("label-container");
                while (labelContainer.firstChild) {
                labelContainer.removeChild(labelContainer.firstChild);
        }

                await init(); // Initialize the model
                await predict(image); // Make predictions with the uploaded image
            };
        };
        reader.readAsDataURL(file);
    }
}

// run the image through the image model
async function predict(image) {
    const prediction = await model.predict(image);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}


