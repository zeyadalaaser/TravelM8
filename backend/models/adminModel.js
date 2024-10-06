import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, immutable: true,
    match: /^[a-zA-Z0-9]{3,16}$/ },
  password: { type: String,
    minlength: 6,
    required: true,
    validate: function(value) {
        // Regular expression to check if the password has at least one letter and one number
        return /[a-zA-Z]/.test(value) && /\d/.test(value);
    }
   },
   role: { type: String, default: 'Admin' }
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
