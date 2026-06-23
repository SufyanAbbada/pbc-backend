import { TicketStatus } from "../common/enums";

const getNextTicketStatus = (currentStatus: TicketStatus) => {
  return Object.keys(TicketStatus)[
    Object.keys(TicketStatus).indexOf(currentStatus) + 1
  ];
};

export default getNextTicketStatus;
