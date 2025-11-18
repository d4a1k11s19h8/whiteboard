import React from 'react';

const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: '#333',
            color: '#fff',
            padding: '15px 0',
            textAlign: 'center',
            flexShrink: 0 
        }
    };

    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} CollabBoard. All rights reserved.</p>
        </footer>
    );
};

export default Footer;