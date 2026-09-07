import type { FC } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { environments } from "@/config/environments";
import { Routes as RoutePaths } from "@/routes/routes";

const PRINCIPLES = [
  "Never present an insight, claim, or number without a traceable citation back to the source Reddit post or comment.",
  "Prefer intelligent, deduplicated, ranked content selection over brute-force \"read everything\" processing.",
  "The AI agent stays grounded in the analyzed dataset — it says \"I don't know\" rather than filling gaps with outside knowledge.",
  "Treat all Reddit content as untrusted input that must not be allowed to manipulate the system or its instructions.",
  "Design for AI cost efficiency by default rather than treating cost as an afterthought.",
];

const AboutPage: FC = () => {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-12 space-y-10">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">About {environments.APP_NAME}</h1>
            <p className="text-muted-foreground text-lg">
              A searchable, source-backed knowledge layer over Reddit discussions.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What it does</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                Point {environments.APP_NAME} at a subreddit or a specific Reddit post, and it retrieves, cleans, and
                analyzes the discussion — extracting the key facts, opinions, problems, solutions, recommendations,
                trends, and disagreements into a structured, source-cited knowledge report.
              </p>
              <p>
                From there, you can ask an AI research agent follow-up questions that are answered only from the
                analyzed content, with every answer traceable back to the originating Reddit post or comment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Not just a summarizer</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Every insight, claim, and statistic carries a citation back to the specific post or comment that
                supports it, and the research agent explicitly says so when the analyzed dataset doesn't contain an
                answer, rather than falling back on general knowledge. That traceability is what separates it from a
                plain "summarize this subreddit" tool.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {PRINCIPLES.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-3 pt-2">
            <Button asChild variant="outline">
              <Link to={RoutePaths.auth.sign_in}>Sign in</Link>
            </Button>
            <Button asChild>
              <Link to={RoutePaths.auth.sign_up}>Sign up</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
