"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TalentItem = {
  uid: string;
  level: string;
  averageProjectScore: number;
  debuggingScore: number;
  topLanguages: string[];
  completedProjects: number;
};

export default function CompanyTalentPage() {
  const [items, setItems] = useState<TalentItem[]>([]);
  const [level, setLevel] = useState("");
  const [minScore, setMinScore] = useState("0");

  useEffect(() => {
    async function loadTalent() {
      const params = new URLSearchParams();
      if (level) {
        params.set("level", level);
      }
      if (minScore) {
        params.set("minScore", minScore);
      }

      const response = await fetch(`/api/talent?${params.toString()}`, { cache: "no-store" });
      const payload = (await response.json()) as { ok: boolean; data?: TalentItem[] };
      if (payload.ok && payload.data) {
        setItems(payload.data);
      }
    }

    loadTalent();
  }, [level, minScore]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.averageProjectScore - a.averageProjectScore),
    [items],
  );

  return (
    <section className="page-wrap">
      <header className="page-hero">
        <p className="page-kicker">Talent</p>
        <h1 className="page-title text-3xl">Talent Browse</h1>
        <p className="page-subtitle text-sm">
          Filter candidates by readiness and inspect public performance passports.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <select
          className="field-dark w-44"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="">All levels</option>
          <option value="apprentice">Apprentice</option>
          <option value="developer">Developer</option>
          <option value="senior">Senior</option>
        </select>

        <input
          className="field-dark w-44"
          type="number"
          min={0}
          max={100}
          value={minScore}
          onChange={(event) => setMinScore(event.target.value)}
          placeholder="Min project score"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((item) => (
          <Card key={item.uid}>
            <CardHeader>
              <CardTitle className="text-base">Candidate {item.uid.slice(0, 8)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Level: {item.level}</p>
              <p>Project score: {item.averageProjectScore}</p>
              <p>Debug score: {item.debuggingScore}</p>
              <p>Completed projects: {item.completedProjects}</p>
              <p>Languages: {item.topLanguages.join(", ") || "n/a"}</p>
              <Link className="text-primary underline-offset-4 hover:underline" href={`/passport/${item.uid}`}>
                View passport
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
