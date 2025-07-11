const express = require("express"); // require express
const mongoose = require("mongoose"); // require mongoose
const path = require("path"); // require node js
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // make data base wanderlust
// connected to the main function
async function main() {
  await mongoose.connect(MONGO_URL);
}
// call main function
main()
  .then(() => {
    console.log("connected Succesfully to DB");
  })
  .catch((err) => {
    console.log(`Connection failed for reason ${err}`);
  });
// set Ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//Static files for connect to css
app.use(express.static(path.join(__dirname, "public"))); // connect css file all
// Set up routes
app.get("/", (req, res) => {
  res.send("Server is Woring ");
});

// --------------------------------- Index route --------------------------------
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", {allListings});
});
// --------------- END ROUTE ----------------------------------------------------

// -----------------------* listings -New ROUTE --------------------------------
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
// ------------------------* END LISTINGS NEW ROUTE ----------------------------

//--------------------- SHOW ROUTE ---------------------------------------------
app.get("/listings/:id", async (req, res) => {
  let {id} = req.params; // id mil gye
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});
// -------------------- END SHOW ROUTE -----------------------------------------

//--------------------------------------------- Create Route --------------------------------------------
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});
// --------------------------------------------------- END Create Route -----------------------------------------

//--------------------------------------- Edit Route  --------------------------------------------
app.get("/listings/:id/edit", async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", {listing});
});
// --------------------------------------------------- END EDIT Route -----------------------------------------

// ------------------------------------------ UPDATE ROUTE -------------------------------------------------------
app.put("/listings/:id", async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
});
// ----------------------------------------- END UPDATE ROUTE ----------------------------------------------------

// --------------------------------- DELETE ROUTES --------------------------------------------
app.delete("/listings/:id", async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});
// -------------------------------- END ROUTES ---------------------------------------------------------
app.listen(8080, () => {
  console.log("sever are listing to port 8080 !");
});
// All set up is complete and i have test everything!!!

//***********************************************--- INGNORE THESE THINGS ------********************** */

// // hotels route
// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "The TRUMP, United State",
//     des: "Altra Luxury hotels in face all usa.  .",
//     image:
//       "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: 199500,
//     loc: "New York",
//     country: "United Stated",
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
