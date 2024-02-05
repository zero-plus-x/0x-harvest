import { Statistic } from "antd";
import { projects } from "../../lib/api";
import { TimeEntry } from "../../types";
import { usePrimaryTask } from "../../utils";
import TaskName from "./TaskName";

const TaskHoursStatistic = ({ entries }: { entries?: TimeEntry[] }) => {
  const primaryTask = usePrimaryTask();
  if (!primaryTask) {
    return null;
  }
  const clientHours = entries
    ?.filter((e) => e.task.id === primaryTask?.taskId)
    .reduce((acc, entry) => acc + entry.hours, 0);

  return (
    <Statistic
      loading={!entries}
      title={<TaskName entry={primaryTask} />}
      value={clientHours}
      suffix="h"
    />
  );
};

export default TaskHoursStatistic;
