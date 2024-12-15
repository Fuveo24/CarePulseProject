import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PatientForm } from "@/components/forms/PatientForm";
import Link from "next/link";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.action";
import * as Sentry from "@sentry/nextjs"


export default async function NewAppointment({params: {userId}}: SearchParamProps) {
    const patient = await getPatient(userId);
    Sentry.metrics.set("user_view_new-appointment", patient.name)
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-[480px] flex-1 justify-between">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="patient"
                        className="mb-12 h-10 w-fit"
                    />

                    <AppointmentForm type="create" userId={userId} patientId={patient.$id}></AppointmentForm>

                    <p className="copyright py-12 mt-10">
                        © 2024 CarePluse
                    </p>

                </div>
            </section>

            <Image
                src="/assets/images/appointment-img.png"
                height={1000}
                width={1000}
                alt="appointment-img"
                className="side-img max-w-[390px] bg-bottom"
            />
        </div>
    );
};
