import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledJobsSection = styled.section`
  max-width: 900px;
  max-height:900px;

  .inner {
    display: flex;
    flex-direction: column;
  }


  &:before,
  .project-title {
    transition: var(--transition);
    color: var(--white);
  }
  .project-links {
    transition: var(--transition);
    color: var(--white);
  }
  .project-description {
    transition: var(--transition);
    color: var(--white);
  }
  .project-tech-list {
    li{
      transition: var(--transition);
      color: var(--lightest-green);
    }
  }

    &:hover,
      &:focus {
        outline: 0;
        .project-image {
        .img {
          background: transparent;
          filter: none;
        }
      }
    }

  .project-detail {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45%;
    display: flex;
    flex-direction: column;    
    align-items: left;
    justify-content: left;
    z-index: 1;
    /* add some padding to the element */
    padding: 10px;

    /* set the background color to black */
    background-color: var(--darkest-green);

    /* set the color of text inside the element to white */
    color: #fff;
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 5px 0 0px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      font-size: var(--fz-xs);
      white-space: nowrap;
    }
  }

  .project-content {
    display:flex;
    flex-direction: row;
  }

  .project-links {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;

    max-height: 50px;
  }

  .project-image {
    a {
      width: 100%;
      height: 55%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;

      &:hover,
      &:focus {
        background: transparent;
        outline: 0;
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 55%;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--darker-green);
        mix-blend-mode: screen;
      }
    }

    .img {
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(80%);
    }
  }
  .demo-link {
    ${({ theme }) => theme.mixins.bigVibrantButton};
    margin: auto;
    width: 50%;
    padding: 10px;
  }
`;

const StyledProjectCarousel = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  max-width: 900px;
  align-items: center;

  .project-links {
      justify-content: flex-start;
      margin-left: 0px;
      margin-right: 50px;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
  .project-image {
      grid-column: 1 / 8;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
`;

const Featured = () => {
  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 1280, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              tech
              github
              demo
              external
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(({ node }) => node);
  const revealSlider = useRef(null);
  const revealTitle = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealSlider.current, srConfig());
  }, []);

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <StyledJobsSection id="projects">
      <StyledProjectCarousel ref={revealSlider}>
      <h2 className="formatted-centered-heading" ref={revealTitle}>
        Projects
      </h2>
      <div className="project">
      <Slider {...settings}>
      {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, demo, cover, cta } = frontmatter;
            const image = getImage(cover);

            return (
                <div className="project-content" key={i}>
                  <div className="project-image">
                    <a href={external ? external : github ? github : '#'}>
                      <GatsbyImage image={image} alt={title} className="img"/>
                    </a>
                  </div>
                  <div className="project-detail">
                    <h3 className="project-title">
                      <a href={external}>{title}</a>
                    </h3>
                  <div
                      className="project-description"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />

                  {tech.length && (
                    <ul className="project-tech-list">
                    {tech.map((tech, i) => (
                      <li key={`tech-${i}`}>{tech}</li>
                    ))}
                    </ul>
                  )}
                  <div className="project-links">
                      {cta && (
                        <a href={cta} aria-label="Course Link" className="cta">
                          Learn More
                        </a>
                      )}
                      {github && (
                        <a href={github} aria-label="GitHub Link">
                          <Icon name="GitHub" />
                        </a>
                      )}
                      {demo && demo !== "" && (
                        <a href={demo} aria-label="Demo Link" className="demo-link" target="_blank" rel="noreferrer">
                          Demo
                        </a>
                      )}
                      {external && !cta && (
                        <a href={external} aria-label="External Link" className="external">
                          <Icon name="External" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
            );
          })}
        </Slider>
      </div>
      </StyledProjectCarousel>
    </StyledJobsSection>
  );
};

export default Featured;
