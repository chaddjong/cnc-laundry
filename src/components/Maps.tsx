'use client';

import React from 'react';

export default function Maps() {
  return (
    <div className="w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13652.9187492977!2d124.99465317111576!3d1.41462756369196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32870f53b3849835%3A0xb36313dadbd50155!2sCnC%20Laundry%20cogan%20home!5e0!3m2!1sen!2sid!4v1763176039011!5m2!1sen!2sid"
        style={{ width: '100%', height: '300px', border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
