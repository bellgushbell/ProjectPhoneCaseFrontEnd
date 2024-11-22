import React from 'react';
import loadingAnimationUrl from '../../assets/editloading.gif'; // ใช้ import สำหรับไฟล์ GIF

const LoadingEditLoading = () => {
    return (
        <div style={styles.container}>
            <img src={loadingAnimationUrl} alt="Loading..." style={styles.image} />
            <div style={styles.loadingText}>Loading ...</div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',  // ปรับให้เต็มความสูงของการ์ด
        width: '100%',   // ปรับให้เต็มความกว้างของการ์ด
        textAlign: 'center',
        backgroundColor: '#f0f0f0', // สีพื้นหลังเป็นเทาอ่อน
    },
    image: {
        width: '150px', // ขนาดภาพ
        height: '150px', // ขนาดภาพ
        marginBottom: '20px', // เพิ่มระยะห่างด้านล่างของภาพ
    },
    loadingText: {
        fontSize: '24px', // ขนาดตัวอักษร
        color: '#FF6AD3', // สีตัวอักษร
        fontWeight: 'bold', // ตัวหนา
        animation: 'fadeIn 1s ease-in-out', // เพิ่มอนิเมชัน
    },
    '@keyframes fadeIn': {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
    },
};

export default LoadingEditLoading;
