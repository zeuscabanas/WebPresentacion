import React from 'react';
import { motion } from 'framer-motion';

const Contact = ({ name, phone, email, age }) => {
  return (
    <motion.div
      className="contact p-4 flex flex-col items-start bg-gray-700 border-2 border-green-500 rounded-lg shadow-lg text-sm sm:text-base md:text-lg lg:text-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '700px' }} // Ajustar el ancho máximo del componente
    >
      <h2 className="text-base sm:text-xl md:text-2xl font-bold text-green-500 mb-4">Contact Information</h2>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-300"><strong>Name:</strong> {name}</p>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-300"><strong>Phone:</strong> {phone}</p>
      <div className="hidden sm:block">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-300"><strong>Email:</strong> {email}</p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-300"><strong>Age:</strong> {age}</p>
      </div>
    </motion.div>
  );
};

export default Contact;
