import app from "./app.js";
import { connectDB } from "./config/dbs.js";


const port = process.env.PORT || 5000; 

 connectDB()

app.listen(port, () => {
  console.log(`running ${port}`);
}); 