'use server'

import { Query } from "node-appwrite";

import { ID } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/type/appwrite.types";
import { parse } from "path";
import { revalidatePath } from "next/cache";
import { formatDateTime } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const NewAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );

        return parseStringify(NewAppointment);
    }
    catch (err) {
        console.log(err)
    }
}
export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )
        return parseStringify(appointment);
    } catch (err) {
        console.log(err)
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }
        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === "scheduled") {
                acc.scheduledCount += 1
            } else if (appointment.status === "pending") {
                acc.pendingCount += 1
            } else if (appointment.status === "cancelled") {
                acc.cancelledCount += 1
            }

            return acc
        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }

        return parseStringify(data)
    } catch (err) {
        console.log(err)
    }
}
export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )
        if (!updatedAppointment) {
            throw new Error('Appointment not found')
        }

        const smsMessgae = `Hi, it's Carepulse. 
        ${type === "schedule" ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}` :
                `We regret to inform you that your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
            }
        `

        await sendSMSNotification(userId, smsMessgae)
        revalidatePath('/admin');
        return parseStringify(updatedAppointment)
    } catch (err) {
        console.log(err)
    }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )
        return parseStringify(message)
    } catch (error) {
        console.log(error)
    }
}