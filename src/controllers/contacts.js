import createHttpError from "http-errors";
import { createContact, deleteContact, getAllContacts, getContactById, updateContact } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
    });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

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
    const contact = await createContact(req.body);
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    if (!name || !phoneNumber || !contactType) {
        throw createHttpError(400, "Missing required fields: name, phoneNumber, contactType");
    }

    if (!contact) {
        throw createHttpError(500, "Failed to create contact");
    }

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.contact,
    });
};


export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
};