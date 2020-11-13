const kambing = () => {
  if (document.getElementById("macan").files.length == 0) {
    console.log("no files selected");
  } else submitClick();
};

const submitClick = () => {
  const formData = new FormData();
  const fileField = document.querySelector('input[type="file"]');

  formData.append("photo", fileField.files[0]);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.name == "MulterError") {
        alert(result.message);
      } else if (result == "err") {
        alert("Only images are allowed");
      } else {
        console.log("Success:", result);
        const images = document.getElementById("images");
        const img = document.createElement("img");
        img.src = `/edited/${result.filename}`;

        images.appendChild(img);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
