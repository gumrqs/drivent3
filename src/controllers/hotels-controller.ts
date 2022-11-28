import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const hotels = await hotelsService.getTicketsWithHotels(userId);

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.send(httpStatus.NOT_FOUND);
  }
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const  hotelId = Number(req.params.hotelId);

  try {
    const rooms = await hotelsService.findRooms(userId, hotelId);

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
