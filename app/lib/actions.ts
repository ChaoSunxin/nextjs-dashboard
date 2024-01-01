'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { custom, z } from 'zod';


const FormScheme = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['paid', 'pending']),
    date: z.string(),
})

const CreateInvoice = FormScheme.omit({ id: true, date: true });

/**
 * 创建用户发票
 * @param formData 发票表单
 */
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountCent = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountCent}, ${status}, ${date})
    `;

    // 清除nextjs 客户端缓存并向服务器触发新请求
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormScheme.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountCent = amount * 100;


    await sql`
    UPDATE invoices 
    SET customer_id = ${customerId}, amount = ${amountCent}, status = ${status} 
    WHERE id = ${id}`;

    // 清除nextjs 客户端缓存并向服务器触发新请求
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
    await sql`
    DELETE FROM invoices WHERE id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
}