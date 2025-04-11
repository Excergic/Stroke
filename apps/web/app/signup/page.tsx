"use client";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import SignupForm from '../components/SignupForm'; // Adjust path

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient">
      <Link href="/" className="footer-link" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
        <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Back to home
      </Link>
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <SignupForm />
      </div>
    </div>
  );
}