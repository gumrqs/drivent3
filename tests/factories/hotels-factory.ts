import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: "Casa Do Estudante",
      image: "imagem",
    }
  });
}
export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: "quartinho1",
      capacity: 2,
      hotelId: hotelId,
    }
  });
}
