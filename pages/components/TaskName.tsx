import { specialTasks } from "../../lib/api";
import { TimeEntry } from "../../types";
import { isSoftwareDevTask } from "../../utils";

const TaskName = ({ entry }: { entry: TimeEntry }) => {
  const specialTask = specialTasks[entry.task.id];

  if (specialTask) {
    return (
      <>
        {specialTask.emoji} {specialTask.displayName || entry.task.name}{" "}
        {specialTask.emoji}
      </>
    );
  }
  if (isSoftwareDevTask(entry.task.name)) {
    return <>Work ({entry.project.name})</>;
  }
  return <>{entry.task.name}</>;
};

export default TaskName;
