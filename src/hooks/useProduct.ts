import { useEffect, useState } from 'react'
import type {Product, useProductsExport} from '../types/interfaces'
import fakeProducts from '../utils/fakeProducts';
export default function useProducts():useProductsExport{
    const [products, setProducts] =useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProducts= async ()=>{
        try{
        const cachedProducts = localStorage.getItem('cache');
        if(cachedProducts){
            setProducts(JSON.parse(cachedProducts));
            setLoading(false);
        }else{
            try {
            const result = await fakeProducts(50)
            localStorage.setItem('cache', JSON.stringify(result));
            setProducts(result);

            } catch (error) {
             console.log('error: ',error);
               setLoading(false) 
            }
            
        }
        setLoading(false)
    }catch(err){
        console.log('error: ', err);
        setLoading(false)
        
    }
    }

    useEffect(()=>{
        loadProducts();
    },[])
    return{products, loading}
}