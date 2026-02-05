import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export function EmptySteps() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No Steps Yet</EmptyTitle>
        <EmptyDescription>You haven&apos;t created any steps yet. Get started by creating your first step.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
