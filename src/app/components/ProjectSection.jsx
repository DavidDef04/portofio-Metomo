"use client";
import React, { useRef, useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";
import AboutBackground from "./background/AboutBackground";
import projectData from "@/data/projects";

const tags = ["All", "Web", "Mobile", "Cybersecurity"];

const ProjectSection = () => {
  const [tag, setTag] = useState("All");

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, threshold: 0.2 });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projectData)) return [];
    return tag === "All"
      ? projectData
      : projectData.filter((p) => p.tag.includes(tag));
  }, [tag]);

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <motion.section
      id="projects"
      className="relative py-12 px-4 sm:px-2 md:px-12 z-10"
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AboutBackground />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center z-10">
          My Projects
        </h2>

        <div className="text-white flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 z-10">
          {tags.map((t) => (
            <ProjectTag
              key={t}
              name={t}
              isSelected={tag === t}
              onClick={() => handleTagChange(t)}
              aria-pressed={tag === t}
            />
          ))}
        </div>

        <ul className="grid gap-10 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-6 sm:px-4 md:px-0 w-full">
          {filteredProjects.map((project, index) => (
            <motion.li
              key={project.id}
              variants={cardVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                imgUrl={project.image}
                gitUrl={project.gitUrl}
                linkUrl={project.linkUrl}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
};

export default ProjectSection;
