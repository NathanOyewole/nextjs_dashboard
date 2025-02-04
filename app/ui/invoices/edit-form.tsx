'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import { updateInvoice } from '@/app/lib/actions'; // Ensure this path and export are correct
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
 
  return <form action={updateInvoiceWithId}>{/* ... */}</form>;
}
