import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import NavigationBar from './components/NavigationBar';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import ComingSoonPage from './components/ComingSoonPage';
import DoctorOfficePage from './components/doctorOffice/DoctorOfficePage';
import MemoryGame from './components/memoryGame/MemoryGame';
import EcommercePage from './components/ecommerce/EcommercePage';

import storeImage from './assets/store.png'
import gameImage from './assets/game.jpg'
import dashboardImage from './assets/dashboard.png'
import dentalImage from './assets/dental.jpg'
import './App.css';


function App() {
    const [darkMode, setDarkMode] = useState(true);
    const location = useLocation();
    const isServicePage = location.pathname.startsWith('/service');
    const isMemoryGamePage = location.pathname.startsWith('/memory-game');
    const isEcommercePage = location.pathname.startsWith('/ecommerce');
    const isStandalonePage = isServicePage || isMemoryGamePage || isEcommercePage;

    useEffect(() => {
        const sectionId = location.state?.scrollTo;
        if (location.pathname === '/' && sectionId) {
            window.requestAnimationFrame(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }, [location.pathname, location.state]);

    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }

    return (
        <div className={`${darkMode ? 'app dark-mode' : 'app'}${isServicePage ? ' service-app' : ''}${isMemoryGamePage ? ' memory-game-app' : ''}${isEcommercePage ? ' ecommerce-app' : ''}`}>
            {!isStandalonePage && (
                <NavigationBar
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />
            )}

            <Routes>
                <Route
                    path="/"
                    element={
                        <main>
                            <section id="home" className="hero-section">
                                <div className="container">
                                    <p className="eyebrow">SEG 3125 Portfolio</p>

                                    <h1>Hi, I am Kevin.</h1>

                                    <p className="hero-text">
                                        I am a computer science and math student at the University of Ottawa
                                        with an interest in software development, DevOps, and applied AI.
                                        I enjoy building practical projects, learning new technologies,
                                        and solving problems through clean, efficient code.
                                    </p>
                                </div>
                            </section>

                            <Section
                                id="work"
                                title="How I Work"
                                text="I am currently learning UI design, visual communication, and front-end development through SEG 3125. My workflow is to understand the goal of the interface, plan the layout, choose simple visual elements, then build and refine the design using React, Bootstrap, and CSS."
                            />

                            <Section
                                id="projects"
                                title="Case Studies"
                                text="These are the design projects I will build throughout the semester."
                                light={true}
                            >
                                <Row className="g-4">
                                  <Col lg={6}>
                                      <ProjectCard
                                          title="Service Website"
                                          description="Description for a future service website."
                                          image={dentalImage}
                                          link="/service"
                                      />
                                  </Col>

                                  <Col lg={6}>
                                      <ProjectCard
                                          title="Memory Game"
                                          techStack="Assignment 3 / A3"
                                          description="Pattern Recall is an interactive memory game where users study and recreate circle patterns on a configurable grid."
                                          image={gameImage}
                                          link="/memory-game"
                                      />
                                  </Col>

                                  <Col lg={6}>
                                      <ProjectCard
                                          title="FairwayFit Golf"
                                          techStack="Assignment 4 / A4"
                                          description="A golf e-commerce prototype with faceted search, cart, checkout flow, and post-shopping survey."
                                          image={storeImage}
                                          link="/ecommerce"
                                      />
                                  </Col>

                                  <Col lg={6}>
                                      <ProjectCard
                                          title="Analytics Website"
                                          description="Description for a future analytics website."
                                          image={dashboardImage}
                                          link="/analytics"
                                      />
                                  </Col>
                              </Row>
                            </Section>
                        </main>
                    }
                />

                <Route
                    path="/service/*"
                    element={<DoctorOfficePage />}
                />

                <Route
                    path="/memory-game"
                    element={<MemoryGame />}
                />

                <Route path="/ecommerce/*" element={<EcommercePage />} />

                <Route
                    path="/analytics"
                    element={
                        <ComingSoonPage
                            title="Analytics Website"
                            description="This page will contain my future analytics/dashboard design project."
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
