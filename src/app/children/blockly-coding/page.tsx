'use client'
import dynamic from 'next/dynamic';
import React from 'react'

const ClientSideComponent = dynamic(
    () => import('./blockly-driver'),
    { ssr: false }
);

export default function Page() {
    
    return <ClientSideComponent />;
}
