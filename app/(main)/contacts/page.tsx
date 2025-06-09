"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function ContactsPage() {
  const data = useQuery(api.contacts.getAllContacts);

  return <div>ContactsPage</div>;
}
