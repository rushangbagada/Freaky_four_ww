import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { FaFacebookF, FaTwitter, FaInstagram, FaTrophy, FaUsers, FaStar, FaHandshake, FaChevronUp } from 'react-icons/fa';
import './css/aboutus.css';

// Reusable component for animated stats
const AnimatedStat = ({ end }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    return <span ref={ref}>{isInView ? <CountUp end={end} duration={3} /> : 0}</span>;
};

// Scroll to top button component
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <motion.button
            className="scroll-to-top"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.3 }}
        >
            <FaChevronUp />
        </motion.button>
    );
};


export default function AboutUs() {
    // Mock data for testimonials since API is not returning anything
    const testimonialsData = [
        {
            name: 'Alex Johnson',
            position: 'Team Captain, Football',
            review: 'This hub transformed my athletic career. The support and facilities are top-notch!',
            image: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        {
            name: 'Sarah Lee',
            position: 'Point Guard, Basketball',
            review: 'A fantastic community that fosters growth, teamwork, and a winning mindset.',
            image: 'https://randomuser.me/api/portraits/women/44.jpg'
        },
        {
            name: 'Mike Chen',
            position: 'Sprinter, Track & Field',
            review: 'The coaching staff here is incredible. They pushed me to break my personal bests.',
            image: 'https://randomuser.me/api/portraits/men/56.jpg'
        }
    ];

  return (
    <div className="about-us-page">
        {/* --- Hero Section --- */}
        <motion.header
            className="hero-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="hero-background"></div>
            <div className="hero-content">
                <h1 className="hero-title">About Campus Sports Hub</h1>
                <p className="hero-subtitle">
                    Empowering student athletes to achieve <span className="accent-word">excellence</span> through sport, teamwork, and personal growth.
                </p>
            </div>
        </motion.header>

        {/* --- Mission Section --- */}
        <motion.section className="content-section mission" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 50 } }}>
            <h2 className="section-title">Our Mission</h2>
            <p>
                Campus Sports Hub is dedicated to creating an inclusive, competitive, and supportive environment where student athletes can pursue their passion for sports while developing essential life skills. We aim to foster excellence, build character, and create lasting memories.
            </p>
        </motion.section>

        <div className="section-divider"></div>

        {/* --- Achievements Section --- */}
        <section className="content-section achievements">
            <div className="achievement-heading">
                <div className="achievement-icon-bg"></div>
                <h2 className="section-title">🏆 Our Achievements</h2>
                <p className="section-subtitle">A legacy of performance and dedication</p>
            </div>
            <div className="achievements-grid">
                <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <h3><AnimatedStat end={500} />+</h3>
                    <p>Active Students</p>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <h3><AnimatedStat end={25} />+</h3>
                    <p>Sports Clubs</p>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <h3><AnimatedStat end={100} />+</h3>
                    <p>Championships Won</p>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <h3><AnimatedStat end={15} />+</h3>
                    <p>Years of Excellence</p>
                </motion.div>
            </div>
        </section>

        <div className="section-divider"></div>

        {/* --- Our Values Section --- */}
        <section className="content-section values">
            <h2 className="section-title">Our Core Values</h2>
            <div className="values-grid">
                <motion.div className="value-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <div className="value-icon"><FaStar /></div>
                    <h3 className="value-name">Excellence</h3>
                    <p>Striving for the highest standards in athletic and personal development.</p>
                </motion.div>
                <motion.div className="value-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <div className="value-icon"><FaUsers /></div>
                    <h3 className="value-name">Teamwork</h3>
                    <p>Believing in collaboration and mutual support to achieve common goals.</p>
                </motion.div>
                <motion.div className="value-card" whileHover={{ y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                    <div className="value-icon"><FaHandshake /></div>
                    <h3 className="value-name">Dedication</h3>
                    <p>Committing to hard work, perseverance, and a relentless pursuit of objectives.</p>
                </motion.div>
            </div>
        </section>

        <div className="section-divider"></div>

        {/* --- Testimonials Section --- */}
        <section className="content-section testimonials">
            <h2 className="section-title">What Our Athletes Say</h2>
            <div className="testimonials-grid">
                {testimonialsData.map((testimonial, index) => (
                    <motion.div
                        className="testimonial-card"
                        key={index}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={{ visible: { opacity: 1, scale: 1, transition: { delay: index * 0.2 } }, hidden: { opacity: 0, scale: 0.9 } }}
                        whileHover={{ y: -8, boxShadow: '0 12px 30px rgba(0,0,0,0.6)' }}
                    >
                        <img className="testimonial-img" src={testimonial.image} alt={testimonial.name} />
                        <h3 className="testimonial-name">{testimonial.name}</h3>
                        <p className="testimonial-position">{testimonial.position}</p>
                        <blockquote className="testimonial-quote">"{testimonial.review}"</blockquote>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* --- Footer --- */}
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-column contact-info">
                    <h4>Contact Us</h4>
                    <p>123 College Avenue, Campus City</p>
                    <p>(555) 123-4567</p>
                    <p>sports@campushub.edu</p>
                </div>
                <div className="footer-column social-media">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                    </div>
                </div>
                <div className="footer-column newsletter">
                    <h4>Join Our Newsletter</h4>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Your Email" required />
                        <button type="submit" className="glowing-btn">Subscribe</button>
                    </form>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Campus Sports Hub. All Rights Reserved.</p>
            </div>
        </footer>

        <ScrollToTopButton />
    </div>
  );
}
