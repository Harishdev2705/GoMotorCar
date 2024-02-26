const multer = require("multer");
const fs = require("fs");

const imagesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "./uploads/images";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {});
        }
        cb(null, "uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.replace(/\s/g, ""));
    },
});

const imagesUpload = multer({
    storage: imagesStorage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
        fieldNameSize: 200,
        fileSize: 1024 * 1024 * 50,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|gif|GIF|JPEG|png|PNG|webp|WEBP)$/)) {
            return cb(new multer.MulterError("You can only upload images"));
        }
        cb(null, true);
    },
});

const uploadMultipleImages = imagesUpload.array("images", 5);

const checkMulterErr = (code) => {
    if (code === "LIMIT_FILE_SIZE") {
        return "Max file size should be 15 MB";
    }
};

const uploadMultipleImagesFiles = async (req, res, next) => {
    try {
        uploadMultipleImages(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).send({
                    isError: true,
                    message: err && err.code && err.code !== 'LIMIT_FILE_SIZE' ? err.code : checkMulterErr(err.code),
                });
            } else if (err) {
                return res.status(400).send({ isError: true, message: err });
            }
            next();
        });
    } catch (error) {
        console.log("Error from uploadMultipleImagesFiles middleware", error);
        return res.status(400).send({ isError: true, error: error.message });
    }
};

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "./uploads/images";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }, (err) => {});
        }
        cb(null, "uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.replace(/\s/g, ""));
    },
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
        fieldNameSize: 200,
        fileSize: 1024 * 1024 * 50,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|gif|GIF|JPEG|png|PNG|webp|WEBP|mp4|MP4|mov|MOV|avi|AVI|wmv|WMV|MKV|mkv|webm|WEBM)$/)) {
            console.log("inside the errror invalid format", file);
            return cb(new multer.MulterError("You can only upload image and video"));
        }
        cb(null, true);
    },
});

const checkMulterErrSingleImage = (code) => {
    if (code === "LIMIT_FILE_SIZE") {
        return "Max file size should be 15 MB";
    }
};

const uploadSingleImage = imageUpload.single("image");

const uploadSingleImageFile = async (req, res, next) => {
    try {
        uploadSingleImage(req, res, async (err) => {
            console.log("file inside deploy server++++++++++", req.file);
            if (err instanceof multer.MulterError) {
                return res.status(400).send({
                    isError: true,
                    message: err && err.code && err.code !== 'LIMIT_FILE_SIZE' ? err.code : checkMulterErrSingleImage(err.code),
                });
            } else if (err) {
                return res.status(400).send({ isError: true, message: err });
            }
            next();
        });
    } catch (error) {
        console.log("error from uploadSingleImageFile middleware", error);
        return res.status(400).send({ isError: true, error: error.message });
    }
};

module.exports = {
    uploadMultipleImagesFiles,
    imagesUpload,
    uploadSingleImageFile,
    imageUpload
};
