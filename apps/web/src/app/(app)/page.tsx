import { EmptyState } from '@/app/components/ui/empty-state';

export default function HomePage() {
  return (
    <EmptyState
      title="Nenhuma conversa ainda"
      description="Crie um canal ou comece uma conversa pela barra lateral."
    />
  );
}
