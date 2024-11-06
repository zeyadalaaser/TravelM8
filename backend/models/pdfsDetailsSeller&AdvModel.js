import mongoose from "mongoose";

const pdfDetailsSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  idpdf: {
    type: String,
    required: true,
  },
  taxpdf: {
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
    enum: ["Advertiser", "Seller"], // Ensure the type is one of these values
  },
});

const pdfDetailsModel = mongoose.model("PdfDetails", pdfDetailsSchema);
export default pdfDetailsModel;
