import type { TicketSeed } from "@/types";

type TicketBoardProps = {
  tickets: TicketSeed[];
  activeTicketId: string;
  onSelect: (ticketId: string) => void;
};

export function TicketBoard({ tickets, activeTicketId, onSelect }: TicketBoardProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-card p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Sprint tickets</p>
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            type="button"
            onClick={() => onSelect(ticket.id)}
            className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
              activeTicketId === ticket.id
                ? "border-primary/70 bg-primary/10"
                : "border-border/70 hover:bg-muted"
            }`}
          >
            <p className="font-medium">{ticket.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ticket.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
