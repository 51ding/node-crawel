var mongoose = require("mongoose");
mongoose.Promise = Promise;
var {Schema} = mongoose;
var {init, initSchema} = require("./index");

(
    async () => {
      await init(() => {
      });
      await initSchema();
      var User = mongoose.model("user");
      var Car = mongoose.model("car");
      var userId = '5ad56dc03c61642a5c327c19';
      var newCar = new Car({make: "x", model: "y", year: "z"});
      const user = await User.findById(userId);

      newCar.seller = user;
      await newCar.save();
      user.cars.push(newCar);
      await user.save()

    }
)()