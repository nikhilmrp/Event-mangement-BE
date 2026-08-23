import { CreateClientDto, UpdateClientDto } from "@dto/client.dto";
import clientService from "@services/client.service";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import { asyncHandler } from "@utils/asyncHandler";
import { Request, Response } from "express";

class ClientController {
  createClient = asyncHandler(async (req: Request, res: Response) => {
    const { agent_id, name, email, phone, address, location_id }: CreateClientDto = req.body;
    const client = await clientService.createClient(req.user!, {
      user_id: req.user!.id,
      agent_id,
      name,
      email,
      phone,
      address,
      location_id,
    });
    res.json(new ApiResponse(201, client, "Client created successfully"));
  });

  updateClient = asyncHandler(async (req: Request, res: Response) => {
    const clientId = Number(req.params.clientId);
    if (isNaN(clientId)) {
      throw ApiError.badRequest("Invalid client id");
    }
    const { name, email, phone, address, location_id }: UpdateClientDto = req.body;
    const client = await clientService.updateClient(req.user!, {
      user_id: req.user!.id,
      client_id: clientId,
      name,
      email,
      phone,
      address,
      location_id,
    });
    res.json(new ApiResponse(200, client, "Client updated successfully"));
  });

  getClients = asyncHandler(async (req: Request, res: Response) => {
    const clients = await clientService.getClientsWithNestedEventsAndVendors(req.user!);
    res.json(new ApiResponse(200, clients, "Clients fetched successfully"));
  });
}

export default new ClientController();
