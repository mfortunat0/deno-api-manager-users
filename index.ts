import { opine, json } from "https://deno.land/x/opine@1.7.2/mod.ts";

const app = opine();
app.use(json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3000, () =>
  console.log("server has started on http://localhost:3000 🚀")
);
