import React from 'react';
import { motion } from 'framer-motion';

const ProjectDetail = ({ name, description, image, onClose }) => {
  return (
    <motion.div
      className="project-detail fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-800 border-4 border-green-500 rounded-lg p-6 max-w-lg w-full relative">
        <button
          className="absolute top-2 right-2 text-green-500"
          onClick={onClose}
        >
          <span className="material-icons">close</span>
        </button>
        <h2 className="text-3xl font-bold text-green-500 mb-4">{name}</h2>
        <p className="text-lg text-green-300 mb-4">{description}</p>
        <img src={image} alt={name} className="w-full h-auto rounded-lg" />
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
