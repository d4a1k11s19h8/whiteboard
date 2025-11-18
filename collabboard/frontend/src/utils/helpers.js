export const generateRoomCode = () => {
    const adjectives = ['swift', 'quick', 'smart', 'bold', 'clear', 'sharp', 'bright'];
    const nouns = ['star', 'moon', 'sun', 'wave', 'tree', 'cloud', 'river'];
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}-${noun}-${number}`;
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const isMobile = () => {
    return window.innerWidth <= 768;
};