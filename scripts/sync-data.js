
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtpzidhagklgwyffzcxo.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cHppZGhhZ2tsZ3d5ZmZ6Y3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTM0NDIsImV4cCI6MjA4NTY4OTQ0Mn0.eUx0kTIqkleD13roSsEyBwfWi22ULC-S7z5LuFBJ-cI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Data paths (pointing to moviebox-api data)
const MOVIES_FILE = path.join(__dirname, '..', '..', 'moviebox-api', 'data', 'movies.json');
const SERIES_FILE = path.join(__dirname, '..', '..', 'moviebox-api', 'data', 'series.json');

async function syncData() {
    console.log('🔄 Starting sync to Supabase...');

    try {
        // 1. Read data
        console.log('📖 Reading local data files...');
        if (!fs.existsSync(MOVIES_FILE)) throw new Error('Movies file not found!');

        const movies = JSON.parse(fs.readFileSync(MOVIES_FILE, 'utf-8'));
        const series = JSON.parse(fs.readFileSync(SERIES_FILE, 'utf-8'));

        console.log(`✅ Loaded ${movies.length} movies and ${series.length} series`);

        // 2. Transform data for Supabase
        // Schema: id, title, description, type, release_date, cover, genre, rating
        const transform = (item, type) => ({
            id: item.subjectId,
            title: item.title,
            description: item.description || '',
            type: type,
            release_date: item.releaseDate || null,
            cover: item.cover?.url || item.cover,
            genre: item.genre,
            rating: parseFloat(item.imdbRatingValue || 0),
            raw_data: item
        });

        const moviesData = movies.map(m => transform(m, 'movie'));
        const seriesData = series.map(s => transform(s, 'series'));
        const allData = [...moviesData, ...seriesData];

        // 3. Insert into Supabase in chunks
        console.log('🚀 Uploading to Supabase (this may take a while)...');

        const CHUNK_SIZE = 100;
        for (let i = 0; i < allData.length; i += CHUNK_SIZE) {
            const chunk = allData.slice(i, i + CHUNK_SIZE);

            const { error } = await supabase
                .from('content')
                .upsert(chunk, { onConflict: 'id' });

            if (error) {
                console.error(`❌ Error uploading chunk ${i}:`, error.message);
                // If error is "relation 'content' does not exist", we need to create the table
                if (error.message.includes('relation "content" does not exist')) {
                    console.error('⚠️ Table "content" does not exist! Please run the SQL initialization script.');
                    // Break to avoid spamming errors
                    return;
                }
            } else {
                console.log(`   ✅ Uploaded ${i + chunk.length}/${allData.length} items`);
            }
        }

        console.log('🎉 Sync complete!');

    } catch (error) {
        console.error('❌ Sync failed:', error.message);
    }
}

syncData();
