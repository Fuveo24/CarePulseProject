import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import { DataTable } from '@/components/DataTable'
import { columns } from '@/components/table/columns'



const Admin = async () => {
    const appointments = await getRecentAppointmentList()
    return (
        <div className='mx-auto flex max-w-7xl flex-col space-y-14'>
            <header className="admin-header">
                <Link href="/" className="cursor-pointer">
                    <Image src="/assets/icons/logo-full.svg" alt='logo' height={32} width={32} className='h-8 w-fit'></Image>
                </Link>
                <p className="text-16-semibold">Admin Dashboard</p>
            </header>
            <main className="admin-main">
                <section className="w-full space-y-4">
                    <h1 className="header">Welcome ✋</h1>
                    <p className="text-dark-700">Start the day with managing new appointment</p>
                </section>
                <section className="admin-stat">
                    <StatCard type="appointments" count={appointments.scheduledCount} label="Scheduled appointments" icon="/assets/icons/appointments.svg"></StatCard>
                    <StatCard type="pending" count={appointments.pendingCount} label="Pending appointments" icon="/assets/icons/pending.svg"></StatCard>
                    <StatCard type="cancelled" count={appointments.cancelledCount} label="Cancelled appointments" icon="/assets/icons/cancelled.svg"></StatCard>
                </section>

                <DataTable data={appointments.documents} columns={columns}></DataTable>
            </main>
        </div>
    )
}

export default Admin