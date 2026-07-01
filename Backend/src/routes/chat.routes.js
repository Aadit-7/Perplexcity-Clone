import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  getChats,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const chatRouter = Router();

/**
 * @route POST
 */
chatRouter.post("/message", authUser, sendMessage);

/**
 * @router GET
 * @description Get all the chats of the user
 */
chatRouter.get("/", authUser, getChats);

/**
 * @router GET
 * @description Get all the messages of the user
 */
chatRouter.get("/:chatId/messages", authUser, getMessages);

export default chatRouter;
