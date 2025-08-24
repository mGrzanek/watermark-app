# watermark app

This is a Node.js CLI application that allows you to add watermarks (text or image) to pictures and perform basic image editing.

## Description

With a simple text-based interface, you can add a watermark as text or an image. Also, you can edit the image before adding a watermark with options:
- brighten the image
- increase contrast
- convert to black & white
- invert colors

Supported image formats: JPG, PNG, BMP, TIFF or GIF.

## Technologies Used

Node.js, Jimp, Inquirer

## Installation

To install dependencies use:

```bash
npm install
```

## Usage
Place your image and optional watermark in the ./images folder.

Run the app:

```bash
node app.js
```

Then follow the CLI prompts to edit the image and/or add a watermark.

Edited images will be saved in the ./images folder.

## License

License

MIT License

## Author

Monika Grzanek
