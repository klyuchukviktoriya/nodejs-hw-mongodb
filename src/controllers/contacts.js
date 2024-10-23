import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const userId = req.user._id;
    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        userId,
    });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await getContactById(contactId, userId);

    if (!contact) {
        throw createHttpError(404, "Contact not found");
    }
    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    const { name, phoneNumber, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
        throw createHttpError(400, "Missing required fields: name, phoneNumber, contactType");
    }

    const userId = req.user._id;
    const contact = await createContact({ ...req.body, userId });

    if (!contact) {
        throw createHttpError(500, "Failed to create contact");
    }

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const patchContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;

    const result = await updateContact(contactId, req.body, userId);

    if (!result) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;

    const contact = await deleteContact(contactId, userId);

    if (!contact) {
        throw createHttpError(404, "Contact not found");
    }

    res.status(204).send();
};
