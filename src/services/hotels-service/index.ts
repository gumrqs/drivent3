import { notFoundError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotels-repository ";
import { TicketStatus } from "@prisma/client";
import enrollmentRepository from "@/repositories/enrollment-repository";

async function getTicketsWithHotels(userId: number) {
  const enrollment = await hotelRepository.findEnrollment(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  const ticketTypes = await ticketRepository.findTickeWithTypeById(ticket.id);

  if(ticketTypes.TicketType.includesHotel === false || ticketTypes.status === "RESERVED") {
    throw notFoundError();
  }

  const hotels = await hotelRepository.findHotels();
  
  return hotels;
}

async function findRooms(userId: number, hotelId: number) {
  const enrollment = await hotelRepository.findEnrollment(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  const ticketTypes = await ticketRepository.findTickeWithTypeById(ticket.id);

  if(ticketTypes.TicketType.includesHotel === false || ticketTypes.status === "RESERVED") {
    throw notFoundError();
  }

  console.log("le erro");
  const rooms = await hotelRepository.findRoomsByHotelId(hotelId);

  return rooms;
}
const hotelsService = {
  getTicketsWithHotels,
  findRooms
  
};

export default hotelsService;
