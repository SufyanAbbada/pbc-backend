import CategoryRepository from "../repositories/CategoryRepository";
import TransactionCategoryRepository from "../repositories/TransactionCategoryRepository";
import { CategoryType } from "../common/enums";
import TicketCategoryRepository from "../repositories/TicketCategoryRepository";

const generateSlug = async (
  name: string,
  category: CategoryType = CategoryType.GENERAL,
): Promise<string> => {
  let slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  let uniqueSlug = slug;
  let count = 1;

  const slugExists = async (slugToCheck: string): Promise<boolean> => {
    if (category === CategoryType.TRANSACTION) {
      return TransactionCategoryRepository.slugExists(slugToCheck);
    } else if (category === CategoryType.TICKET) {
      return TicketCategoryRepository.slugExists(slugToCheck);
    }
    return CategoryRepository.slugExists(slugToCheck);
  };

  while (await slugExists(uniqueSlug)) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

export default generateSlug;
