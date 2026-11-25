/** Lista lateral. Na F01 só tem o cabeçalho; as seções entram com as próximas funcionalidades. */
export function Sidebar() {
  return (
    <aside className="flex w-sidebar shrink-0 flex-col bg-sidebar">
      <header className="flex h-header items-center border-b border-sidebar-border pr-2 pl-4">
        <p className="text-title font-black text-sidebar-fg-strong">Clenio</p>
      </header>
    </aside>
  );
}
