import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { string } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketTypeWithHotel, createTicket, createPayment, createHotel, createTicketTypeWithoutHotel, createRoom } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have a Hotel ticket yet", async () => {
      const user = await createUser();
     
      const token = await generateValidToken();

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithoutHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 404 when user doesnt have a ticket yet", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.RESERVED);
  
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and without existing hotels data", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.PAID);

      const payment = await createPayment(ticket.id, ticketTypeHotel.price);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
    });

    it("should respond with status 200 and with existing hotels data", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.PAID);

      const payment = await createPayment(ticket.id, ticketTypeHotel.price);

      const hotel = await createHotel();

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }]);
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesnt have a Hotel ticket yet", async () => {
      const user = await createUser();
     
      const token = await generateValidToken();

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithoutHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 404 when user doesnt have page a ticket yet", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.RESERVED);
  
      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 and hotelId doesn't exists", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.RESERVED);

      const payment = await createPayment(ticket.id, ticketTypeHotel.price);

      const hotel = await createHotel();

      const response = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 and without existing rooms data", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.PAID);

      const payment = await createPayment(ticket.id, ticketTypeHotel.price);

      const hotel = await createHotel();

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
    });

    it("should respond with status 200 and with existing rooms data", async () => {
      const user = await createUser();

      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);

      const ticketTypeHotel = await createTicketTypeWithHotel();

      const ticket = await createTicket(enrollment.id, ticketTypeHotel.id, TicketStatus.PAID);

      const payment = await createPayment(ticket.id, ticketTypeHotel.price);

      const hotel = await createHotel();

      const room = await createRoom(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Rooms: [{
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }]
      }]);
    });
  });
});
