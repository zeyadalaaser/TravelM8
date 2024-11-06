import pdfDetailsModelTourGuide from '../models/pdfDetailsTourGuideModel.js';
import pdfDetailsModelselleradver from '../models/pdfsDetailsSeller&AdvModel.js';


export const uploadFile = async (req, res) => {
    const { username, type } = req.body;

    // Check if files are uploaded
    if (!req.files || !req.files.image || !req.files.idfile || !req.files.taxfile) {
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }
    const imageName = req.files.image[0].filename;
    const idFileName = req.files.idfile[0].filename;
    const taxFileName = req.files.taxfile[0].filename;
    try {
        const fileDetails = new pdfDetailsModelselleradver({
            image: imageName,
            idpdf: idFileName,
            taxpdf: taxFileName,
            username: username,
            type: type,
        });
        await fileDetails.save();
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message:'file upload unsuccessfull' });
    }
};

export const uploadFile2 = async (req, res) => {
    const { username, type } = req.body;

    // Check if files are uploaded
    if (!req.files || !req.files.image || !req.files.idfile || !req.files.certificates) {
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }
    const imageName = req.files.image[0].filename;
    const idFileName = req.files.idfile[0].filename;
    const certificatesFileName = req.files.certificatesfile[0].filename;
    try {
        const fileDetails = new pdfDetailsModelTourGuide({
            image: imageName,
            idpdf: idFileName,
            certificates: certificatesFileName,
            username: username,
            type: type,
        });
        await fileDetails.save();
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message:'file upload unsuccessfull' });
    }
};

