const extractDominantColor = (imageSrc, getImageColor) => {

  const img = new Image();
  img.crossOrigin = "Anonymous"; // Avoid CORS issues
  img.src = imageSrc;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0,
      g = 0,
      b = 0;

    // Loop through all pixels
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i]; // Red
      g += imageData[i + 1]; // Green
      b += imageData[i + 2]; // Blue
    }

    const totalPixels = imageData.length / 4;
    r = Math.floor(r / totalPixels);
    g = Math.floor(g / totalPixels);
    b = Math.floor(b / totalPixels);

    getImageColor([r, g, b, 0.6]);
  };
};

// Example usage:
export default extractDominantColor;
