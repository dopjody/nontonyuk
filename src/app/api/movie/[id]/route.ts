import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;


    try {
        // Fetch movie from Supabase
        const { data: movie, error } = await supabase
            .from('content')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !movie) {
            // Return placeholder data for unknown movies
            return NextResponse.json({
                id,
                title: `Movie ${id}`,
                description: 'Movie information is being loaded...',
                cover: '',
                release_date: '',
                genre: 'Movie'
            });
        }

        return NextResponse.json(movie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        return NextResponse.json({
            id,
            title: `Movie ${id}`,
            description: 'Unable to load movie information',
            cover: '',
            release_date: '',
            genre: 'Unknown'
        });
    }
}
