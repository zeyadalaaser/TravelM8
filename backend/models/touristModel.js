const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristSchema = new Schema({
  Username: {
    type: String,
    required: true,
  },
 
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
    validate: function(value) {
        // Regular expression to check if the password has at least one letter and one number
        return /[a-zA-Z]/.test(value) && /\d/.test(value);
      }
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  Nationality: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // Check if the user is at least 18 years old
        const age = moment().diff(moment(value), 'years');
        return age >= 18;
      },
      message: 'You must be at least 18 years old.'
    }
  },
  Occupation:{  // student/job
    type: String,
    required: true,
},

  Wallet:{
    type: Number,
    required: false,
  },

}, { timestamps: true });



// Prevent dob from being updated after it's initially set
userSchema.pre('save', function(next) {
  if (this.isModified('dob') && !this.isNew) {
    return next(new Error('Date of Birth cannot be changed once set.'));
  }
  next();
});


const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;