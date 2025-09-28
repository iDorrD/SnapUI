import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import CardComponent from "../components/CardComponent";
import { getComponentes, getComponentesActivos, getCantidadUsuarios } from "../services";
import { Link } from "react-router-dom";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import CountUp from 'react-countup';
import Skeleton from '@mui/material/Skeleton';
import { useInView } from 'react-intersection-observer';
import { useAuth } from "../contexts/AuthContext";
import CodeIcon from '@mui/icons-material/Code';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';


function Home() {
  const [componentes, setComponentes] = useState([]);
  const [totalComponentes, setTotalComponentes] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const cargando = componentes.length === 0;
  const { usuario } = useAuth();

  const { ref: statsRef, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    getComponentesActivos().then((data) => setComponentes(data.slice(0, 9)));
  }, []);

  useEffect(() => {
    getComponentes().then((data) => setTotalComponentes(data));
  }, []);

  useEffect(() => {
    getCantidadUsuarios().then((data) => setTotalUsuarios(data));
  }, []);

  return (
    <div className="home-page">
      <section className="simple-hero mb-5">
        <h1 className="hero-title">Discover UI Elements</h1>
        <p className="hero-subtitle fw-normal">Open-source components ready to use in your next project.</p>
        <div style={{ display: "flex", gap: 20, marginTop: 20, justifyContent: "center", alignItems: "center" }}>
          <Link to="/components" className="btn-primary">Browse Components</Link>
          {
            usuario ? (
              <Link to="/dashboard/projects" className="btn-join" style={{ padding: "13px 24px" }}>Go to Dashboard</Link>
            ) : (
              <Link to="/login" className="btn-join" style={{ padding: "13px 24px" }}>Join Now</Link>
            )
          }
        </div>
      </section>

      <section className="slider-section-horizontal mb-5">
        <div className="slider-track-horizontal">
          {cargando
            ? Array.from({ length: 6 }).map((_, i) => (
              <div className="slider-item" key={"skeleton-" + i}>
                <Skeleton
                  variant="rectangular"
                  width={250}
                  height={200}
                  animation="wave"
                  style={{ borderRadius: 12 }}
                />
              </div>
            ))
            : [...componentes.slice(0, 6), ...componentes.slice(0, 6)].map((comp, i) => (
              <div className="slider-item" key={comp.id + "-slide-" + i}>
                <CardComponent
                  id={comp.id}
                  nombre={comp.nombre}
                  usuario={comp.usuario}
                  favoritos={comp.favoritos}
                  codigo_html={comp.codigo_html}
                  codigo_css={comp.codigo_css}
                />
              </div>
            ))
          }
        </div>
      </section>


      {/* <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", marginTop: "20px" }}>
        <Link to="/components" className="btn-join" style={{ padding: "16px 40px", background: "#3b82f6", borderRadius: "12px" }}>
          <RocketLaunchOutlinedIcon fontSize="small" /> Browse all components
        </Link>
      </div> */}

      <section className="stats-section" ref={statsRef}>
        <Container className="stats-grid">
          <div>
            <DashboardOutlinedIcon fontSize="large" style={{ color: "#777777", marginBottom: "10px", transform: "scale(1.25)" }} /><br />
            {inView && (
              <CountUp
                start={0}
                end={totalComponentes.length}
                duration={4}
                separator=","
                style={{ fontSize: "52px", fontWeight: 900 }}
              />
            )}
            <p>Community made UI<br />elements</p>
          </div>
          <div>
            <CardGiftcardOutlinedIcon fontSize="large" style={{ color: "#777777", marginBottom: "10px", transform: "scale(1.25)" }} /><br />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {inView && (
                <CountUp
                  start={0}
                  end={100}
                  duration={4}
                  separator=","
                  style={{ fontSize: "52px", fontWeight: 900 }}
                />
              )}
              <h3 style={{ fontSize: "52px", fontWeight: 900, margin: 0 }}>%</h3>
            </div>
            <p>Free for personal and<br />commercial use</p>
          </div>
          <div>
            <Groups3OutlinedIcon fontSize="large" style={{ color: "#777777", marginBottom: "10px", transform: "scale(1.25)" }} /><br />
            {inView && (
              <CountUp
                start={0}
                end={totalUsuarios}
                duration={4}
                separator=","
                style={{ fontSize: "52px", fontWeight: 900 }}
              />
            )}
            <p>Contributors to the<br />community</p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="featured-section">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", marginTop: "20px" }}>
            <div className="local-featured">
              For developers
            </div>
          </div>
          <h3>Discover components for your website</h3>
          <p>From buttons and cards created and shared by others creators.<br />All free personal and commercial use.</p>
        </div>
        <div className="fade-wrapper">
          <section className="componentes-grid">
            {componentes.slice(0, 6).map((comp) => (
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

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", marginTop: "20px" }}>
          <Link to="/components" className="btn-join" style={{ padding: "16px 40px", background: "#3b82f6", borderRadius: "12px" }}>
            <RocketLaunchOutlinedIcon fontSize="small" /> Browse all components
          </Link>
        </div>
      </Container>

      {/* For Creators */}

      <div style={{ background: "#00000088", width: "100%", padding: "30px 0" }}>
        <Container style={{ paddingBottom: "30px" }}>
          <div className="featured-section">
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", marginTop: "20px" }}>
              <div className="local-featured">
                For creators
              </div>
            </div>
            <h3>Share your codes with the world</h3>
            <p>Give an online your creations of others developers</p>
          </div>
          <div className="featured-cards-creators">
            <div className="card-featured-creator">
              <div style={{ background: "#222", padding: "8px", borderRadius: "12px", width: "fit-content", margin: "0 0 20px 0" }}>
                <CodeIcon fontSize="large" /><br />
              </div>
              <h3>Share your codes</h3>
              <p>Share your codes with the world and get feedback from other developers.</p>
            </div>
            <div className="card-featured-creator">
              <div style={{ background: "#222", padding: "8px", borderRadius: "12px", width: "fit-content", margin: "0 0 20px 0" }}>
                <LightbulbOutlinedIcon fontSize="large" /><br />
              </div>
              <h3>Get inspired</h3>
              <p>Discover new ideas and get inspired by the work of others.</p>
            </div>
            <div className="card-featured-creator">
              <div style={{ background: "#222", padding: "8px", borderRadius: "12px", width: "fit-content", margin: "0 0 20px 0" }}>
                <Groups3OutlinedIcon fontSize="large" /><br />
              </div>
              <h3>Join the community</h3>
              <p>Join a community of like-minded developers and share your work.</p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Home;
