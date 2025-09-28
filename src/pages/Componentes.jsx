
import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import "../services"
import { getComponentesActivos } from "../services"
import CardComponent from "../components/CardComponent"

function Componentes() {
    const [componentes, setComponentes] = useState([]);
    const [orden, setOrden] = useState("mas_nuevo");
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        getComponentesActivos().then((data) => setComponentes(data));
    }, []);

    const componentesOrdenados = [...componentes]
        .filter((comp) =>
            comp.nombre.toLowerCase().includes(busqueda.toLowerCase())
        )
        .sort((a, b) => {
            if (orden === "mas_popular") {
                return b.favoritos - a.favoritos; // descendente
            } else {
                return a.favoritos - b.favoritos; // ascendente
            }
        });

        

    return (
        <>
            <Container className="container mt-5">
            <div className="contenido">
                <h1 className="h2 fw-bold">Browse all</h1>
                <p className="opacity-50 fw-normal">Open-Source UI components made with CSS</p>
                <div className="ordenar-select">
                    <select
                        id="orden"
                        value={orden}
                        onChange={(e) => setOrden(e.target.value)}
                    >
                        <option value="mas_popular">Most Popular</option>
                        <option value="menos_popular">Less Popular</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search component..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <section className="componentes-grid">
                    {componentesOrdenados.map((comp) => (
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
            </div>
            </Container>
        </>
    )
}

export default Componentes