export function achievementToNumber(grade: string): number {
  switch (grade) {
    case "A": return 5;
    case "B": return 4;
    case "C": return 3;
    case "D": return 2;
    case "E": return 1;
    default: return 0;
  }
}

export function calcSemesterScore(
  subjects: { achievement: string; raw: number }[],
  semesterKey: string
): number {
  const count = subjects.length;
  if (count === 0) return 0;

  const totalAchievement = subjects.reduce((sum, subj) => sum + achievementToNumber(subj.achievement), 0);
  const totalRaw = subjects.reduce((sum, subj) => sum + subj.raw, 0);

  const avgAchievement = totalAchievement / count;
  const avgRaw = totalRaw / count;

  let score = 0;
  let max = 0;

  switch (semesterKey) {
    case "grade1_2":
      score = 4 + avgAchievement * 0.8 + avgRaw * 0.04;
      max = 12;
      break;
    case "grade2_1":
    case "grade2_2":
      score = 8 + avgAchievement * 1.6 + avgRaw * 0.08;
      max = 24;
      break;
    case "grade3_1":
    case "grade3_2":
      score = 10 + avgAchievement * 2 + avgRaw * 0.1;
      max = 30;
      break;
    default:
      return 0;
  }

  return parseFloat(Math.min(max, score).toFixed(3));
}

export function calcPEArtScore(peArts: { [key: string]: { [subjectKey: string]: number } }): number {
  let A = 0, B = 0, C = 0;
  let subjectCount = 0;

  for (const semester of Object.values(peArts)) {
    for (const score of Object.values(semester)) {
      if (score === 5) {
        A++;
        subjectCount++;
      } else if (score === 4) {
        B++;
        subjectCount++;
      } else if (score === 3) {
        C++;
        subjectCount++;
      }
    }
  }

  if (subjectCount === 0) return 0;

  const value = 10 + 20 * ((3 * A + 2 * B + 1 * C) / (3 * subjectCount));
  return parseFloat(Math.min(30, value).toFixed(3));
}

export function calcAttendanceScore(att: { g1: number; g2: number; g3: number }): number {
  const totalDays = att.g1 + att.g2 + att.g3;
  return Math.max(0, 20 - totalDays);
}

export function calcVolunteerScore(hours: number): number {
  if (hours >= 15) return 20;
  if (hours === 14) return 19;
  if (hours === 13) return 18;
  if (hours === 12) return 17;
  if (hours === 11) return 16;
  if (hours === 10) return 15;
  if (hours === 9) return 14;
  if (hours === 8) return 13;
  return 12; // 7시간 이하
}

export function calcSchoolActivityScore(act: { awards: number; roles: number }): number {
  const base = 8;
  const awardPoints = act.awards * 0.5;
  const rolePoints = act.roles * 0.1;
  return Math.min(10, parseFloat((base + awardPoints + rolePoints).toFixed(2)));
}