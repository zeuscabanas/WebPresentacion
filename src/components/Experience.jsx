import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Experience = ({ name, level, duration, role }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="experience p-4 flex flex-col items-start"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ minWidth: '300px', width: '100%' }} // Fijar el ancho mínimo y completo
    >
      <div className="flex items-center w-full">
        <div className="experience-icon bg-green-500 p-2 rounded-full mr-4 "></div>
        <div className="experience-details flex-1">
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="experience-bar bg-gray-300 h-4 rounded-full overflow-hidden">
            <div
              className="experience-level bg-blue-500 h-full"
              style={{ width: `${level}%` }}
            ></div>
          </div>
        </div>
      </div>
      <motion.div
        className="additional-info mt-2 w-full text-xs" // Asegurar que la expansión ocurra verticalmente
        initial={{ height: 0, opacity: 0 }}
        animate={isHovered ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm"><strong>Duración:</strong> {duration}</p>
        <p className="text-sm"><strong>Rol:</strong> {role}</p>
      </motion.div>
    </motion.div>
  );
};

export default Experience;
