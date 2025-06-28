import { motion } from "framer-motion";

const CertificationModal = ({ imageSrc, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center px-4 z-25"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1e1e1e] rounded-lg p-4 max-w-3xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-xl font-bold hover:text-red-500"
        >
          &times;
        </button>
        <img
          src={imageSrc}
          alt="Certification"
          className="w-full max-h-[80vh] object-contain rounded-md"
        />
      </motion.div>
    </motion.div>
  );
};

export default CertificationModal;
