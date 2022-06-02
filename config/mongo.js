//1.import library mongoose
const mongoose = require('mongoose');

//2.url untuk access mongodb: mongodb://namaUser:passwordAccount@localhost:27017/databaseName
const mongoAccessURL = `mongodb://al:1234@localhost:27017/commerce-ah`;

//3.Define data structure field at collection
const bannerSchema = mongoose.Schema({
    src: String
});

//4.Setup collection
const mongoBanner = mongoose.model("bannerCollection", bannerSchema, "banner");

//5.export
module.exports = {
    mongoAccessURL,
    mongoBanner
};