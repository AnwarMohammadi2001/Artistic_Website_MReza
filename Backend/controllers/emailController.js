// controllers/emailController.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Message from "../models/Message.js";

dotenv.config();

// Store message in database (without sending email)
export const storeMessage = async (req, res) => {
  console.log("📧 Contact form submitted!");
  console.log("Request body:", req.body);

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Store message in database
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message,
      read: false,
    });

    console.log("✅ Message stored in database:", newMessage.id);

    // Try to send email (optional - can be removed if Gmail issues persist)
    try {
      await sendEmailNotification({ name, email, subject, message });
    } catch (emailError) {
      console.log("⚠️ Email notification failed, but message was stored");
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
      messageId: newMessage.id,
    });
  } catch (error) {
    console.error("❌ Error storing message:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Optional: Send email notification (keep your existing email logic)
const sendEmailNotification = async ({ name, email, subject, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 Email notifications disabled - no credentials");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.TO_EMAIL || process.env.EMAIL_USER,
      subject: `📧 New Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #4F46E5;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            Sent from your portfolio contact form.
          </p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email notification sent:", result.messageId);
  } catch (error) {
    console.error("❌ Email notification failed:", error.message);
    // Don't throw error - message is already stored in database
  }
};

// Get all messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
    });

    console.log(`📨 Retrieved ${messages.length} messages`);

    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single message
export const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Mark as read when fetched
    if (!message.read) {
      message.read = true;
      await message.save();
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("❌ Error fetching message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    await message.destroy();
    console.log("✅ Message deleted:", id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete all messages
export const deleteAllMessages = async (req, res) => {
  try {
    const count = await Message.destroy({
      where: {},
      truncate: true,
    });

    console.log(`✅ All messages deleted (${count} total)`);

    res.status(200).json({
      success: true,
      message: `All messages (${count}) deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error deleting all messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete messages",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
