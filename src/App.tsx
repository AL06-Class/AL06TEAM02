export default function App() {
  const statusText = "\uc2e4\ud589 \uc644\ub8cc";
  const titleText =
    "Docker \uae30\ubc18 React \uac1c\ubc1c \ud658\uacbd\uc774 \uc815\uc0c1\uc801\uc73c\ub85c \uc900\ube44\ub418\uc5c8\uc2b5\ub2c8\ub2e4.";
  const descriptionText =
    "Node 22 \ucee8\ud14c\uc774\ub108\uc5d0\uc11c Vite \uac1c\ubc1c \uc11c\ubc84\uac00 \uc2e4\ud589\ub420 \uc218 \uc788\ub294 \uc0c1\ud0dc\uc785\ub2c8\ub2e4. \uc774\uc81c \uc774 \ud654\uba74\uc744 \uae30\uc900\uc73c\ub85c \ud504\ub860\ud2b8\uc5d4\ub4dc \uc791\uc5c5\uc744 \uc2dc\uc791\ud558\uba74 \ub429\ub2c8\ub2e4.";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f6f7f9",
        color: "#17202a",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <section
        style={{
          width: "min(100%, 520px)",
          padding: "32px",
          border: "1px solid #d9dee7",
          borderRadius: "8px",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(23, 32, 42, 0.08)"
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "#18794e",
            fontSize: "14px",
            fontWeight: 700
          }}
        >
          {statusText}
        </p>
        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "28px",
            lineHeight: 1.25
          }}
        >
          {titleText}
        </h1>
        <p
          style={{
            margin: 0,
            color: "#52606d",
            fontSize: "16px",
            lineHeight: 1.6
          }}
        >
          {descriptionText}
        </p>
      </section>
    </main>
  );
}
