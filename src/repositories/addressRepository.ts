import prisma from "../config/prismaClient";
import { Address } from "../common/types";

class AddressRepository {
  async addAddress(addressData: Address) {
    return await prisma.address.create({ data: addressData });
  }

  async getUserAddresses(userId: number) {
    return await prisma.address.findMany({ where: { userId } });
  }

  async getAddressById(id: number) {
    return await prisma.address.findUnique({ where: { id } });
  }

  async updateAddress(addressId: number, addressData: Partial<Address>) {
    return await prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
  }

  async deleteAddress(addressId: number) {
    return await prisma.address.delete({ where: { id: addressId } });
  }

  async getAddress(
    userId: number,
    addressLine1: string,
    addressLine2: string,
    city: string,
    country: string,
    zipCode: string,
  ) {
    return await prisma.address.findFirst({
      where: {
        userId: userId,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        country: country,
        zipCode: zipCode,
      },
    });
  }

  async getAddressByAddressIdAndUserId(addressId: number, userId: number) {
    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId,
      },
    });
    return !!address;
  }
}
export default new AddressRepository();
