import { useEffect, useState } from "react";

function App() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;

      if (message.type === "projectData") {
        setFiles(message.files);
      }
    });
  }, []);

  return (
    <div style={{
      background: "#0f172a",
      color: "white",
      minHeight: "100vh",
      padding: "25px",
      fontFamily: "Arial"
    }}>
      <h1>🛡️ DevGuard AI</h1>
      <p>Live Code Review Dashboard</p>

      <h3>Changed Files</h3>

      <ul>
        {files.map((file, index) => (
          <li key={index}>{file}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;