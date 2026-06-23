import AddressRepository from "../repositories/addressRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";

class AddressController {
  async createAddress(req: Request, res: Response) {
    try {
      const {
        addressLine1,
        addressLine2,
        city,
        country,
        zipCode,
        user: { id: userId },
      } = req.body;

      const address = await AddressRepository.addAddress({
        userId: Number(userId),
        addressLine1,
        addressLine2,
        city,
        country,
        zipCode,
      });

      return res.status(201).json({
        message: "Address created successfully",
        data: address,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllUserAddress(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const address = await AddressRepository.getUserAddresses(Number(userId));

      return res.status(200).json({
        message: "Addresses Fetched successfully",
        data: address,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAddressById(req: Request, res: Response) {
    try {
      const { addressId } = req.params;
      const address = await AddressRepository.getAddressById(Number(addressId));

      if (!address) {
        res.status(404).json({
          error: [
            {
              path: "addressId",
              msg: "We couldn't find that address. Please double-check and enter a valid Address",
            },
          ],
        });
        return;
      }

      return res.status(200).json({
        message: "Address Fetched successfully",
        data: address,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateAddress(req: Request, res: Response) {
    try {
      const { addressLine1, addressLine2, city, country, zipCode } = req.body;
      const { addressId } = req.params;
      const address = await AddressRepository.updateAddress(Number(addressId), {
        addressLine1,
        addressLine2,
        city,
        country,
        zipCode,
      });

      return res.status(206).json({
        message: "Address updated successfully",
        data: address,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteAddress(req: Request, res: Response) {
    try {
      const { addressId } = req.params;
      const address = await AddressRepository.deleteAddress(Number(addressId));

      return res.status(200).json({
        message: "Address has been removed",
        data: address,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new AddressController();
