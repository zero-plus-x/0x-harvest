import { specialTasks } from "../../lib/api";
import { TaskWithProject } from "../../types";
import { isSoftwareDevTask } from "../../utils";

const TaskName = ({ entry }: { entry: TaskWithProject }) => {
  const specialTask = specialTasks[entry.taskId];

  if (specialTask) {
    return (
      <>
        {specialTask.emoji} {specialTask.displayName || entry.taskName}{" "}
        {specialTask.emoji}
      </>
    );
  }
  if (isSoftwareDevTask(entry.taskName)) {
    // most work projects are called "John - Spotify"
    return <>Work ({entry.projectName.split(" - ")[1] || entry.projectName})</>;
  }
  return <>{entry.taskName}</>;
};

export default TaskName;
