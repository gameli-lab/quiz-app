const dbClient = require("../utils/db");
const bcrypt = require("bcrypt");

// Define the Admin Schema
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "admin", // The role is always 'admin' for this schema
      enum: ["admin"] // Only 'admin' role is allowed in this schema
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// Password hashing before saving the Admin model
adminSchema.pre("save", async function (next) {
  const admin = this;
  if (!admin.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare the input password with the hashed password
adminSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Create the Admin model using the schema
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
