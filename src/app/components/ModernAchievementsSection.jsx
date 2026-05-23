"use client";
import React, { useEffect, useState } from "react";
import { FaGithub, FaUsers, FaCalendarAlt, FaStar } from "react-icons/fa";

const ModernAchievementsSection = () => {
  const [stats, setStats] = useState({
    projects: 0,
    visitors: 500,
    experience: 3,
  });

  useEffect(() => {
    // GitHub sync simulation
    const fetchGitHubData = async () => {
      try {
        const response = await fetch('/api/sync-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            githubUsernames: ['DavidDef04', 'alcdigitaldeveloppeur01'],
            maxProjects: 10,
            includeCollaborations: true
          })
        });
        
        const data = await response.json();
        if (data.success) {
          setStats(prev => ({ ...prev, projects: data.projects.length }));
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchGitHubData();
  }, []);

  const achievements = [
    {
      icon: FaGithub,
      value: stats.projects,
      label: "Projets GitHub",
      description: "Dépôts synchronisés"
    },
    {
      icon: FaUsers,
      value: stats.visitors,
      label: "Visiteurs",
      description: "Portfolio visits"
    },
    {
      icon: FaCalendarAlt,
      value: stats.experience,
      label: "Années d'expérience",
      description: "Depuis 2021"
    },
    {
      icon: FaStar,
      value: stats.projects * 2,
      label: "Stars GitHub",
      description: "Total stars"
    }
  ];

  return (
    <section id="achievements" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Réalisations & Statistiques
            </span>
          </h2>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <achievement.icon className="text-white text-2xl" />
              </div>
              
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                {achievement.value}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">
                {achievement.label}
              </h3>
              
              <p className="text-gray-400 text-sm">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernAchievementsSection;