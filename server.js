import express from "express";

const app = express();
app.use(express.json());

app.post("/save-selection", async (req, res) => {
  try {
    const { customer_id, selections } = req.body;

    if (!customer_id || !Array.isArray(selections)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const response = await fetch(
      `https://${process.env.SHOP_DOMAIN}/admin/api/2025-01/customers/${customer_id}/metafields.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN
        },
        body: JSON.stringify({
          metafield: {
            namespace: "custom",
            key: "selected_images",
            type: "list.single_line_text_field",
            value: selections
          }
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: text });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running"));
