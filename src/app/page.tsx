'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Row from '@/components/Row';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [heroMovie, setHeroMovie] = useState<any>(null);

  useEffect(() => {
    // Fetch data from Supabase
    const fetchData = async () => {
      // Fetch movies
      const { data: moviesData } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'movie')
        .limit(20);

      if (moviesData) setMovies(moviesData);

      // Fetch series
      const { data: seriesData } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'series')
        .limit(20);

      if (seriesData) setSeries(seriesData);

      // Fetch trending (mix)
      const { data: trendingData } = await supabase
        .from('content')
        .select('*')
        .order('rating', { ascending: false })
        .limit(20);

      if (trendingData) {
        setTrending(trendingData);
        // Set random hero movie
        setHeroMovie(trendingData[Math.floor(Math.random() * trendingData.length)]);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen bg-[#141414] pb-24">
      <Navbar />
      <Hero movie={heroMovie} />

      <section className="flex flex-col gap-8 md:gap-12 mt-[-100px] md:mt-[-150px] relative z-20 pl-4 md:pl-12 pb-12">
        <Row title="Trending Now" data={trending} />
        <Row title="New Releases" data={movies} />
        <Row title="TV Shows" data={series} />
        <Row title="Action Movies" data={movies.filter(m => m.genre?.includes('Action'))} />
        <Row title="Comedies" data={movies.filter(m => m.genre?.includes('Comedy'))} />
        <Row title="Sci-Fi & Fantasy" data={movies.filter(m => m.genre?.includes('Sci-Fi'))} />
      </section>

      <Footer />
    </main>
  );
}
