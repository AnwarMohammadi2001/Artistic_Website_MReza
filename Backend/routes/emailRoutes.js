// routes/emailRoutes.js
import express from "express";
import {
  storeMessage,
  getMessages,
  getMessage,
  deleteMessage,
  deleteAllMessages,
} from "../controllers/emailController.js";

const router = express.Router();

// Contact form submission
router.post("/", storeMessage);

// Message management
router.get("/", getMessages);
router.get("/:id", getMessage);
router.delete("/:id", deleteMessage);
router.delete("/", deleteAllMessages);

export default router;
