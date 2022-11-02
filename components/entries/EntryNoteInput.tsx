import { Input, message } from "antd";
import { useState } from "react";
import { updateTimeEntryNote } from "../../lib/api";
import { TimeEntry } from "../../types";

export const EntryNoteInput = ({
  entry,
  loadMonth,
  setEntries,
}: {
  entry: TimeEntry;
  loadMonth: () => Promise<void>;
  setEntries: (
    fn: (e: TimeEntry[] | undefined) => TimeEntry[] | undefined
  ) => void;
}) => {
  const [notes, setNotes] = useState(entry.notes || "");
  const [loading, setLoading] = useState(false);

  if (entry.is_locked) {
    return <>Entry is locked in Harvest ({entry.locked_reason})</>;
  }
  return (
    <Input
      disabled={loading || entry.is_locked}
      value={notes}
      onChange={(e) => setNotes(e.currentTarget.value)}
      placeholder="Notes"
      onBlur={async () => {
        if (notes === entry.notes) {
          return;
        }
        setLoading(true);
        const response = await updateTimeEntryNote(entry.id, notes);
        setLoading(false);
        if (response.status === 200) {
          message.success("Note saved!");
          setEntries((prevEntries) => {
            if (!prevEntries) {
              return prevEntries;
            }
            const entriesCopy = [...prevEntries];
            const updatedEntryIdx = entriesCopy.findIndex(
              (e) => e.id === response.data.id
            );
            entriesCopy[updatedEntryIdx] = response.data;
            return entriesCopy;
          });
        } else {
          message.error("Something went wrong while saving note.");
          await loadMonth();
        }
      }}
    />
  );
};

export default EntryNoteInput;
