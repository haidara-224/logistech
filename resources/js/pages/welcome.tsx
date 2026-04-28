
import { About } from "@/components/LandingPage/About";
import { Contact } from "@/components/LandingPage/Contact";
import { CTABanner } from "@/components/LandingPage/CTA";
import { Gallery } from "@/components/LandingPage/Gallery";
import { Hero } from "@/components/LandingPage/Hero";
import { Services } from "@/components/LandingPage/Services";
import { Testimonials } from "@/components/LandingPage/Testimonial";
import AppLayout from "@/layouts/LandindLayout";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";


export default function Welcome() {
      const { isAdmin, isSuperAdmin } = usePage().props as any;
       const [devisOpen, setDevisOpen] = useState(false);
        useEffect(() => {
               // Gestion du scroll quand le modal est ouvert
               if (devisOpen) {
                   document.body.style.overflow = "hidden";
               } else {
                   document.body.style.overflow = "";
               }
               return () => {
                   document.body.style.overflow = "";
               };
           }, [devisOpen]);
       
    return (
        <AppLayout  isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}>
          <Head title="Logistech Equip +"/>
            <Hero onDevis={() => setDevisOpen(true)} />
            <Services onDevis={() => {}} />
            <About onDevis={() => {}} />
            <Gallery onDevis={() => {}} />
            <Testimonials />
            <CTABanner onDevis={() => {}} />
            <Contact />
        </AppLayout>
    );
}