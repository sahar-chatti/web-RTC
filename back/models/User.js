const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Can't be blank"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "Can't be blank"],
      index: true,
      validate: [isEmail, "invalid Email"],
    },
    password: {
      type: String,
      required: [true, "Can't be blank"],
    },
    picture: {
      type: String,
    },
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
    friendsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  { minimize: false }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(user.password)) {
    return next(
      new Error(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character."
      )
    );
  }

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});
UserSchema.method.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
const findByCredentials = async (email, password) => {
  console.log("email", email);
  const user = await User.findOne({ email });
  console.log("user finded ", user);
  if (!user) throw new Error("invalid Email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("invalid email or password");
  return user;
};

const User = mongoose.model("User", UserSchema);

module.exports = {
  findByCredentials: findByCredentials,
  User: User,
};
