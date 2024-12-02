import pdfDetailsModelTourGuide from '../models/pdfDetailsTourGuideModel.js';
import pdfDetailsModelselleradver from '../models/pdfsDetailsSeller&AdvModel.js';


export const uploadFile = async (req, res) => {
    const { username, type } = req.body;

    // Log the incoming request body and files to help debug
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);

    // Check if files are uploaded
    if (!req.files || !req.files.image || !req.files.idfile || !req.files.taxfile) {
        console.log('No files uploaded or some files are missing');
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }

    // Log the filenames of the uploaded files
    const imageName = req.files.image[0].filename;
    const idFileName = req.files.idfile[0].filename;
    const taxFileName = req.files.taxfile[0].filename;
    
    console.log('Image File:', imageName);
    console.log('ID File:', idFileName);
    console.log('Tax File:', taxFileName);

    try {
        // Log the file details object before saving it
        const fileDetails = new pdfDetailsModelselleradver({
            image: imageName,
            idpdf: idFileName,
            taxpdf: taxFileName,
            username: username,
            type: type,
        });

        console.log('File Details to Save:', fileDetails);

        // Save the details to the database
        await fileDetails.save();
        
        // Log the success response
        console.log('File details saved successfully');
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        // Log any errors that occur during the file save process
        console.log('Error saving file details:', error);
        res.status(500).json({ status: 'error', message: 'File upload unsuccessful' });
    }
};


export const uploadFile2 = async (req, res) => {
    const { username, type } = req.body;
    if (!req.files || !req.files.image || !req.files.idfile || !req.files.certificatesfile) {
        return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }
    const imageName = req.files.image[0].filename;
    const idFileName = req.files.idfile[0].filename;
    const certificatesFileName = req.files.certificatesfile[0].filename;
    try {
        const fileDetails = new pdfDetailsModelTourGuide({
            image: imageName,
            idpdf: idFileName,
            certificatespdf: certificatesFileName,
            username: username,
            type: type,
        });
        await fileDetails.save();
        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message:'file upload unsuccessfull' });
    }
};

