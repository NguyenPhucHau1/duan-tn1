'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Tải động để tránh lỗi SSR
const QrScanner = dynamic(() => import('react-qr-scanner'), { ssr: false });

const QRScannerPage = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true); // Biến để kiểm soát việc quét

  const handleScan = async (data) => {
    if (data && scanning) {
      const scannedText = data.text;
      setResult(scannedText);
      console.log('Kết quả quét:', scannedText);

      // Kiểm tra QR hợp lệ
      if (!scannedText || !/^[a-zA-Z0-9]+$/.test(scannedText)) {
        Swal.fire({
          icon: 'error',
          title: 'Mã QR không hợp lệ',
          text: 'Vui lòng quét lại mã QR hợp lệ.',
          confirmButtonText: 'OK',
        });
        return;
      }

      // Gọi API để kiểm tra trạng thái hóa đơn
      const apiUrl = `http://localhost:3000/hoadon/qrcheckin/${scannedText}`;
      try {
        const response = await fetch(apiUrl, { method: 'PUT' });

        if (response.ok) {
          const result = await response.json();
          console.log('Cập nhật thành công:', result);

          Swal.fire({
            icon: 'success',
            title: 'Check-in thành công',
            text: `Hóa đơn ${result.hoadon._id} đã được cập nhật trạng thái.`,
            confirmButtonText: 'OK',
          });

          // Ngừng quét sau khi đã quét thành công
          setScanning(false);
        } else {
          const error = await response.json();
          console.error('Lỗi:', error);

          Swal.fire({
            icon: 'error',
            title: 'Không hợp lệ',
            text: error.message,
            confirmButtonText: 'Thử lại',
          });
        }
      } catch (err) {
        console.error('Lỗi khi gọi API:', err);

        Swal.fire({
          icon: 'error',
          title: 'Lỗi hệ thống',
          text: 'Không thể kết nối với server.',
          confirmButtonText: 'Thử lại',
        });
      }
    }
  };

  const handleError = (err) => {
    console.error('Lỗi quét mã QR:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi quét mã QR',
      text: 'Không thể quét mã QR. Vui lòng thử lại.',
      confirmButtonText: 'OK',
    });
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Quét mã QR</h1>
      <QrScanner
        delay={300}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
        facingMode="environment" // Quét camera sau
      />
      <p>Kết quả: {result || 'Chưa có kết quả'}</p>
    </div>
  );
};

export default QRScannerPage;
