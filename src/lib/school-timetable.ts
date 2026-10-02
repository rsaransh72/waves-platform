// Timetable clashes: a class, a teacher or a room can only be in one period at a time.
import { formatTime } from "@/lib/india";

export type Period = {
  id?: string;
  class_id: string;
  teacher_id: string;
  day_of_week: string;
  subject: string;
  start_time: string;
  end_time: string;
  room_number?: string | null;
  school_classes?: { name: string; section: string } | null;
  school_teachers?: { first_name: string; last_name: string | null } | null;
};

export const classLabel = (schoolClass?: { name: string; section: string } | null) =>
  schoolClass ? `${schoolClass.name} - ${schoolClass.section}` : "another class";

// "Room 12", "room 12" and "12" are the same room.
export const roomKey = (room?: string | null) => (room ?? "").trim().toLowerCase().replace(/^room\s*/, "");
export const roomLabel = (room?: string | null) => (roomKey(room) ? `Room ${(room ?? "").trim().replace(/^room\s*/i, "")}` : "");

// Postgres returns "09:00:00"; the form gives "09:00".
const minutes = (time: string) => {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
};

export function findClashes(period: Period, existing: Period[]): string[] {
  const start = minutes(period.start_time);
  const end = minutes(period.end_time);
  const room = roomKey(period.room_number);
  const clashes: string[] = [];

  for (const other of existing) {
    if (other.id && other.id === period.id) continue;
    if (other.day_of_week !== period.day_of_week) continue;
    if (!(start < minutes(other.end_time) && minutes(other.start_time) < end)) continue;
    const when = `${formatTime(other.start_time)} – ${formatTime(other.end_time)}`;
    const teacher = other.school_teachers ? `${other.school_teachers.first_name} ${other.school_teachers.last_name ?? ""}`.trim() : "This teacher";
    if (other.class_id === period.class_id) clashes.push(`${classLabel(other.school_classes)} already has ${other.subject} at ${when}.`);
    if (other.teacher_id === period.teacher_id) clashes.push(`${teacher} is already teaching ${classLabel(other.school_classes)} at ${when}.`);
    if (room && roomKey(other.room_number) === room && other.class_id !== period.class_id) clashes.push(`${roomLabel(other.room_number)} is already used by ${classLabel(other.school_classes)} at ${when}.`);
  }
  return clashes;
}
