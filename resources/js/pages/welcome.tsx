
import { About } from "@/components/LandingPage/About";
import { Contact } from "@/components/LandingPage/Contact";
import { CTABanner } from "@/components/LandingPage/CTA";
import { Gallery } from "@/components/LandingPage/Gallery";
import { Hero } from "@/components/LandingPage/Hero";
import { Services } from "@/components/LandingPage/Services";
import { Testimonials } from "@/components/LandingPage/Testimonial";
import AppLayout from "@/layouts/LandindLayout";
import { Head, usePage } from "@inertiajs/react";


export default function Welcome() {
      const { isAdmin, isSuperAdmin } = usePage().props as any;
    return (
        <AppLayout  isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}>
          <Head title="Logistech Equip +"/>
            <Hero onDevis={() => {}} />
            <Services onDevis={() => {}} />
            <About onDevis={() => {}} />
            <Gallery onDevis={() => {}} />
            <Testimonials />
            <CTABanner onDevis={() => {}} />
            <Contact />
        </AppLayout>
    );
}