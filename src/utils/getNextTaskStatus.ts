import { TaskStatus } from "../common/enums";

const getNextTaskStatus = (currentStatus: TaskStatus) => {
  return Object.keys(TaskStatus)[
    Object.keys(TaskStatus).indexOf(currentStatus) + 1
  ];
};

export default getNextTaskStatus;
