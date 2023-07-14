const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoute");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);

//catch no matched route
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  res.json({ status: false, msg: error.message });
});

//Logic to connect to mongoDB
const myPublicDB =
  "mongodb+srv://myPublicDB:myPassword@cluster0.rfoqana.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(process.env.MONGO_URL || myPublicDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDb connected Successfully");

    //Start Listening when connected to mongoDB
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server running on port ${process.env.PORT ? process.env.PORT : 3000}`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
