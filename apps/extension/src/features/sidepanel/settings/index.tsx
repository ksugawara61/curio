import { type FC, useState } from "react";
import { useBlockedDomains } from "../../../shared/hooks/useBlockedDomains";

export const Settings: FC = () => {
  const { domains, addDomain, removeDomain } = useBlockedDomains();
  const [input, setInput] = useState("");

  const handleAdd = async () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;
    await addDomain(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg">Blocked Domains / Paths</h2>
      <p className="text-sm text-base-content/70">
        Bookmarking is disabled for pages on these domains or paths. You can
        block an entire domain (e.g. <code>example.com</code>) or a specific
        path (e.g. <code>example.com/private</code>).
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          className="input input-bordered input-sm flex-1"
          placeholder="example.com or example.com/path"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>

      {domains.length === 0 ? (
        <p className="text-sm text-base-content/50">
          No blocked domains or paths registered.
        </p>
      ) : (
        <ul className="flex flex-col gap-1">
          {domains.map((domain) => (
            <li
              key={domain}
              className="flex items-center justify-between rounded bg-base-100 px-3 py-2 text-sm"
            >
              <span>{domain}</span>
              <button
                type="button"
                className="btn btn-error btn-ghost btn-xs"
                onClick={() => removeDomain(domain)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
