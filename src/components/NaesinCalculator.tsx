import React, { useRef, useEffect } from "react";
import { useState } from "react";
import {
  achievementToNumber,
  calcSemesterScore,
  calcPEArtScore,
  calcAttendanceScore,
  calcVolunteerScore,
  calcSchoolActivityScore,
} from "../utils/calculate";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NaesinCalculator() {
  const [scores, setScores] = useState({
    grade1_2: [
      { name: "국어", achievement: "A", raw: 90 },
      { name: "수학", achievement: "A", raw: 90 },
      { name: "영어", achievement: "A", raw: 90 },
      { name: "사회", achievement: "A", raw: 90 },
      { name: "과학", achievement: "A", raw: 90 },
      { name: "도덕", achievement: "A", raw: 90 },
      { name: "기술가정", achievement: "A", raw: 90 },
    ],
    grade2_1: [
      { name: "국어", achievement: "A", raw: 90 },
      { name: "수학", achievement: "A", raw: 90 },
      { name: "영어", achievement: "A", raw: 90 },
      { name: "역사", achievement: "A", raw: 90 },
      { name: "과학", achievement: "A", raw: 90 },
      { name: "도덕", achievement: "A", raw: 90 },
      { name: "정보", achievement: "A", raw: 90 },
      { name: "한문", achievement: "A", raw: 90 },
    ],
    grade2_2: [
      { name: "국어", achievement: "A", raw: 90 },
      { name: "수학", achievement: "A", raw: 90 },
      { name: "영어", achievement: "A", raw: 90 },
      { name: "역사", achievement: "A", raw: 90 },
      { name: "과학", achievement: "A", raw: 90 },
      { name: "도덕", achievement: "A", raw: 90 },
      { name: "정보", achievement: "A", raw: 90 },
      { name: "한문", achievement: "A", raw: 90 },
    ],
    grade3_1: [
      { name: "국어", achievement: "A", raw: 90 },
      { name: "수학", achievement: "A", raw: 90 },
      { name: "영어", achievement: "A", raw: 90 },
      { name: "사회", achievement: "A", raw: 90 },
      { name: "역사", achievement: "A", raw: 90 },
      { name: "과학", achievement: "A", raw: 90 },
      { name: "중국어", achievement: "A", raw: 90 },
      { name: "기술가정", achievement: "A", raw: 90 },
    ],
    grade3_2: [
      { name: "국어", achievement: "A", raw: 90 },
      { name: "수학", achievement: "A", raw: 90 },
      { name: "영어", achievement: "A", raw: 90 },
      { name: "사회", achievement: "A", raw: 90 },
      { name: "역사", achievement: "A", raw: 90 },
      { name: "과학", achievement: "A", raw: 90 },
      { name: "중국어", achievement: "A", raw: 90 },
      { name: "기술가정", achievement: "A", raw: 90 },
    ],
    peArts: {
      grade1_2: { A: 0, B: 0, C: 0 },
      grade2_1: { A: 0, B: 0, C: 0 },
      grade2_2: { A: 0, B: 0, C: 0 },
      grade3_1: { A: 0, B: 0, C: 0 },
      grade3_2: { A: 0, B: 0, C: 0 },
    } as { [key: string]: { [subjectKey: string]: number } },
    attendance: { g1: 0, g2: 0, g3: 0 },
    volunteer: 0,
    schoolActivities: { awards: 0, roles: 0 },
  });

  const [totalScore, setTotalScore] = useState(0);

  // 세부 평가 결과 breakdown 토글 상태
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    grade1_2: true,
    grade2_1: false,
    grade2_2: false,
    grade3_1: false,
    grade3_2: false,
  });

  const [semesterScores, setSemesterScores] = useState({
    g1_2: 0,
    g2_1: 0,
    g2_2: 0,
    g3_1: 0,
    g3_2: 0,
  });

  const breakdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showBreakdown && breakdownRef.current) {
      breakdownRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [totalScore]);

  const [darkMode, setDarkMode] = useState(false);
  // Remember darkMode state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored) setDarkMode(stored === "true");
  }, []);
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);
  // 계산 버튼 로딩 UX
  const [isCalculating, setIsCalculating] = useState(false);


  function handleCalculate(): void {
    setIsCalculating(true);
    setTimeout(() => {
      const g1_2 = calcSemesterScore(scores.grade1_2, "grade1_2");
      const g2_1 = calcSemesterScore(scores.grade2_1, "grade2_1");
      const g2_2 = calcSemesterScore(scores.grade2_2, "grade2_2");
      const g3_1 = calcSemesterScore(scores.grade3_1, "grade3_1");
      const g3_2 = calcSemesterScore(scores.grade3_2, "grade3_2");
      const peArtsScore = calcPEArtScore(scores.peArts);
      const attendanceScore = calcAttendanceScore(scores.attendance);
      const volunteerScore = calcVolunteerScore(scores.volunteer);
      const activityScore = calcSchoolActivityScore(scores.schoolActivities);

      const total =
        g1_2 +
        g2_1 +
        g2_2 +
        g3_1 +
        g3_2 +
        peArtsScore +
        attendanceScore +
        volunteerScore +
        activityScore;

      setSemesterScores({ g1_2, g2_1, g2_2, g3_1, g3_2 });
      setTotalScore(parseFloat(total.toFixed(3)));
      setShowBreakdown(true);
      setIsCalculating(false);
    }, 300);
  }

  function handleAddSubject(gradeKey: keyof typeof scores): void {
    const updated = { ...scores };
    if (Array.isArray(updated[gradeKey])) {
      (updated[gradeKey] as { name: string; achievement: string; raw: number }[]).push({
        name: '',
        achievement: 'A',
        raw: 90,
      });
      setScores(updated);
    }
  }

  function handleChangeSubject(
    gradeKey: keyof typeof scores,
    index: number,
    field: "name" | "achievement" | "raw",
    value: string
  ): void {
    const updated = { ...scores };
    if (Array.isArray(updated[gradeKey])) {
      if (field === "raw") {
        (updated[gradeKey] as { name: string; achievement: string; raw: number }[])[index][field] = parseFloat(value);
      } else {
        (updated[gradeKey] as { name: string; achievement: string; raw: number }[])[index][field] = value as string;
      }
      setScores(updated);
    }
  }

  function handleSimpleChange(path: string, value: string): void {
    const updated = { ...scores };
    const keys = path.split(".");
    const num = parseFloat(value);

    if (isNaN(num)) return;

    if (keys.length === 2) {
      (updated as any)[keys[0]][keys[1]] = num;
    } else if (keys.length === 3) {
      (updated as any)[keys[0]][keys[1]][keys[2]] = num;
    }
    setScores(updated);
  }

  // 봉사시간 입력 핸들러: 화살표(▲/▼)로도 동작하도록 valueAsNumber 사용, 최대 15시간 제한
  function handleVolunteerChange(e: React.ChangeEvent<HTMLInputElement>) {
    let num = e.target.valueAsNumber;
    if (!isNaN(num)) {
      if (num > 15) num = 15;
      setScores((prev: typeof scores) => ({ ...prev, volunteer: num }));
    }
  }

  function isMaxScore(score: number, max: number): boolean {
    return score === max;
  }

  const volunteerScore = calcVolunteerScore(scores.volunteer);
  const attendanceScore = calcAttendanceScore(scores.attendance);
  const activityScore = calcSchoolActivityScore(scores.schoolActivities);
  const rawPeArtsScore = calcPEArtScore(scores.peArts);
  const peArtsScore = Math.min(30, rawPeArtsScore);

  // 성취도 버튼 그룹 렌더링 함수 (UI 구성 함수)
  const renderAchievementButtons = (
    selected: string,
    onSelect: (grade: string) => void,
    grades: string[] = ["A", "B", "C", "D", "E"]
  ) => (
    <div className="flex space-x-1">
      {grades.map((g) => (
        <button
          key={g}
          type="button"
          className={`px-2 py-1 rounded border text-sm transition-colors duration-200 ${
            selected === g
              ? "bg-sky-500 text-white border-sky-600"
              : "bg-gray-200 dark:bg-gray-700 dark:text-white border-gray-300"
          }`}
          onClick={() => onSelect(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );

  return (
    <div className={`${darkMode ? "bg-[#2a2a2a] text-white" : "bg-white"} min-h-screen`}>
      {/* 총점 배너 상단 고정 */}
      {totalScore > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-sky-600 text-white font-bold px-6 py-2 rounded shadow-xl z-50">
          총점: {totalScore} / 200점
        </div>
      )}
      <Card className={`${darkMode ? "bg-[#2a2a2a] text-white" : "bg-white"} w-full max-w-3xl mx-auto mt-10 px-4 md:px-6 lg:px-8 py-6 relative`}>
        <Button variant="ghost" className="absolute top-4 right-4" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </Button>
        <CardContent className="space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-3xl text-slate-700 dark:text-slate-200 drop-shadow-sm">2027 경기도 고입 내신 계산기</h2>

        {/* Sticky header for total score */}
        <div className={`sticky top-0 z-10 p-2 border-b ${darkMode ? "bg-[#2a2a2a]" : "bg-white"}`}>
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className={`w-full mb-2 transition-colors bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600`}
          >
            {isCalculating ? "계산 중..." : "내신 점수 계산"}
          </Button>
          <p className={`text-xl font-extrabold text-center p-2 rounded tracking-tight ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>
            총점: <span className="font-mono text-sky-400 font-black">{totalScore}</span> / 200점
          </p>
        </div>

        {[
          { key: "grade1_2", label: "1학년 2학기" },
          { key: "grade2_1", label: "2학년 1학기" },
          { key: "grade2_2", label: "2학년 2학기" },
          { key: "grade3_1", label: "3학년 1학기" },
          { key: "grade3_2", label: "3학년 2학기" },
        ].map(({ key, label }, idx) => (
          <div
            key={key}
            className={`border rounded-lg p-4 mb-6 ${
              idx % 2 === 0
                ? "bg-gray-50 dark:bg-gray-800"
                : "bg-white dark:bg-[#2a2a2a]"
            }`}
          >
            <button
              type="button"
              className="mb-2 text-left text-sky-600 font-semibold transition-colors hover:text-sky-400"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
              }
            >
              {expanded[key] ? "▼" : "▶"} <span className="underline">{label} 입력</span>
            </button>
            {expanded[key] && (
              <>
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-bold text-white px-4 py-2 rounded-t bg-sky-600 dark:bg-sky-700 mb-0">{label} 과목</h3>
                  <Button
                    className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded"
                    onClick={() => {
                      const targetSubjects = scores[key as keyof typeof scores];
                      if (!Array.isArray(targetSubjects)) return;

                      const averageAchievement =
                        targetSubjects.reduce((acc, cur) => acc + achievementToNumber(cur.achievement), 0) /
                        targetSubjects.length;

                      const averageRaw =
                        targetSubjects.reduce((acc, cur) => acc + cur.raw, 0) /
                        targetSubjects.length;

                      const convertedAchievement =
                        averageAchievement >= 4.5 ? "A" :
                        averageAchievement >= 3.5 ? "B" :
                        averageAchievement >= 2.5 ? "C" :
                        averageAchievement >= 1.5 ? "D" : "E";

                      const newScores = { ...scores };
                      const keys = ["grade1_2", "grade2_1", "grade2_2", "grade3_1", "grade3_2"];

                      keys.forEach((k) => {
                        if (k === key) return; // skip current
                        if (Array.isArray(newScores[k as keyof typeof scores])) {
                          (newScores[k as keyof typeof scores] as { name: string; achievement: string; raw: number }[]) =
                            (newScores[k as keyof typeof scores] as { name: string; achievement: string; raw: number }[]).map((subj) => ({
                              ...subj,
                              achievement: convertedAchievement,
                              raw: averageRaw,
                            }));
                        }
                      });

                      setScores(newScores);
                      handleCalculate();
                    }}
                  >
                    이 점수로 전체 반영
                  </Button>
                </div>
                {/* Shared labels row */}
                <div className="grid grid-cols-3 gap-6 items-center mb-2">
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-200">과목명</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-200">성취도</div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-200">원점수</div>
                </div>
                {(scores as any)[key].map(
                  (subject: { name: string; achievement: string; raw: number }, idx: number) => (
                    <div className="grid grid-cols-3 gap-6 items-center mb-4" key={idx}>
                      <div>
                        <Input
                          type="text"
                          placeholder="예: 국어"
                          value={subject.name}
                          onChange={(e) =>
                            handleChangeSubject(key as any, idx, "name", e.target.value)
                          }
                          className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
                        />
                      </div>
                      <div>
                        {/* 버튼 토글로 성취도 입력 */}
                        {renderAchievementButtons(
                          subject.achievement,
                          (g) => handleChangeSubject(key as any, idx, "achievement", g),
                          ["A", "B", "C", "D", "E"]
                        )}
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={subject.raw}
                          max={100}
                          onChange={(e) =>
                            handleChangeSubject(key as any, idx, "raw", e.target.value)
                          }
                          className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
                        />
                      </div>
                    </div>
                  )
                )}
                {/* 체육/예술 성취도 입력 */}
                <div className={`grid ${key === "grade1_2" ? "grid-cols-3" : "grid-cols-2"} gap-4 mt-4`}>
                  {(() => {
                    // Determine subjects and keys for each 학기
                    let subjects: string[] = [];
                    let subjectKeys: string[] = [];
                    if (key === "grade1_2") {
                      subjects = ["체육", "미술", "음악"];
                      subjectKeys = ["A", "B", "C"];
                    } else if (key === "grade2_1" || key === "grade2_2") {
                      subjects = ["체육", "미술"];
                      subjectKeys = ["A", "B"];
                    } else if (key === "grade3_1" || key === "grade3_2") {
                      subjects = ["체육", "음악"];
                      subjectKeys = ["A", "B"];
                    }
                    return subjects.map((subject, subjectIdx) => {
                      const subjectKey = subjectKeys[subjectIdx];
                      if (!subjectKey) return null;
                      return (
                        <div key={subject}>
                          <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">
                            {subject}
                          </Label>
                          <div className="flex space-x-1">
                            {["A", "B", "C"].map((grade) => (
                              <button
                                key={grade}
                                type="button"
                                className={`px-2 py-1 rounded border text-sm transition-colors duration-200 ${
                                  scores.peArts[key][subjectKey] === (grade === "A" ? 5 : grade === "B" ? 4 : 3)
                                    ? "bg-sky-500 text-white border-sky-600"
                                    : "bg-gray-200 dark:bg-gray-700 dark:text-white border-gray-300"
                                }`}
                                onClick={() =>
                                  handleSimpleChange(
                                    `peArts.${key}.${subjectKey}`,
                                    String(grade === "A" ? 5 : grade === "B" ? 4 : 3)
                                  )
                                }
                              >
                                {grade}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                {/* 과목 추가 버튼 */}
                <Button
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold hover:bg-emerald-700 rounded"
                  onClick={() => handleAddSubject(key as any)}
                >
                  과목 추가
                </Button>
              </>
            )}
          </div>
        ))}

        <h3 className="text-lg font-bold text-white px-4 py-2 rounded-t bg-sky-600 dark:bg-sky-700 mb-2 mt-6">출결 정보</h3>
        <div className="grid grid-cols-3 gap-6 items-center">
          <div>
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">1학년 미인정 결석일수</Label>
            <Input
              type="number"
              value={scores.attendance.g1}
              onChange={(e) => handleSimpleChange("attendance.g1", e.target.value)}
              className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">2학년 미인정 결석일수</Label>
            <Input
              type="number"
              value={scores.attendance.g2}
              onChange={(e) => handleSimpleChange("attendance.g2", e.target.value)}
              className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">3학년 미인정 결석일수</Label>
            <Input
              type="number"
              value={scores.attendance.g3}
              onChange={(e) => handleSimpleChange("attendance.g3", e.target.value)}
              className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white px-4 py-2 rounded-t bg-sky-600 dark:bg-sky-700 mb-2 mt-6">봉사 및 학교활동</h3>
        <div className="grid grid-cols-3 gap-6 items-center">
          <div>
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">
              봉사시간
              {isMaxScore(volunteerScore, 20) && <span className="text-green-600 font-semibold ml-1">(최대)</span>}
            </Label>
            <Input
              type="number"
              min={0}
              max={15}
              value={scores.volunteer}
              onChange={handleVolunteerChange}
              className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">
              수상 개수
              {isMaxScore(activityScore, 10) && <span className="text-green-600 font-semibold ml-1">(최대)</span>}
            </Label>
            <Input
              type="number"
              min={0}
              value={scores.schoolActivities.awards}
              onChange={(e) => handleSimpleChange("schoolActivities.awards", e.target.value)}
              className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-200 mb-1 block">
              임원 활동(월 수)
              {isMaxScore(activityScore, 10) && <span className="text-green-600 font-semibold ml-1">(최대)</span>}
            </Label>
            <Input
              type="number"
              value={scores.schoolActivities.roles}
              onChange={(e) => handleSimpleChange("schoolActivities.roles", e.target.value)}
              className="h-10 px-3 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-300"
            />
          </div>
        </div>

        {/* 세부 평가 결과 breakdown 토글 버튼 및 시각적 개선 */}
        <div className="mt-2">
          <Button
            variant="outline"
            className="w-full transition-colors bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            {showBreakdown ? "세부 평가 결과 닫기" : "세부 평가 결과 보기"}
          </Button>
          {showBreakdown && (
            <div
              ref={breakdownRef}
              className={`border p-4 mt-4 rounded space-y-6 transition-all duration-500 ease-in-out ${
                darkMode ? "bg-[#333333] border-gray-600 text-white" : "bg-gray-50 text-black"
              }`}
            >
              <h3 className="text-lg font-bold text-white px-4 py-2 rounded-t bg-sky-600 dark:bg-sky-700 mb-2">학기별 교과 점수</h3>
              <div>1학년 2학기: <span className="font-mono text-sky-400 font-semibold">{semesterScores.g1_2.toFixed(2)}</span> / 12점</div>
              <div>2학년 1학기: <span className="font-mono text-sky-400 font-semibold">{semesterScores.g2_1.toFixed(2)}</span> / 24점</div>
              <div>2학년 2학기: <span className="font-mono text-sky-400 font-semibold">{semesterScores.g2_2.toFixed(2)}</span> / 24점</div>
              <div>3학년 1학기: <span className="font-mono text-sky-400 font-semibold">{semesterScores.g3_1.toFixed(2)}</span> / 30점</div>
              <div>3학년 2학기: <span className="font-mono text-sky-400 font-semibold">{semesterScores.g3_2.toFixed(2)}</span> / 30점</div>
              <hr className="my-4 border-t border-slate-500/50" />
              <h3 className="text-lg font-bold text-white px-4 py-2 rounded-t bg-sky-600 dark:bg-sky-700 mb-2">비교과 영역</h3>
              {/* 점수 breakdown 카드화 */}
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "봉사시간", score: volunteerScore, max: 20 },
                  { label: "출결", score: attendanceScore, max: 20 },
                  { label: "학교활동", score: activityScore, max: 10 },
                  { label: "예체능", score: peArtsScore, max: 30 },
                ].map(({ label, score, max }) => (
                  <div key={label} className="rounded-lg p-4 bg-gray-100 dark:bg-gray-800 shadow min-w-[140px] flex-1">
                    <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">{label}</h4>
                    <div className="text-xl font-mono text-sky-400">{score.toFixed(2)} / {max}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}