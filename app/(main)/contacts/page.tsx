"use client";
import { api } from "@/convex/_generated/api";
import { useAsyncQuery } from "@/hooks/useAsyncQuery";
import { useQuery } from "convex/react";

export default function ContactsPage() {
  const { data, error, isLoading } = useAsyncQuery(api.contacts.getAllContacts);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  console.log(data);

  return <div>ContactsPage</div>;
}
