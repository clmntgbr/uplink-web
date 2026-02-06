import { JsonEditor } from "@/components/json-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Endpoint } from "@/lib/endpoint/types";
import { getMethodColor } from "@/lib/method-color";
import { Step } from "@/lib/step/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, Edit2, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";

interface StepCardProps {
  step: Step;
  endpoint: Endpoint;
  onUpdate: (updates: Partial<Step>) => void;
  onDelete: () => void;
}

export function StepCard({ step, endpoint, onUpdate, onDelete }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative ${isDragging ? "z-50 opacity-90" : ""}`}>
      {step.position > 1 && <div className="absolute left-6 -top-4 w-0.5 h-4 bg-border" />}

      <Card className={`${isDragging ? "shadow-lg" : ""} py-3`}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center gap-3 p-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
              {step.position}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-medium truncate">{endpoint.name}</span>
                <Badge className={`${getMethodColor(endpoint.method)} text-[10px] px-1.5 py-0`}>{endpoint.method}</Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                {endpoint.baseUri}
                {endpoint.path}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Expanded Content */}
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4 border-t">
              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-info" />
                  Body
                </label>
                <JsonEditor value={step.body as Record<string, string>} onChange={(value) => onUpdate({ body: JSON.parse(value) })} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Response
                </label>
                <JsonEditor
                  value={step.response as Record<string, string>}
                  onChange={(jsonString) => onUpdate({ response: JSON.parse(jsonString) })}
                />
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
