const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const mongoose = require("mongoose");

// connect to the database
mongoose.connect("mongodb://localhost:27017/creative4", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const orderSchema = new mongoose.Schema({
  name: String,
  number: String,
  email: String,
  additional: String,
  bag: {type:Array},
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

const Order = mongoose.model("Order", orderSchema);

app.get("/api/orders", async (req, res) => {
  try {
    let orders = await Order.find();
    res.send({ orders: orders });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post("/api/orders", async (req, res) => {
  const order = new Order({
    name: req.body.name,
    number: req.body.number,
    email: req.body.email,
    additional: req.body.additional,
    bag: req.body.bag,
  });
  try {
    await order.save();
    res.send({ order: order });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.deleteOne({
      _id: req.params.id,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3001, () => console.log("Server listening on port 3001!"));
