"use client";

import { StepCard } from "@/components/step/step-card";
import { Hydra, initHydra } from "@/lib/hydra";
import { useStep } from "@/lib/step/context";
import { Step } from "@/lib/step/types";
import { useWorkflow } from "@/lib/workflow/context";
import { Workflow } from "@/lib/workflow/types";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { fetchSteps } = useStep();
  const { fetchWorkflow } = useWorkflow();
  const params = useParams();

  const [steps, setSteps] = useState<Hydra<Step>>(initHydra<Step>());
  const [workflow, setWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    fetchSteps(params.id as string).then((steps) => {
      setSteps(steps);
    });

    fetchWorkflow(params.id as string).then((workflow) => {
      setWorkflow(workflow);
    });
  }, [fetchSteps, fetchWorkflow, params.id]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={steps.member.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {steps.member.map((step: Step) => (
              <StepCard key={step.id} step={step} endpoint={step.endpoint} onUpdate={() => {}} onDelete={() => {}} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
