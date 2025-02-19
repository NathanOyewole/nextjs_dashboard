'use server';

import { State, Sql } from "postgres";
import { z } from "zod";
import { CreateInvoice } from "../ui/invoices/buttons";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createInvoice as importedCreateInvoice } from '@/app/lib/actions';

 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
      
    }
    throw error;
  }
}

const CreateInvoiceSchema = z.object({
  customerId: z.string({ invalid_type_error: 'Please select a customer.' }),
  amount: z.number({ invalid_type_error: 'Please enter a valid amount.' }),
  status: z.string(),
});

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
 
  };
  
  }

  
  export const deleteInvoice = () => {
    // function implementation
  };
  

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
