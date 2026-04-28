const {ImageKit} = require("@imagekit/nodejs");

const imageKitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


async function uploadFile(files){
    const result = await imageKitClient.files.upload({
        file: files.buffer.toString("base64"),
        fileName: "images_"+Date.now(),
        folder:"apna_ghar/property_images"
    });
    return result;
}

module.exports = {uploadFile};