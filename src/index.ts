import { config } from "https://raw.githubusercontent.com/daychongyang/dotenv/master/mod.ts";
import { opine, json } from "https://deno.land/x/opine@1.7.2/mod.ts";
import { routes } from "./routes.ts";

config();
// Deno.env.get("DB_TYPE")
const app = opine();
app.use(json());
app.use(routes);

app.listen(3000, () =>
  console.log("server has started on http://localhost:3000 🚀")
);
