import "dotenv/config";
import { app } from "./server";

const PORT = parseInt(process.env.PORT || "8080", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server ready at: http://0.0.0.0:${PORT}`);
});
