import mongoose from 'mongoose';

const pdfDetails2Schema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
      },
  idpdf: {
    type: String,
    required: true,
  },
  certificatespdf: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const pdfDetails2Model = mongoose.model('PdfDetails2', pdfDetails2Schema);
export default pdfDetails2Model;
