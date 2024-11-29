import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";
import moment from "moment";
import validator from "validator";
import {
  validateUsername,
  validatePassword,
} from "../services/validators/validators.js";

const touristSchema = new Schema(
  {
    name: {
      type: String,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      validate: {
        validator: validateUsername,
        message: "Username must contain numbers, letters and length 3-16",
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email), // Using Validator.js
        message: "Please enter a valid email address.",
      },
    },

    password: {
      type: String,
      required: true,
      validate: {
        validator: validatePassword,
        message: "Password must contain numbers, letters and min length is 4",
      },
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    nationality: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
      immutable: true, // This ensures that dob cannot be changed after creation
      validate: {
        validator: function (value) {
          const age = moment().diff(moment(value), "years");
          return age >= 18; // Returns false if the age is less than 18
        },
        message: "You must be at least 18 years old to register.",
      },
    },

    occupation: {
      // student/job
      type: String,
      required: true,
    },

    wallet: {
      type: Number,
      required: false,
      default: 0,
      //immutable: true,
    },

    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    badgeLevel: {
      type: String,
      enum: ["Level 1", "Level 2", "Level 3"],
      default: "Level 1",
    },
    preferences: {
      type: [String],
      default: [],
    },
    address: [
      {
        fullName: {
          type: String,
        },
        mobileNumber: {
          type: String,
        },
        streetName: {
          type: String,
        },
        buildingNumber: {
          type: String,
        },
        city: {
          type: String,
        },
        postalCode: {
          type: String,
        },
        country: {
          type: String,
        },
      },
    ],
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1, // Ensure at least 1 item
        },
        price: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

touristSchema.virtual("totalCartPrice").get(function () {
  return this.cart.reduce((total, item) => total + item.price, 0);
});
touristSchema.set("toJSON", { virtuals: true });
touristSchema.set("toObject", { virtuals: true });

touristSchema.pre("save", function (next) {
  if (this.isModified("dob") && !this.isNew) {
    return next(new Error("Date of Birth cannot be changed once set."));
  }
  next();
});

touristSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Tourist = mongoose.model("Tourist", touristSchema);
export default Tourist;
