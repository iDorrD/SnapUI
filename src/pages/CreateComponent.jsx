import { useNavigate, useSearchParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import { Editor } from "@monaco-editor/react";
import { Container } from "@mui/material";
import { RocketLaunchOutlined } from "@mui/icons-material";
import { crearComponente } from "../services";
import { useAuth } from "../contexts/AuthContext";

function CreateComponent() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("css");
    const [codigoHtml, setCodigoHtml] = useState("");
    const [codigoCss, setCodigoCss] = useState("");
    const [nombre, setNombre] = useState("New Component");
    const [searchParams] = useSearchParams();
    const tipo = searchParams.get("type");
    const nombreUrl = searchParams.get("name");
    const iframeRef = useRef(null);
    const { usuario } = useAuth();

    const getTemplateHTML = (type) => {
        switch (type) {
            case "Button":
                return `<button class="btn">Click me</button>`;
            case "Checkbox":
                return `<label><input type="checkbox" /> Check me</label>`;
            case "Input":
                return `<input type="text" placeholder="Type here..." />`;
            case "Card":
                return `<div class="card"><h2>Card Title</h2><p>Some content</p></div>`;
            default:
                return `<div>Hello ${type}</div>`;
        }
    };

    const getTemplateCSS = (type) => {
        switch (type) {
            case "Button":
                return `.btn {
  background: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}`;
            case "Checkbox":
                return `input[type="checkbox"] {
  accent-color: #3b82f6;
}`;
            case "Input":
                return `input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}`;
            case "Card":
                return `.card {
  background: #1e1e1e;
  padding: 20px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 0 8px #000;
}`;
            default:
                return ``;
        }
    };

    useEffect(() => {
        setNombre(nombreUrl || "New Component");
        setCodigoHtml(getTemplateHTML(tipo));
        setCodigoCss(getTemplateCSS(tipo));
    }, [tipo, nombreUrl]);

    useEffect(() => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;

        const html = activeTab === "html" ? codigoHtml : codigoHtml;
        const css = activeTab === "css" ? codigoCss : codigoCss;

        doc.open();
        doc.write(`
      <html>
      <head>
        <style>${css}</style>
      </head>
      <body style="margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; height: 100vh;">
        ${html}
      </body>
      </html>
    `);
        doc.close();
    }, [codigoHtml, codigoCss, activeTab]);

    const handleSubmit = async () => {
        try {
            const res = await crearComponente({
                nombre,
                codigo_html: codigoHtml,
                codigo_css: codigoCss,
                id_usuario: usuario.id,
            });

            navigate(`/component/${res.data.id}`);
        } catch (err) {
            console.error("Error al enviar componente:", err);
        }
    };

    return (
        <Container className="container">
            <div className="componente-page">
                <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", justifyContent: "space-between" }}>
                    <button className="btn-join" onClick={() => navigate(-1)}>← Go back</button>
                </div>

                <div className="componente-container" style={{ display: "flex", gap: "20px" }}>
                    <div className="preview-box" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <iframe
                            ref={iframeRef}
                            title="preview"
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                                background: "transparent",
                            }}
                        />
                    </div>

                    <div className="code-box">
                        <div className="tabs">
                            <button className={activeTab === "html" ? "active" : ""} onClick={() => setActiveTab("html")}>
                                <HtmlIcon fontSize="large" />
                            </button>
                            <button className={activeTab === "css" ? "active" : ""} onClick={() => setActiveTab("css")}>
                                <CssIcon fontSize="large" />
                            </button>
                        </div>

                        <Editor
                            language={activeTab}
                            value={activeTab === "html" ? codigoHtml : codigoCss}
                            onChange={(value) => {
                                activeTab === "html" ? setCodigoHtml(value) : setCodigoCss(value);
                            }}
                            theme="vs-dark"
                            height="650px"
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                wordWrap: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>

                <div className="componente-actions gap-3">
                    <button className="btn-primary" onClick={handleSubmit}>
                        <RocketLaunchOutlined fontSize="small" /> Submit for review
                    </button>
                    <button className="btn-join" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                </div>
            </div>
        </Container>
    );
}

export default CreateComponent;
