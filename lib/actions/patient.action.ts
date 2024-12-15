"use server";

import { Query, ID } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, databases, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { ENDPOINT } from "../appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create(ID.unique(), user.email, user.phone, undefined, user.name);
        return newUser;
    } catch (error: any) {
        if (error?.code === 409) {
            const existingUsers = await users.list([
                Query.equal("email", [user.email]),
            ]);
            return existingUsers.users[0];
        }
        throw error; // Re-throw for other errors
    }
};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get(userId)

        return parseStringify(user)
    } catch (err) {
        console.log(err)
    }
}

export const registerPatient = async ({
    identificationDocument,
    ...patient
}: RegisterUserParams) => {
    try {
        // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
        let file;
        if (identificationDocument) {
            const inputFile =
                identificationDocument &&
                InputFile.fromBuffer(
                    identificationDocument?.get("blobFile") as Blob,
                    identificationDocument?.get("fileName") as string
                );

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
        }

        const newPatient = await databases.createDocument(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocumentId: file?.$id ? file.$id : null,
                identificationDocumentUrl: file?.$id
                    ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
                    : null,
                ...patient,
            }
        );

        return parseStringify(newPatient);
    } catch (error) {
        console.error("An error occurred while creating a new patient:", error);
    }
};
export const getPatient = async (userId: string) => {
    try {
        const patients = await databases.listDocuments(
            DATABASE_ID!,
            PATIENT_COLLECTION_ID!,
            [Query.equal('userId', userId)]
        )

        return parseStringify(patients.documents[0])
    } catch (err) {
        console.log(err)
    }
}