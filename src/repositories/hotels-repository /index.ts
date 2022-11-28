import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function findHotels() {
  return prisma.hotel.findMany();
}
async function findEnrollment(userId: number) {
  return prisma.enrollment.findFirst({
    where: {
      userId: userId
    }
  });
}
async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findMany({
    where: {
      id: hotelId
    }, include: {
      Rooms: true
    }
  });
}

const hotelRepository = {
  findHotels,
  findEnrollment,
  findRoomsByHotelId
};

export default hotelRepository;
