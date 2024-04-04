import React from 'react';
import { grid } from 'ldrs'

grid.register()

const LoadingComp = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}>
            <l-grid
                size="60"
                speed="1.5" 
                color="black" 
            ></l-grid>
        </div>
    );
};

export default LoadingComp;
