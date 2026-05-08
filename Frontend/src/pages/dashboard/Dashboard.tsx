import { useState } from "react";

import ChatPane from "./ChatPane";
import NewChat from "./NewChat";
import Sidebar from "./Sidebar";
import SourcesPane from "./SourcesPane";

export default function Dashboard() {
  const [sourcesCollapsed, setSourcesCollapsed] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    // Three-pane shell: sidebar | chat/new-chat | sources rail.
    <div className="bg-bg text-fg relative flex h-screen w-full overflow-hidden">
      {/* Left rail — recent chats, search, shortcuts, account. */}
      <Sidebar />

      {/* Center — empty state until the user starts a thread, then the live chat pane. */}
      {activeChatId ? <ChatPane /> : <NewChat onStart={() => setActiveChatId(null)} />}

      {/* Right rail — citation/source inspector, collapsible to a 48px strip. */}
      <SourcesPane collapsed={sourcesCollapsed} onToggle={() => setSourcesCollapsed((v) => !v)} />
    </div>
  );
}
