import React from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "./index.css";

import Board from "./components/kanban/Board";
import { useTaskStore } from "./store/useTaskStore";

setupIonicReact();
const IconLock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const IconChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconUserPlus = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

const IconFilter = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconExport = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 8 8 12 12 16" />
    <line x1="16" y1="12" x2="8" y2="12" />
  </svg>
);

const IconSearch = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AVATARS = [
  {
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    name: "Felix",
  },
  {
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    name: "Aneka",
  },
  {
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
    name: "Bella",
  },
  {
    url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    name: "Chris",
  },
];

const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useTaskStore();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 60,
        background: "#fff",
        borderBottom: "1px solid #f1f5f9",
        flexShrink: 0,
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* ... (Left Section) */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Workspace selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <span style={{ color: "#1e293b", display: "flex" }}>
            <IconLock />
          </span>
          <span style={{ fontSize: "18px", fontWeight: 500, color: "#1e293b" }}>
            Adhivasindo
          </span>
          <span style={{ color: "#64748b", display: "flex", marginLeft: 4 }}>
            <IconChevronDown />
          </span>
        </div>

        {/* Avatars */}
        <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
          {AVATARS.map((a, i) => (
            <div
              key={a.name}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "2px solid #fff",
                overflow: "hidden",
                marginLeft: i === 0 ? 0 : -10,
                background: "#f1f5f9",
                zIndex: 5 - i,
              }}
            >
              <img
                src={a.url}
                alt={a.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid #fff",
              background: "#3b82f6",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -10,
              zIndex: 0,
            }}
          >
            +2
          </div>
        </div>

        {/* Invite Button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#ebf0f4",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1e293b",
            marginLeft: 8,
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e2e8f0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#ebf0f4")}
        >
          <IconUserPlus />
          Invite
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <IconFilter />
          Filter
        </div>

        {/* Export / Import */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <IconExport />
          Export / Import
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#ebf0f4",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            width: 240,
          }}
        >
          <span style={{ color: "#64748b", display: "flex" }}>
            <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Search Tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "#1e293b",
              width: "100%",
              fontFamily: '"Inter", sans-serif',
            }}
          />
        </div>
      </div>
    </header>
  );
};

const App: React.FC = () => (
  <IonApp>
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1, overflow: "hidden" }}>
        <Board />
      </main>
    </div>
  </IonApp>
);

export default App;
