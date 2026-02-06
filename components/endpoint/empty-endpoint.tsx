import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

export function EmptyEndpoint() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No Endpoint selected</EmptyTitle>
        <EmptyDescription>You haven&apos;t selected any endpoint yet. Get started by selecting an endpoint.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
