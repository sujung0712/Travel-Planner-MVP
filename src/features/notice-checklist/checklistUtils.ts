import type { ChecklistItem, ChecklistProgress } from '../../types/travel';

export function calculateChecklistProgress(items: ChecklistItem[]): ChecklistProgress {
  const totalCount = items.length;
  const completedCount = items.filter((item) => item.completed).length;
  const remainingCount = totalCount - completedCount;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
    completedCount,
    totalCount,
    remainingCount,
    percentage,
  };
}

export function formatNoticeTimestamp(isoString: string): string {
  if (!isoString) {
    return '';
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}
