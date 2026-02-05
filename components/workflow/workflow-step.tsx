"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Step } from "@/lib/step/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, GripVertical, Trash2 } from "lucide-react";

interface WorkflowStepItemProps {
  step: Step;
  onEdit: () => void;
  onDelete: () => void;
}

export function WorkflowStepItem({ step, onEdit, onDelete }: WorkflowStepItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      POST: "bg-green-500/10 text-green-500 border-green-500/20",
      PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
      PATCH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return colors[method] || "bg-gray-500/10 text-gray-500";
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-3 bg-card hover:bg-accent/5 transition-colors">
        <div className="flex items-start gap-3">
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground self-center"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {step.position}
              </div>
              <h4 className="font-medium text-sm truncate">{step.endpoint.name}</h4>
              <Badge className={`${getMethodColor(step.endpoint.method)} text-[10px] px-1.5 py-0`}>{step.endpoint.method}</Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div className="truncate">
                <span className="font-mono">
                  {step.endpoint.baseUri}
                  {step.endpoint.path}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-1 self-center">
            <Button size="icon-xs" variant="ghost" onClick={onEdit}>
              <Edit className="size-3" />
            </Button>
            <Button size="icon-xs" variant="ghost" onClick={onDelete}>
              <Trash2 className="size-3 text-red-500" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
