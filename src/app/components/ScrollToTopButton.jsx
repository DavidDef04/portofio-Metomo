import React, { useState, useEffect} from 'react';



const ScrollToTopButton = () => {

    const [isVisible, setIsVisible] = useState(false);

    // // Fonction pour détecter le scroll et afficher ou cacher le bouton
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };


     useEffect(() => {
        windows.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        }
     }, []);


  
    const scrollToHome = () => {
        const HeroSection = document.getElementById("home");
        if ( HeroSection) {
            HeroSection.scrollIntoView({behavior: "smooth"});
        }
    };



  return (
    <button onClick={scrollToHome} className={`fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-110 ${isVisible ? 'opacity-100' : "opacity-0 pointer-events-none"}`}>
        <span className='text-xl'>↑</span>
    </button>
  )
}

export default ScrollToTopButton