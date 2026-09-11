import { Router, type IRouter } from "express";
import { CreateInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/inquiries", async (req, res) => {
  const parsed = CreateInquiryBody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Please provide a name, valid email, service, and project details.",
    });
  }

  const webhookUrl = process.env.CARTIO_INQUIRY_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(503).json({
      error: "Inquiry delivery is not configured yet.",
    });
  }

  try {
    const delivery = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "cartio.in",
        submittedAt: new Date().toISOString(),
        ...parsed.data,
      }),
    });

    if (!delivery.ok) {
      req.log.warn(
        { statusCode: delivery.status },
        "Inquiry webhook rejected submission",
      );
      return res.status(502).json({
        error: "The inquiry could not be delivered. Please email support@cartio.in.",
      });
    }

    return res.status(202).json({ status: "accepted" });
  } catch (error) {
    req.log.error({ err: error }, "Inquiry webhook request failed");
    return res.status(502).json({
      error: "The inquiry could not be delivered. Please email support@cartio.in.",
    });
  }
});

export default router;