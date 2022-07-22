import { Statistic } from "antd";
import { projects } from "../../lib/api";
import { TimeEntry } from "../../types";
import { usePrimaryTask } from "../../utils";

const TaskHoursStatistic = ({ entries }: { entries?: TimeEntry[] }) => {
  const primaryTask = usePrimaryTask();
  if (!primaryTask) {
    return null;
  }
  const clientHours = entries
    ?.filter(
      (e) =>
        e.task.id === primaryTask?.taskId &&
        // client task is not part of the default absence/0+x internal projects
        !projects[e.project.id]
    )
    .reduce((acc, entry) => acc + entry.hours, 0);

  return (
    <Statistic
      loading={!entries}
      title={`Logged hours for ${primaryTask.projectName}`}
      value={clientHours}
    />
  );
};

export default TaskHoursStatistic;
