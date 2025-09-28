import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getComponentesActivos } from "../services";
import CardComponent from "../components/CardComponent";
import { Container } from "@mui/material";
import Loader from "../components/Loader";

function CategoriasComponentes() {
    const { tipo } = useParams();
    const [componentes, setComponentes] = useState([]);

    useEffect(() => {
        getComponentesActivos().then(setComponentes);
    }, []);

    const filtrarPorCategoria = (comp) => {
        const html = comp.codigo_html.toLowerCase();

        switch (tipo) {
            case "buttons":
                return html.includes("<button") || html.includes('class="btn"');
            case "inputs":
                return html.includes("<input") || html.includes("<textarea") || html.includes("<select");
            case "text":
                return html.includes("<h1") || html.includes("<h2") || html.includes("<h3") || html.includes("<p");
            case "checkboxes":
                return html.includes('type="checkbox"');
            case "cards":
                return html.includes("card") || html.includes("card-body") || html.includes("container");
            default:
                return true;
        }
    };

    if (componentes.length === 0) {
        return (
            <Loader/>
        );
    }

    const componentesFiltrados = componentes.filter(filtrarPorCategoria);
    const tituloCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
    if (componentesFiltrados.length === 0) {
        return (
            <Container className="container mt-5">
                <h1 className="h2 fw-bold">{tituloCapitalizado}</h1>
                <p className="opacity-50 fw-normal">No se encontraron componentes en esta categoría.</p>
                <section className="componentes-grid">
                    {componentes.map((comp) => (
                        <CardComponent
                            key={comp.id}
                            id={comp.id}
                            nombre={comp.nombre}
                            usuario={comp.usuario}
                            favoritos={comp.favoritos}
                            codigo_html={comp.codigo_html}
                            codigo_css={comp.codigo_css}
                        />
                    ))}
                </section>
            </Container>
        );
    }

    return (
        <Container className="container mt-5">
            <h1 className="h2 fw-bold">{tituloCapitalizado}</h1>
            <p className="opacity-50 fw-normal">Filtered components</p>
            <section className="componentes-grid">
                {componentesFiltrados.map((comp) => (
                    <CardComponent
                        key={comp.id}
                        id={comp.id}
                        nombre={comp.nombre}
                        usuario={comp.usuario}
                        favoritos={comp.favoritos}
                        codigo_html={comp.codigo_html}
                        codigo_css={comp.codigo_css}
                    />
                ))}
            </section>
        </Container>
    );
}

export default CategoriasComponentes;
