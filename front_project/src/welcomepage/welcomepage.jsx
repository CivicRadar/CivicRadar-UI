import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { display, GlobalStyles } from '@mui/system';
import { Box } from '@mui/material';
import './styles.css'

const globalStyles = (
  <GlobalStyles
    styles={{
      '#root': {
        margin: '0',
      },
      ':root': {
        '--color-primary': '#2584ff',
        '--color-secondary': '#00d9ff',
        '--color-accent': '#ff3400',
        '--color-headings': '#1b0760',
        '--color-body': '#918ca4',
        '--color-body-darker': '#5c5577',
        '--color-border': '#ccc',
        '--border-radius': '30px',
      },
      '*': {
        'box-sizing': 'border-box',
      },
      '::selection': {
        background: 'var(--color-primary)',
        color: '#fff',
      },
      html: {
        fontSize: '62.5%',
      },
      img: {
        width: '100%',
      },
      body: {
        fontFamily: 'Inter, Arial, Helvetica, sans-serif',
        fontSize: '2rem',
        lineHeight: '1.5',
        'place-items': 'normal',
        display: 'block',
        color: 'var(--color-body)',
      },
      h1: {
        color: 'var(--color-headings)',
        marginBottom: '1rem',
        lineHeight: '1.1',
        fontSize: '6rem',
      },
      h2: {
        color: 'var(--color-headings)',
        marginBottom: '1rem',
        lineHeight: '1.1',
        fontSize: '4rem',
      },
      h3: {
        color: 'var(--color-headings)',
        marginBottom: '1rem',
        lineHeight: '1.1',
        fontSize: '2.8rem',
        fontWeight: 600,
      },
      p: {
        marginTop: 0,
      },
      '@media screen and (min-width: 1024px)': {
        body: {
          fontSize: '1.8rem',
        },
        h1: {
          fontSize: '8rem',
        },
        h2: {
          fontSize: '4rem',
        },
        h3: {
          fontSize: '2.4rem',
        },
      },
      a: {
        textDecoration: 'none',
      },
    }}
  />
);


function LandingPage() {
  AOS.init();
  return (
    <>
    {globalStyles}
    <Box>
      <header>
      <nav className="nav collapsible">
        <a aria-label="Moshify" className="nav__brand" href="/">
            <img src="./assets/images/logo.svg" alt=""/>
        </a>
        <svg className="icon icon--white nav__toggler">
          <use href="./assets/images/sprite.svg#menu"></use>
        </svg>
        <ul className="list nav__list collapsible__content">
          <li className="nav__item">
            <a  href="/signup-login">Login / SingUp</a>
          </li>
        </ul>
      </nav>
    </header>
    <section className="block block--dark block--skewed-left hero">
      <div className="container grid grid--1x2">
        <header className="block__header hero__content">
          <h1 data-aos="zoom-in-up" className="block__heading">
            Bright Campus
          </h1>
          <p className="hero__tagline">
            make you school modern and smart today.
          </p>
          <a
            target="_blank"
            href="https://codewithmosh.com"
            className="btn btn--accent btn--stretched"
            >Get Started
          </a>
        </header>
        <picture data-aos="zoom-in">
          <source
            type="image/webp"
            srcset="./assets/images/banner.webp 1x, ./assets/images/banner@2x.webp 2x"
          />
          <source
            type="image/png"
            srcset="./assets/images/banner.png 1x, ./assets/images/banner@2x.png 2x"
          />
          <img className="hero__image" src="./assets/images/banner.png" alt="" />
        </picture>
      </div>
    </section>
    <section data-aos="zoom-in-up" className="block container block-domain">
      <header className="block__header">
        <h2>Starting at $10 per month</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti,
          exercitationem?
        </p>
      </header>
      <div className="input-group">
        <input
          aria-label="Domain"
          type="text"
          class="input"
          placeholder="Enter domain name here..."
        />
        <button className="btn btn--accent">
          <svg className="icon icon--white">
            <use href="./assets/images/sprite.svg#search"></use>
            </svg>
            Search
        </button>
      </div>
      <ul className="list block-domain__prices">
        <li><span className="badge badge--secondary">.com $9</span></li>
        <li>.sg $10</li>
        <li>.space $11</li>
        <li>.info $14</li>
        <li>.net $10</li>
        <li>.xyz $10</li>
      </ul>
    </section>
    <section data-aos="fade-up" className="block container block-plans">
      <div className="grid grid--1x3">
        <div className="plan">
          <div className="card card--secondary">
            <header className="card__header">
              <h3 className="plan__name">Entry</h3>
              <span className="plan__price">$14</span>
              <span className="plan__billing-cycle">/month</span>
              <span className="badge badge--secondary badge--small">10% OFF</span>
              <span className="plan__description">Easy start on the cloud</span>
            </header>
            <div className="card__body">
              <ul className="list list--tick">
                <li className="list__item">Unlimited Websites</li>
                <li className="list__item">Unlimited Bandwidth</li>
                <li className="list__item">100 GB SSD Sotrage</li>
                <li className="list__item">3 GB RAM</li>
              </ul>
              <button className="btn btn--outline btn--block">Buy Now</button>
            </div>
          </div>
        </div>
        <div className="plan plan--popular">
          <div className="card card--primary">
            <header className="card__header">
              <h3 className="plan__name">Entry</h3>
              <span className="plan__price">$14</span>
              <span className="plan__billing-cycle">/month</span>
              <span className="badge badge--primary badge--small">10% OFF</span>
              <span className="plan__description">Easy start on the cloud</span>
            </header>
            <div className="card__body">
              <ul className="list list--tick">
                <li className="list__item">Unlimited Websites</li>
                <li className="list__item">Unlimited Bandwidth</li>
                <li className="list__item">100 GB SSD Sotrage</li>
                <li className="list__item">3 GB RAM</li>
              </ul>
              <button className="btn btn--outline btn--block">Buy Now</button>
            </div>
          </div>
        </div>
        <div className="plan">
          <div className="card card--secondary">
            <header className="card__header">
              <h3 className="plan__name">Entry</h3>
              <span className="plan__price">$14</span>
              <span className="plan__billing-cycle">/month</span>
              <span className="badge badge--secondary badge--small">10% OFF</span>
              <span className="plan__description">Easy start on the cloud</span>
            </header>
            <div className="card__body">
              <ul className="list list--tick">
                <li className="list__item">Unlimited Websites</li>
                <li className="list__item">Unlimited Bandwidth</li>
                <li className="list__item">100 GB SSD Sotrage</li>
                <li className="list__item">3 GB RAM</li>
              </ul>
              <button className="btn btn--outline btn--block">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="block container">
      <header className="block__header">
        <h2>Host on the Cloud to Keep Growing</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed,
          voluptatem.
        </p>
      </header>
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-right">
          <span className="icon-container">
            <svg className="icon icon--primary">
              <use href="./assets/images/sprite.svg#easy"></use>
            </svg>
          </span>
          <h3 className="feature__heading">Super Easy to Use</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            obcaecati vel ad unde est illo at. Labore excepturi officia dolores!
          </p>
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a>
        </div>
        <picture data-aos="zoom-in-left">
          <source
            type="image/webp"
            srcset="./assets/images/easy.webp 1x, ./assets/images/easy@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/easy.jpg 1x, ./assets/images/easy@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/easy@2x.jpg" alt="" />
        </picture>
      </article>
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-up">
          <span className="icon-container">
            <svg className="icon icon--primary">
              <use href="./assets/images/sprite.svg#computer"></use>
            </svg>
          </span>
          <h3 className="feature__heading">Simply Fast Websites</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            obcaecati vel ad unde est illo at. Labore excepturi officia dolores!
          </p>
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a>
        </div>
        <picture>
          <source
            type="image/webp"
            srcset="./assets/images/fast.webp 1x, ./assets/images/fast@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/fast.jpg 1x, ./assets/images/fast@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/fast@2x.jpg" alt="" />
        </picture>
      </article>
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-up">
          <span className="icon-container">
            <svg className="icon icon--primary">
              <use href="./assets/images/sprite.svg#wordpress"></use>
            </svg>
          </span>
          <h3 className="feature__heading">Wordpress Made Easy</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            obcaecati vel ad unde est illo at. Labore excepturi officia dolores!
          </p>
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
          </a>
        </div>
        <picture>
          <source
            type="image/webp"
            srcset="./assets/images/wordpress.webp 1x, ./assets/images/wordpress@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/wordpress.jpg 1x, ./assets/images/wordpress@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/wordpress@2x.jpg" alt="" />
        </picture>
      </article>
      <article className="grid grid--1x2 feature">
        <div className="feature__content" data-aos="fade-left">
          <span className="icon-container">
            <svg className="icon icon--primary">
              <use href="./assets/images/sprite.svg#clock"></use>
            </svg>
          </span>
          <h3 className="feature__heading">24/7 Expert Support</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
            obcaecati vel ad unde est illo at. Labore excepturi officia dolores!
          </p>
          <a href="https://codewithmosh.com" target="_blank" className="link-arrow"
            >Learn More
            </a>
        </div>
        <picture data-aos="fade-right">
          <source
            type="image/webp"
            srcset="./assets/images/support.webp 1x, ./assets/images/support@2x.webp 2x"
          />
          <source
            type="image/jpg"
            srcset="./assets/images/support.jpg 1x, ./assets/images/support@2x.jpg 2x"
          />
          <img className="feature__image" src="./assets/images/support@2x.jpg" alt="" />
        </picture>
      </article>
    </section>
    <section className="block block--dark block--skewed-right block-showcase">
      <header className="block__header">
        <h2>User-friendly Control Panel</h2>
      </header>
      <div className="container grid grid--1x2">
        <picture data-aos="fade-right" className="block-showcase__image">
          <source
            type="image/webp"
            srcset="./assets/images/ipad.webp 1x, ./assets/images/ipad@2x.webp 2x"
          />
          <source
            type="image/png"
            srcset="./assets/images/ipad.png 1x, ./assets/images/ipad@2x.png 2x"
          />
          <img src="./assets/images/ipad.png" alt="" />
        </picture>
        <ul className="list" data-aos="fade-up">
          <li>
            <div className="media">
              <div className="media__image">
                <svg className="icon icon--primary">
                  <use href="./assets/images/sprite.svg#snap"></use>
                </svg>
              </div>
              <div className="media__body">
                <h3 className="media__title">Easy Start & Managed Updates</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veniam quisquam, ex nostrum vero voluptates dicta excepturi
                  vel perspiciatis consequuntur ab.
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="media">
              <div className="media__image">
                <svg className="icon icon--primary">
                  <use href="./assets/images/sprite.svg#growth"></use>
                </svg>
              </div>
              <div className="media__body">
                <h3 className="media__title">Staging, GIT & WP-CLI</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veniam quisquam, ex nostrum vero voluptates dicta excepturi
                  vel perspiciatis consequuntur ab.
                </p>
              </div>
            </div>
          </li>
          <li>
            <div className="media">
              <div className="media__image">
                <svg className="icon icon--primary">
                  <use href="./assets/images/sprite.svg#wordpress"></use>
                </svg>
              </div>
              <div className="media__body">
                <h3 className="media__title">Dynamic Caching & More</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veniam quisquam, ex nostrum vero voluptates dicta excepturi
                  vel perspiciatis consequuntur ab.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section className="block" data-aos="zoom-in">
      <header className="block__header">
        <h2>What our Customers are Saying</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, ipsam.
        </p>
      </header>
      <div className="container">
        <div className="card testimonial">
          <div className="grid grid--1x2">
            <div className="testimonial__image">
              <img
                src="./assets/images/testimonial.jpg"
                alt="A happy, smiling customer"
              />
              <span className="icon-container icon-container--accent">
                <svg className="icon icon--white icon--small">
                  <use href="./assets/images/sprite.svg#quotes"></use>
                </svg>
              </span>
            </div>
            <blockquote className="quote">
              <p className="quote__text">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt optio officiis dolore earum error eaque perferendis
                laudantium sed praesentium dolorum.
              </p>
              <footer>
                <div className="media">
                  <div className="media__image">
                    <svg className="icon icon--primary quote__line">
                      <use href="./assets/images/sprite.svg#line"></use>
                    </svg>
                  </div>
                  <div className="media__body">
                    <h3 className="media__title quote__author">John Smith</h3>
                    <p className="quote__organization">ABC Company</p>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
    <div className="container">
      <div className="callout callout--primary callout-signup">
        <div className="grid grid--1x2">
          <div className="callout__content">
            <h2 className="callout__heading">Ready to Get Started?</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi
              voluptate tempora qui distinctio consequatur aliquid pariatur
              cupiditate quas cum fugit.
            </p>
          </div>
          <a
            target="_blank"
            href="https://codewithmosh.com"
            className="btn btn--secondary btn--stretched"
            >Get Started
          </a>
        </div>
      </div>
    </div>
    <footer className="block block--dark footer">
      <div className="container grid footer__sections">
        <section className="collapsible collapsible--expanded footer__section">
          <div className="collapsible__header">
            <h2 className="collapsible__heading footer__heading">Products</h2>
            <svg className="icon icon--white collapsible__chevron">
              <use href="./assets/images/sprite.svg#chevron"></use>
            </svg>
          </div>
          <div className="collapsible__content">
            <ul className="list">
              <li><a href="#">Website Hosting</a></li>
              <li><a href="#">Free Automated Wordpress</a></li>
              <li><a href="#">Migrations</a></li>
            </ul>
          </div>
        </section>
        <section className="collapsible footer__section">
          <div className="collapsible__header">
            <h2 className="collapsible__heading footer__heading">Company</h2>
            <svg className="icon icon--white collapsible__chevron">
              <use href="./assets/images/sprite.svg#chevron"></use>
            </svg>
          </div>
          <div className="collapsible__content">
            <ul className="list">
              <li><a href="#">About</a></li>
              <li><a href="#">Affiliates</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
        </section>
        <section className="collapsible footer__section">
          <div className="collapsible__header">
            <h2 className="collapsible__heading footer__heading">Support</h2>
            <svg className="icon icon--white collapsible__chevron">
              <use href="./assets/images/sprite.svg#chevron"></use>
            </svg>
          </div>
          <div className="collapsible__content">
            <ul className="list">
              <li><a href="#">Contact</a></li>
              <li><a href="#">Knowledge Base</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </section>
        <section className="collapsible footer__section">
          <div className="collapsible__header">
            <h2 className="collapsible__heading footer__heading">Domains</h2>
            <svg className="icon icon--white collapsible__chevron">
              <use href="./assets/images/sprite.svg#chevron"></use>
            </svg>
          </div>
          <div className="collapsible__content">
            <ul className="list">
              <li><a href="#">Domain Checker</a></li>
              <li><a href="#">Domain Transfer</a></li>
              <li><a href="#">Free Domain</a></li>
            </ul>
          </div>
        </section>
        <div className="footer__brand">
          <img src="./assets/images/logo.svg" alt="" />
          <p className="footer__copyright">Copyright 2020 Mosh Hamedani</p>
        </div>
      </div>
    </footer>
    </Box>
    </>
  );
}
export default LandingPage
