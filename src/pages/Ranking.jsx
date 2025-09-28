import { useEffect, useState } from "react";
import { getComponentesActivos } from "../services";
import CardComponent from "../components/CardComponent";
import { Container } from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Ranking = () => {
    const [componentes, setComponentes] = useState([]);

    useEffect(() => {
        getComponentesActivos().then((data) => {
            const ordenados = [...data].sort((a, b) => b.favoritos - a.favoritos);
            setComponentes(ordenados);
        });
    }, []);

    const getMedalla = (index) => {
        switch (index) {
            case 0:
                return <EmojiEventsIcon fontSize="large" style={{ color: "#FFD700", marginBottom: "20px" }} />;
            case 1:
                return <EmojiEventsIcon fontSize="large" style={{ color: "#C0C0C0", marginBottom: "20px" }} />;
            case 2:
                return <EmojiEventsIcon fontSize="large" style={{ color: "#CD7F32", marginBottom: "20px" }} />;
            default:
                return null;
        }
    };

    const top1 = componentes.slice(0, 1);
    const top2 = componentes.slice(1, 3);
    const top3 = componentes.slice(3, 6);

    return (
        <Container className="container mt-5">
            <h1 className="h2 fw-bold">Ranking de Componentes</h1>
            <p className="opacity-50 fw-normal">Los más populares según favoritos</p>

            <h2 className="h4 fw-bold mt-5 text-center">The Best</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
                {top1.map((comp, i) => (
                    <div key={comp.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {getMedalla(i)}
                        <CardComponent {...comp} className="ranking-card oro" />
                    </div>
                ))}
            </div>

            <h2 className="h4 fw-bold mt-5 text-center"></h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                {top2.map((comp, i) => (
                    <div key={comp.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {getMedalla(i + 1)}
                        <CardComponent {...comp} className={`ranking-card ${i === 0 ? "plata" : "bronce"}`} />
                    </div>
                ))}
            </div>

            <hr className="my-5" />
            <section className="componentes-grid">
                {top3.map((comp, i) => (
                    <div key={comp.id}>
                        {getMedalla(i + 3)}
                        <CardComponent {...comp} />
                    </div>
                ))}
            </section>
        </Container>
    );
};

export default Ranking;
