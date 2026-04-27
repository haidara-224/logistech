import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';


export default function ProduitsShow() {

  
    return (
        <>
            <Head title={'Produit'} />
            
        </>
    );
}

ProduitsShow.layout = {
    breadcrumbs: [{ title: 'Produits', href: '/produits' }],
};
