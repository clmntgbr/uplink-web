"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WorkflowStepItem } from "@/components/workflow/workflow-step";
import { Hydra, initHydra } from "@/lib/hydra";
import { useStep } from "@/lib/step/context";
import { Step } from "@/lib/step/types";
import { useWorkflow } from "@/lib/workflow/context";
import { Workflow } from "@/lib/workflow/types";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FileText, Layers, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { fetchSteps } = useStep();
  const { fetchWorkflow } = useWorkflow();
  const [steps, setSteps] = useState<Hydra<Step>>(initHydra<Step>());
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const params = useParams();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.member.findIndex((item) => item.id === active.id);
      const newIndex = steps.member.findIndex((item) => item.id === over.id);

      const newItems = steps.member.splice(newIndex, 0, steps.member.splice(oldIndex, 1)[0]);

      setSteps((prev) => ({
        ...prev,
        member: newItems,
      }));

      toast.success("Step order updated");
    }
  };

  const handleDeleteStep = (stepId: string) => {
    toast.success("Step deleted");
  };

  const handleEditStep = (step: Step) => {
    toast.success("Step edited");
  };

  useEffect(() => {
    fetchSteps(params.id as string).then((steps) => {
      setSteps(steps);
    });

    fetchWorkflow(params.id as string).then((workflow) => {
      setWorkflow(workflow);
    });
  }, [fetchSteps, fetchWorkflow, params.id]);

  if (!workflow) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Workflow Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Name</Label>
                  <Input
                    id="workflow-name"
                    value={workflow.name}
                    onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
                    placeholder="e.g., User Registration Flow"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    value={workflow.description || ""}
                    onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                    placeholder="Describe what this workflow tests..."
                    rows={4}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{steps.totalItems}</div>
                    <div className="text-xs text-muted-foreground">Steps</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">10</div>
                    <div className="text-xs text-muted-foreground">Endpoints</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Drag steps to reorder execution flow
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Use <code className="font-mono text-xs bg-muted px-1 rounded">{"{{variable}}"}</code> for dynamic values
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    Expand steps to configure outputs and assertions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Steps Builder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Steps</h2>
                  <p className="text-sm text-muted-foreground">Define the steps of the workflow</p>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={steps.member.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {steps.member.map((step) => (
                    <WorkflowStepItem
                      key={step.position}
                      step={step}
                      onEdit={() => handleEditStep(step)}
                      onDelete={() => handleDeleteStep(step.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </main>
    </div>
  );
}
