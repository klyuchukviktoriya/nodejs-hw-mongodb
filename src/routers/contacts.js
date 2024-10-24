import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
    getContactsController,
    getContactByIdController,
    createContactController,
    patchContactController,
    deleteContactController
} from "../controllers/contacts.js";
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const contactsRouter = Router();

contactsRouter.use("/", authenticate);

contactsRouter.get("/",
    ctrlWrapper(getContactsController),);

contactsRouter.get("/:contactId",
    isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post("/",
    validateBody(createContactSchema),
    upload.single('photo'),
    ctrlWrapper(createContactController));

contactsRouter.patch("/:contactId",
    validateBody(updateContactSchema),
    upload.single('photo'),
    ctrlWrapper(patchContactController));

contactsRouter.delete("/:contactId", ctrlWrapper(deleteContactController));

export default contactsRouter;