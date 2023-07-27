const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoute");
const scriptRoutes = require("./routes/scriptRoutes");
const audioRoutes = require("./routes/audioRoutes");
const videoRoutes = require("./routes/videoRoutes");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
});
app.use(upload.array());

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/script", scriptRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/video", videoRoutes);

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
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `Server running on port ${process.env.PORT ? process.env.PORT : 5000}`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
