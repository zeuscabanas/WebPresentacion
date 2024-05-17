import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Skill from './Skill';
import Education from './Education';
import Experience from './Experience';
import Project from './Project';
import Contact from './Contact';
import characterImage from '../assets/character.png'; // Importa tu imagen aquí
import data from '../data.json'; // Importa los datos desde el archivo JSON

const images = require.context('../assets', false, /\.(png|jpe?g|svg)$/);

const categories = {
  skills: data.skills,
  education: data.education,
  experience: data.experience,
  projects: data.projects,
};

const categoryNames = Object.keys(categories);

const SkillSheet = () => {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [screenHeight, setScreenHeight] = useState('90vh');

  const handlePrev = () => {
    setCategoryIndex((prevIndex) => (prevIndex === 0 ? categoryNames.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCategoryIndex((prevIndex) => (prevIndex === categoryNames.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const contentHeight = document.querySelector('.skills-grid').clientHeight;
    if (contentHeight > 400) {
      setScreenHeight(contentHeight + 400);
    } else {
      setScreenHeight('90vh');
    }
  }, [categoryIndex]);

  const category = categoryNames[categoryIndex];

  const renderCategoryItems = () => {
    switch (category) {
      case 'skills':
        return categories[category].map((item, index) => (
          <Skill key={index} name={item.name} level={item.level} />
        ));
      case 'education':
        return categories[category].map((item, index) => (
          <Education
            key={index}
            name={item.name}
            level={item.level}
            duration={item.duration}
            description={item.description}
          />
        ));
      case 'experience':
        return categories[category].map((item, index) => (
          <Experience
            key={index}
            name={item.name}
            level={item.level}
            duration={item.duration}
            role={item.role}
          />
        ));
      case 'projects':
        return categories[category].map((item, index) => {
          const projectImage = images(`./${item.image}`);
          return (
            <Project
              key={index}
              name={item.name}
              level={item.level}
              description={item.description}
              image={projectImage}
            />
          );
        });
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="skill-sheet p-6 rounded-lg shadow-lg flex flex-col items-center relative"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '90vw', height: screenHeight, overflow: 'hidden' }}
    >
      <div className="flex flex-col md:flex-row w-full justify-center items-center mb-6">
        <motion.div
          className="character-image mb-6 md:mb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ width: '20%' }} // Ajusta el ancho de la imagen al 20%
        >
          <img
            src={characterImage} // Usar tu imagen importada aquí
            alt="Character"
            className="w-full h-auto rounded-full border-4 border-green-500"
          />
        </motion.div>
        <div className="md:ml-8 w-full md:w-auto"> {/* Añadir margen izquierdo en pantallas grandes */}
          <Contact
            name={data.contact.name}
            phone={data.contact.phone}
            email={data.contact.email}
            age={data.contact.age}
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full mb-6">
        <button
          className="px-4 py-2 rounded-full flex items-center justify-center mx-4 rotate-180"
          onClick={handlePrev}
        >
          <span className="material-icons">double_arrow</span>
        </button>
        <h2 className="text-3xl font-bold text-center text-green-500 flex-grow">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>
        <button
          className="px-4 py-2 rounded-full flex items-center justify-center mx-4"
          onClick={handleNext}
        >
          <span className="material-icons">double_arrow</span>
        </button>
      </div>
      <div className="skills-grid grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto overflow-x-hidden" style={{ maxHeight: '50vh', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {renderCategoryItems()}
      </div>
    </motion.div>
  );
};

export default SkillSheet;
