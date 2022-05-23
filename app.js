const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
const PORT = process.env.PORT;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.error(err);
  });
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  tokens: [
    {
      token: {
        type: "string",
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", userSchema);

const formSchema = new mongoose.Schema({
  fullname: {
    type: "string",
  },
  email: {
    type: "string",
  },
  address: {
    type: "string",
  },
  state: {
    type: "string",
  },
  city: {
    type: "string",
  },
  pincode: {
    type: "number",
  },
  phone: {
    type: "number",
  },
  age: {
    type: "number",
    min: 1,
    max: 150,
  },
  dogName: {
    type: "string",
  },
  house: {
    type: "string",
    enum: ["apartment", "house", "room", "studio"],
  },
  householdType: {
    type: "String",
    possibleValues: ["rural", "suburban", "urban"],
  },
  homeActivity: {
    type: "String",
    possibleValues: [
      "busy/noisy",
      "moderate comings/goings",
      "quiet with Occasional Guests",
    ],
  },
  people: {
    type: "string",
  },
  representative: {
    type: "String",
    possibleValues: ["yes", "no"],
  },
  ownResidence: {
    type: "String",
    possibleValues: ["yes", "no"],
  },
  lconfirm: {
    type: "String",
    possibleValues: ["yes", "no"],
  },
  linfo: {
    type: "string",
  },
  adults: {
    type: "number",
  },
  petInfo: {
    type: "string",
  },
  stay: {
    type: "string",
  },
  spay: {
    type: "String",
    possibleValues: ["yes", "no"],
  },
  veterinarian: {
    type: "string",
  },
  returnPet: {
    type: "string",
  },
  dogSex: {
    type: "String",
    possibleValues: ["male", "female", "no preference"],
  },
  dogSize: {
    type: "String",
    possibleValues: ["small", "medium", "large"],
  },
  carePatience: {
    type: "String",
    possibleValues: ["yes", "no"],
  },
  hear: {
    type: [String],
    possibleValues: [
      "Website",
      "Magazine",
      "Newspaper",
      "Word of mouth",
      "Referral",
      "other",
    ],
  },
  reason: {
    type: [String],
    possibleValues: [
      "housepet",
      "home patrol",
      "companion",
      "companion for dog",
      "gift",
      "other",
    ],
  },
});

const Form = mongoose.model("Form", formSchema);

const clientSchema = new mongoose.Schema({
  fullname: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  subject: {
    type: "string",
    required: true,
  },
  message: {
    type: "string",
    required: true,
  },
});

const Client = mongoose.model("Client", clientSchema);

app.get("/index", (req, res) => {
  res.render("pages/index");
});
app.get("/", (req, res) => {
  res.render("pages/index");
});
app.get("/about", (req, res) => {
  res.render("pages/about");
});
app.get("/about2", (req, res) => {
  res.render("pages/about2");
});
app.get("/about2", (req, res) => {
  res.render("pages/about2");
});
app.get("/contact", (req, res) => {
  res.render("pages/contact");
});
app.get("/gallery2", (req, res) => {
  res.render("pages/gallery2");
});
app.get("/services", (req, res) => {
  res.render("pages/services");
});
app.get("/adoption", (req, res) => {
  res.render("pages/adoption");
});
app.get("/login", function (req, res) {
  res.render("pages/login");
});
// app.get("/register", function (req, res) {
//   res.render("register");
// });
app.get("/adoption-single", (req, res) => {
  res.render("pages/adoption-single");
});
app.get("/form", (req, res) => {
  res.render("pages/form");
});

app.post("/form", (req, res) => {
  const email = req.body.email;

  Form.findOne({ email: email })
    .then((formExist) => {
      if (formExist) {
        res.status(422).json({ error: "email already exists" });
      } else {
        const form = new Form(req.body);

        form
          .save()
          .then(() => {
            // res.status(201).json({ message: "user registered successfully" });
            res.render("pages/submitform");
          })
          .catch((error) => res.status(500).json({ error: error.message }));
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/contact", (req, res) => {
  const email = req.body.email;

  Client.findOne({ email: email })
    .then((clientExist) => {
      if (clientExist) {
        res.status(422).json({ error: "email already exists" });
      } else {
        const client = new Client(req.body);

        client
          .save()
          .then(() => {
            // res.status(201).json({ message: "user registered successfully" });
            res.render("pages/submitform");
          })
          .catch((error) => res.status(500).json({ error: error.message }));
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill data" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "Invalid" });
      } else {
        // res.json({ message: "user logged in successfully" });
        res.render("pages/index");
      }
    } else {
      res.status(400).json({ error: "Invalid" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "plz fill all fields" });
  }
  User.findOne({ email: email })
    .then((userExist) => {
      if (userExist) {
        res.status(422).json({ error: "email already exists" });
      }
      const user = new User({ name, email, password });

      user
        .save()
        .then(() => {
          res.status(201).json({ message: "user registered successfully" });
          res.render("pages/index");
        })
        .catch((error) =>
          res.status(500).json({ error: "failed to register" })
        );
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(PORT, function () {
  console.log(`Server Started on port ${PORT}`);
});
