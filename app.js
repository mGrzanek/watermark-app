const Jimp = require('jimp');
const inquirer = require('inquirer');

const addTextWatermarkToImage = async (inputFile, outputFile, text) => {
    try {
        const image = await Jimp.read(inputFile);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        const textData = {
            text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        };
        image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
        await image.quality(100).writeAsync(outputFile);
        console.log('Watermark has been added!');
        startApp();
    } catch (error) {
        console.log('Something went wrong... Try again.');
    }
};

const addImageWatermarkToImage = async (inputFile, outputFile, watermarkFile) => {
    try {
        const image = await Jimp.read(inputFile);
        const watermark = await Jimp.read(watermarkFile);
        const x = image.getWidth() / 2 - watermark.getWidth() / 2;
        const y = image.getHeight() / 2 - watermark.getHeight() / 2;
    
        image.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacitySource: 0.5,
        });
        await image.quality(100).writeAsync(outputFile);
        console.log('Watermark has been added!');
        startApp();
    } catch (error) {
        console.log('Something went wrong... Try again.');
    }  
};

const prepareOutputFilename = (filename) => {
    const [ name, ext ] = filename.split('.');
    return `${name}-with-watermark.${ext}`;
};

const makeImageBrighter = async (inputFile) => {
    try {
        const image = await Jimp.read(inputFile);
        image.brightness(0.2);
        await image.quality(100).writeAsync(inputFile);
        console.log('Success! Image has been brightened.');
    } catch(error) {
        console.log('Something went wrong... Try again.');
        process.exit();
    }
};

const increaseContrast = async (inputFile) => {
    try {
        const image = await Jimp.read(inputFile);
        image.contrast(.4);
        await image.quality(100).writeAsync(inputFile);
        console.log('Success! Contrast has been added to the image.');
    } catch(error) {
        console.log('Something went wrong... Try again.');
        process.exit();
    }
};

const makeImageBlackAndWhite = async (inputFile) => {
    try {
        const image = await Jimp.read(inputFile);
        image.grayscale();
        await image.quality(100).writeAsync(inputFile);
        console.log('Success! Gray colors added.');
    } catch(error) {
        console.log('Something went wrong... Try again.');
        process.exit();
    }
};

const invertImage = async (inputFile) => {
    try {
        const image = await Jimp.read(inputFile);
        image.flip(true, false);
        await image.quality(100).writeAsync(inputFile);
        console.log('Success! The image has been inverted.');
    } catch(error) {
        console.log('Something went wrong... Try again.');
        process.exit();
    }
};

const startApp  = async () => {
    const answer = await inquirer.prompt([{
        name: 'start',
        message: 'Hi! Welcome to "Watermark manager". Copy your image files to `/images` folder. Then you\'ll be able to use them in the app. Are you ready?',
        type: 'confirm'
    }]);
  
    if(!answer.start) process.exit();
  
    const file = await inquirer.prompt([
        {
            name: 'inputImage',
            type: 'input',
            message: 'What file do you want to mark?',
            default: 'test.jpg',
        }
    ]);

    //let editImageActive = true;

    while(true){
        const addImageToEdit = await inquirer.prompt([
            {
                name: 'editImage',
                type: 'confirm',
                message: 'Would you like to edit this file?'
            }
        ]);

        if(!addImageToEdit.editImage) {
            break;
        } 
        
        const editOptions = await inquirer.prompt([
            {
                name: 'selectionOfEditOptions',
                type: 'list',
                message: 'Select edit option',
                choices: ['Make image brighter', 'Increase contrast', 'Make image b&w', 'Invert image']
            }
        ]);

        if(editOptions.selectionOfEditOptions === 'Make image brighter'){
            await makeImageBrighter(`./images/${file.inputImage}`);
        } else if(editOptions.selectionOfEditOptions === 'Increase contrast'){
            await increaseContrast(`./images/${file.inputImage}`);
        } else if(editOptions.selectionOfEditOptions === 'Make image b&w'){
            await makeImageBlackAndWhite(`./images/${file.inputImage}`);
        } else {
            await invertImage(`./images/${file.inputImage}`);
        }     
    }

    const options = await inquirer.prompt([{
        name: 'watermarkType',
        message: 'Select watermark type:',
        type: 'list',
        choices: ['Text watermark', 'Image watermark'],
    }]);

    if(options.watermarkType === 'Text watermark') {
        const text = await inquirer.prompt([{
            name: 'value',
            type: 'input',
            message: 'Type your watermark text:',
        }]);
        options.watermarkText = text.value;

        addTextWatermarkToImage(
            `./images/${file.inputImage}`, 
            `./images/${prepareOutputFilename(file.inputImage)}`, 
            options.watermarkText
        ); 

    } else {
        const image = await inquirer.prompt([{
            name: 'filename',
            type: 'input',
            message: 'Type your watermark filename:',
            default: 'logo.png',
        }]);

        options.watermarkImage = image.filename;

        addImageWatermarkToImage(
            `./images/${file.inputImage}`, 
            `./images/${prepareOutputFilename(file.inputImage)}`, 
            `./images/${options.watermarkImage}`
        );
    }
}

startApp();