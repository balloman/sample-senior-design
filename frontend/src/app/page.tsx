"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

const customerQueryKey = "customers";
const baseUrl = "http://localhost:5102";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface CreateCustomerRequest {
  name: string;
  email: string;
}

// gcTime; staleTime;

function useCustomersQuery() {
  return useQuery({
    queryKey: [customerQueryKey],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/customers`);
      return response.json() as Promise<Customer[]>;
    },
  });
}

function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCustomer: CreateCustomerRequest) => {
      const response = await fetch(`${baseUrl}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });
      return response.json() as Promise<Customer>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [customerQueryKey] });
    },
  });
}

function useCustomerQuery(id: string) {
  return useQuery({
    queryKey: [customerQueryKey, id],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/customers/${id}`);
      return response.json() as Promise<Customer>;
    },
  });
}

export default function Home() {
  const customersQuery = useCustomersQuery();
  const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
    name: "",
    email: "",
  });
  const [customerId, setCustomerId] = useState("");
  const createCustomerMutation = useCreateCustomerMutation();
  const customerQuery = useCustomerQuery(customerId);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      Customers
      <div>Create Customer: </div>
      <div className="flex flex-row mb-3">
        <p>Customer Name: </p>
        <input
          type="text"
          className="text-black"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer((customer) => {
              return { ...customer, name: e.target.value };
            })
          }
        />
      </div>
      <div className="flex flex-row mb-3">
        <p>Customer Email: </p>
        <input
          type="text"
          className="text-black"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer((customer) => {
              return { ...customer, email: e.target.value };
            })
          }
        />
      </div>
      <button
        className="bg-white text-black p-4 rounded hover:bg-slate-500 my-5"
        onClick={(e) => {
          e.preventDefault();
          createCustomerMutation.mutate(newCustomer);
          setNewCustomer({ name: "", email: "" });
        }}
      >
        Create!
      </button>
      {customersQuery.isLoading && <p>Loading...</p>}
      <ol>
        {customersQuery.data?.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.email}
          </li>
        ))}
      </ol>
      <div className="flex flex-row my-5">
        <p>Customer Id: </p>
        <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="text-black" />
      </div>
      {customerQuery.isError && <p>Error: {customerQuery.error.message}</p>}
      {customerQuery.isLoading && <p>Loading...</p>}
      {customerQuery.isSuccess && (
        <div>
          <p>
            {customerQuery.data?.name} - {customerQuery.data?.email}
          </p>
        </div>
      )}
    </main>
  );
}
