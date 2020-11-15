var load = document.getElementById("load");

const kambing = () => {
  if (document.getElementById("macan").files.length == 0) {
    alert("no files selected");
  } else {
    load.className = "imgload";
    load.src = "load/load.svg";
    submitClick();
  }
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
      console.log(result);
      if (result.name == "MulterError") {
        alert(result.message);
      } else if (result == "err") {
        alert("Only images are allowed");
      } else {
        console.log(result.filename);
        const images = document.getElementById("images");
        const img = document.createElement("img");
        img.classList.add("imgview");
        img.src = `/edited/${result.size}`;
        images.appendChild(img);
        load.className = "imgloadmute";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
