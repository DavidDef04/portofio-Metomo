"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import projectData from "@/data/projects";

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
});

const AchievementsSection = () => {
  const totalProjects = Array.isArray(projectData)
    ? projectData.filter((p) => p.tag.includes("All")).length
    : 0;

  const [stats, setStats] = useState({
    projects: totalProjects,
    visitors: 2,
    experience: 3,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats((prev) => ({
          ...prev,
          visitors: data.visitors,
          experience: data.experience,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des stats :", error);
      }
    };

    fetchStats();
  }, []);

  const achievementsList = [
    {
      metric: "Projects",
      value: stats.projects,
      postfix: "+",
    },
    {
      prefix: "~",
      metric: "Users",
      value: stats.visitors,
      postfix: "+",
    },
    {
      metric: "Years",
      value: stats.experience,
    },
  ];

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-8 px-4 sm:py-16 sm:px-8 xl:px-12"
    >
      <div className="border-[#33353F] border rounded-md py-8 px-4 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4">
        {achievementsList.map((achievement, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full sm:w-1/2 md:w-1/4"
          >
            <h2 className="text-white text-4xl font-bold flex items-center">
              {achievement.prefix && (
                <span className="mr-1">{achievement.prefix}</span>
              )}
              <AnimatedNumbers
                includeComma
                animateToNumber={achievement.value}
                locale="fr-CM"
                className="text-white text-4xl font-bold"
                configs={(_, i) => ({
                  mass: 1,
                  friction: 100,
                  tension: 140 * i,
                })}
              />
              {achievement.postfix && (
                <span className="ml-1">{achievement.postfix}</span>
              )}
            </h2>
            <p className="text-[#ADB7BE] text-center mt-2">{achievement.metric}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AchievementsSection;
