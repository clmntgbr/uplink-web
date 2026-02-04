"use client";

import { Hydra, initHydra } from "@/lib/hydra";
import { useStep } from "@/lib/step/context";
import { Step } from "@/lib/step/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fetchSteps } = useStep();
  const [steps, setSteps] = useState<Hydra<Step>>(initHydra<Step>());
  const params = useParams();

  useEffect(() => {
    fetchSteps(params.id as string).then((steps) => {
      setSteps(steps);
    });
  }, [fetchSteps, params.id]);

  return (
    <>
      <pre>{JSON.stringify(steps, null, 2)}</pre>
    </>
  );
}
