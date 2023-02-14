const inputFile = document.getElementById("jsInputFile");
const fakeInputFile = document.getElementById("jsFakeInput");
const fileBtn = document.getElementById("fileBtn");
const preview = document.getElementById("preview");

const dataTransfer = new DataTransfer();

const generateRandomId = () => {
    return Math.random().toString(16).slice(2);
};

const convertBlobToFile = (blob) => {
    return new File([blob], blob.name || "preview", {
        type: "images/*",
    });
};

const deletePreview = (id) => {
    const preview = document.getElementById(id);
    preview.remove();

    const findIndexById = [...dataTransfer.files].findIndex((file) => file.id === id);

    dataTransfer.items.remove(findIndexById);
    inputFile.files = dataTransfer.files;
};

const paintPreview = (src, id) => {
    const wrapper = document.createElement("div");
    wrapper.id = id;
    wrapper.classList.add("preview");
    const img = document.createElement("img");
    const imgSrc = URL.createObjectURL(src);
    img.src = imgSrc;
    const deleteBtn = document.createElement("div");
    deleteBtn.innerText = "❌";
    deleteBtn.addEventListener("click", () => deletePreview(id));
    wrapper.append(img);
    wrapper.append(deleteBtn);
    preview.append(wrapper);
};

const compressedFile = async (file) => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1280,
        useWebWorker: false,
    };
    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.log(error);
    }
};

const handleChange = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const newId = generateRandomId();
            const compressedBlob = await compressedFile(files[i]);
            const convertFile = convertBlobToFile(compressedBlob);
            convertFile.id = newId;
            addFile(convertFile);
            paintPreview(compressedBlob, newId);
        }
    }
};

const addFile = (file) => {
    dataTransfer.items.add(file);
    inputFile.files = dataTransfer.files;
};

fileBtn.addEventListener("click", () => fakeInputFile.click());
fakeInputFile.addEventListener("change", handleChange);
