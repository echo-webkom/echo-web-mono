"use server";

import { apiServer } from "@/api/server";

type AddBookingInput = {
  title: string;
  startTime: string;
  endTime: string;
  userId: string;
};

type AddBookingResponse = {
  success: boolean;
  booking?: {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    userId: string;
  };
  message?: string;
};

export async function addBooking(data: AddBookingInput): Promise<AddBookingResponse> {
  const res = await apiServer.post("admin/bookings", { json: data });
  return await res.json<AddBookingResponse>();
}
